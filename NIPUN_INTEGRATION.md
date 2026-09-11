# PALASH NIPUN Bharat add-on

This add-on adds a NIPUN Bharat-aligned FLN lesson builder to the existing Hindi↔Santali PALASH prototype.

## What it adds

- Grade selector: Balvatika, Grade 1, Grade 2, Grade 3
- FLN domain selector: literacy / numeracy
- Competency selector
- Topic input
- Lesson/activity generation
- Assessment prompt
- Optional worksheet content
- Offline fallback in the browser
- Local JSON catalog, so the catalog itself works without internet

## Important alignment note

The JSON is an application-side starter alignment layer. It is NOT the complete official NIPUN Bharat curriculum and should not be presented as an official reproduction. The Ministry of Education describes NIPUN Bharat as a national mission focused on foundational literacy and numeracy, with the goal of children attaining foundational skills by the end of Grade 3. The official NIPUN Bharat guidelines and government resources should remain the authority for final competency/outcome mapping.

## Installation

Put these files beside your existing `server.py`:

- nipun_curriculum.json
- nipun_api.py

Then add these two lines to `server.py` after `app = FastAPI(...)`:

    from nipun_api import router as nipun_router
    app.include_router(nipun_router)

Your existing IndicTrans2 translation endpoint stays unchanged.

Put `nipun_integration.js` in the same frontend folder as your current JavaScript and add this before `</body>` in the HTML:

    <script src="./nipun_integration.js"></script>

The script dynamically creates the NIPUN panel, so no major HTML redesign is required.

## Run

    pip install fastapi uvicorn pydantic
    uvicorn server:app --host 0.0.0.0 --port 8000

Open the existing PALASH frontend.

## Recommended next step

After this works, replace the starter activity generator with a richer local curriculum engine and connect worksheet/flashcard rendering to the existing worksheet button. For the competition demo, show:

Hindi topic -> NIPUN competency -> bilingual activity -> assessment -> printable worksheet.

## Why this is useful for the challenge

Your current app already has Hindi↔Santali translation through IndicTrans2 and a local phrase fallback. The new layer turns that translator into a teacher-facing FLN workflow rather than leaving NIPUN alignment as a claim.
