import json
from fastapi import FastAPI


app = FastAPI()

@app.get("/api/demo")
def read_demo():
    return { "message": "Backend is Running", "status": "success" }

def generate_mock_json():
    data = {
        "last_updated": "2026-04-12",
        "items": [
            { "title": "Hello from Python" }
        ]
    }

    with open("../frontend/public/data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


if __name__ == "__main__":
    generate_mock_json()