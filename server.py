"""
IndicTrans2 backend for the Hindi <-> Santali translator.

Loads AI4Bharat's IndicTrans2 indic-indic distilled model once at startup
and exposes a small HTTP API that script.js calls for live translation.

SETUP
-----
    pip install fastapi "uvicorn[standard]" torch transformers IndicTransToolkit pydantic

RUN
---
    uvicorn server:app --host 0.0.0.0 --port 8000

Then in script.js, set API_BASE_URL to wherever this ends up running
(http://localhost:8000 for local dev).

NOTES
-----
- Works on CPU, but a GPU makes it far snappier. The 320M distilled model
  is the lightest indic-indic checkpoint AI4Bharat publishes; swap
  MODEL_NAME for "ai4bharat/indictrans2-indic-indic-1B" if you have a GPU
  and want higher quality.
- CORS below is wide open ("*") for easy local testing. Lock allow_origins
  down to your actual frontend origin before putting this on the public
  internet.
"""

import torch

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from IndicTransToolkit import IndicProcessor
from nipun_api import router as nipun_router
app = FastAPI(title="Hindi-Santali IndicTrans2 backend")
app.include_router(nipun_router)
MODEL_NAME = "ai4bharat/indictrans2-indic-indic-dist-320M"  # direct hi<->sat, no English hop
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# FLORES-200 style codes IndicTrans2 expects
LANG_CODES = {
    "hindi": "hin_Deva",
    "santali": "sat_Olck",
}

app = FastAPI(title="Hindi-Santali IndicTrans2 backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"Loading {MODEL_NAME} on {DEVICE} ... (first run downloads the model, can take a while)")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME, trust_remote_code=True).to(DEVICE)
model.eval()
processor = IndicProcessor(inference=True)
print("Model ready.")


class TranslateRequest(BaseModel):
    text: str
    source: str  # "hindi" | "santali"
    target: str  # "hindi" | "santali"


class TranslateResponse(BaseModel):
    translation: str
    source_lang: str
    target_lang: str


@app.post("/translate", response_model=TranslateResponse)
def translate(req: TranslateRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(400, "text is empty")
    if req.source not in LANG_CODES or req.target not in LANG_CODES:
        raise HTTPException(400, "source/target must be 'hindi' or 'santali'")
    if req.source == req.target:
        raise HTTPException(400, "source and target must differ")

    src_lang = LANG_CODES[req.source]
    tgt_lang = LANG_CODES[req.target]

    batch = processor.preprocess_batch([text], src_lang=src_lang, tgt_lang=tgt_lang)
    inputs = tokenizer(
        batch,
        truncation=True,
        padding="longest",
        return_tensors="pt",
        return_attention_mask=True,
    ).to(DEVICE)

    with torch.no_grad():
        generated_tokens = model.generate(
            **inputs,
            use_cache=True,
            min_length=0,
            max_length=256,
            num_beams=5,
            num_return_sequences=1,
        )

    with tokenizer.as_target_tokenizer():
        decoded = tokenizer.batch_decode(
            generated_tokens.detach().cpu().tolist(),
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )

    translation = processor.postprocess_batch(decoded, lang=tgt_lang)[0]
    return TranslateResponse(translation=translation, source_lang=src_lang, target_lang=tgt_lang)


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME, "device": DEVICE}
