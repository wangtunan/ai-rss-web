import os
import json
import time
import re

from concurrent.futures import ThreadPoolExecutor, as_completed
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

def _chunks(list, size):
    for i in range(0, len(list), size):
        yield list[i:i+size]

def _build_user_prompt(batch):
    payload = [
        {
            "id": item["_id"],
            "title": item.get("title", ""),
            "category": item.get("category", ""),
            "content": (item.get("raw_content", "") or "")[:800],
            "link": item.get("link", ""),
        }
        for item in batch
    ]
    return (
        "请对每条资讯做中文摘要，返回严格 JSON，不要输出其他文字。\n"
        "输出格式："
        '{"items":[{"id":1,"summary":"...","tags":["..."],"importance":1-5}]}\n'
        f"输入数据：{json.dumps(payload, ensure_ascii=False)}"
    )

def _extract_json_text(text: str) -> str:
    """
    兼容模型返回 ```json 代码块``` 或前后带说明文字的场景
    """
    cleaned = text.strip()

    # 常见格式：```json ... ```
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z]*\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        return cleaned.strip()

    # 若包含多余文本，尽量抽取第一个 JSON 对象
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        return cleaned[start:end + 1]
    return cleaned

def _summary_one_batch(batch, retries: int = 3):
    system_prompt = "你是资讯摘要助手，必须只输出合法 JSON。"
    user_prompt = _build_user_prompt(batch)

    for attempt in range(retries):
        try:
            req = {
                "model": os.getenv("OPENAI_MODEL"),
                "temperature": 0.2,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            }
            # 兼容支持 JSON 强约束的兼容接口；不支持时走异常回退
            try:
                req["response_format"] = {"type": "json_object"}
                resp = client.chat.completions.create(**req)
            except Exception:
                req.pop("response_format", None)
                resp = client.chat.completions.create(**req)

            text = resp.choices[0].message.content.strip()
            data = json.loads(_extract_json_text(text))
            return data.get("items", [])
        except Exception:
            if attempt == retries - 1:
                return []
            time.sleep(1.5 ** attempt)



def summary_entries(entries: list[dict], batch_size: int = 10, workers: int = 3):
    all_result = []
    indexed = [{**e, "_id": i} for i, e in enumerate(entries)]
    max_workers = max(1, workers)

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(_summary_one_batch, batch)
            for batch in _chunks(indexed, batch_size)
        ]

        for f in as_completed(futures):
            all_result.extend(f.result())
    
    result_map = {
        item["id"]: item for item in all_result if "id" in item
    }
    merged = []
    for item in indexed:
        ai = result_map.get(item["_id"], {})
        merged.append({
            "category": item.get("category", ""),
            "title": item.get("title", ""),
            "link": item.get("link", ""),
            "raw_content": item.get("raw_content", ""),
            "ai_summary": ai.get("summary", ""),
            "ai_tags": ai.get("tags", []),
            "ai_importance": ai.get("importance", 3),
        })

    return merged