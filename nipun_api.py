"""PALASH NIPUN Bharat alignment API.

Add to the existing FastAPI server:
    from nipun_api import router as nipun_router
    app.include_router(nipun_router)

Keep nipun_curriculum.json beside server.py.
"""
from pathlib import Path
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

BASE = Path(__file__).resolve().parent
DATA_FILE = BASE / "nipun_curriculum.json"
router = APIRouter(prefix="/nipun", tags=["NIPUN Bharat"])

with DATA_FILE.open("r", encoding="utf-8") as f:
    CATALOG = json.load(f)

class GenerateRequest(BaseModel):
    grade: str
    domain: str
    competency_id: str
    topic: str = ""
    worksheet: bool = False

def find_competency(req: GenerateRequest):
    for grade in CATALOG["grades"]:
        if grade["id"] != req.grade:
            continue
        for competency in grade["competencies"]:
            if competency["id"] == req.competency_id and competency["domain"] == req.domain:
                return grade, competency
    raise HTTPException(404, "Competency not found")

@router.get("/catalog")
def catalog():
    return CATALOG

@router.post("/generate")
def generate(req: GenerateRequest):
    grade, competency = find_competency(req)
    topic = req.topic.strip() or competency["title"]

    if competency["domain"] == "literacy":
        steps = [
            f"Introduce the topic '{topic}' using a familiar local object, picture or short story.",
            "Say the key word(s) in Hindi and use the PALASH Hindi↔Santali translator to provide the bilingual form.",
            "Ask learners to listen, repeat and identify the relevant sound, word or meaning.",
            "Give one short reading/oral-language task and let learners explain their answer."
        ]
    else:
        steps = [
            f"Introduce '{topic}' with concrete local materials such as seeds, stones or sticks.",
            "Count, compare or manipulate the objects while saying the Hindi terms.",
            "Use PALASH to provide the corresponding Santali classroom language.",
            "Ask learners to solve one similar problem independently and explain how they got the answer."
        ]

    assessment = CATALOG["activity_templates"]["assessment"]

    result = {
        "grade": grade["label"],
        "domain": competency["domain"],
        "competency": competency,
        "lesson": {
            "topic": topic,
            "objective": competency["outcomes"][0],
            "teacher_steps": steps,
            "bilingual_prompts": [
                f"Hindi: {topic}",
                "Santali: Generate/verify the classroom wording with the PALASH translator and local teacher review."
            ],
            "assessment": assessment
        },
        "offline": True
    }

    if req.worksheet:
        result["worksheet"] = {
            "title": f"{grade['label']} · {competency['title']}",
            "instructions": "Teacher may print this activity after local-language review.",
            "items": [
                f"1. Work with the topic: {topic}.",
                "2. Complete one matching/identification task.",
                "3. Complete one application task.",
                "4. Answer one short oral question."
            ]
        }
    return result
