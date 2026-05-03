import json
import os
import re
import time

from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def _chunk_list(items: list[dict], size: int):
    for index in range(0, len(items), size):
        yield items[index : index + size]


def _build_user_prompt(batch: list[dict]) -> str:
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
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z]*\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        return cleaned.strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        return cleaned[start : end + 1]
    return cleaned


def _summary_one_batch(client: OpenAI, batch: list[dict], retries: int = 3) -> list[dict]:
    system_prompt = "你是资讯摘要助手，必须只输出合法 JSON。"
    user_prompt = _build_user_prompt(batch)

    for attempt in range(retries):
        try:
            request = {
                "model": os.getenv("OPENAI_MODEL"),
                "temperature": 0.2,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            }
            try:
                request["response_format"] = {"type": "json_object"}
                response = client.chat.completions.create(**request)
            except Exception:
                request.pop("response_format", None)
                response = client.chat.completions.create(**request)

            text = response.choices[0].message.content.strip()
            data = json.loads(_extract_json_text(text))
            return data.get("items", [])
        except Exception:
            if attempt == retries - 1:
                return []
            time.sleep(1.5**attempt)

    return []


def summary_entries(entries: list[dict], batch_size: int = 20, workers: int = 6) -> list[dict]:
    if not entries:
        return []

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return [
            {
                "category": item.get("category", ""),
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "published_time": item.get("published_time", ""),
                "raw_content": item.get("raw_content", ""),
                "ai_summary": "",
                "ai_tags": [],
                "ai_importance": 3,
            }
            for item in entries
        ]

    client = OpenAI(api_key=api_key, base_url=os.getenv("OPENAI_BASE_URL"))
    indexed = [{**item, "_id": index} for index, item in enumerate(entries)]
    all_results: list[dict] = []

    with ThreadPoolExecutor(max_workers=max(1, workers)) as executor:
        futures = [executor.submit(_summary_one_batch, client, batch) for batch in _chunk_list(indexed, batch_size)]
        for future in as_completed(futures):
            all_results.extend(future.result())

    result_map = {item["id"]: item for item in all_results if "id" in item}
    merged: list[dict] = []
    for item in indexed:
        ai_data = result_map.get(item["_id"], {})
        merged.append(
            {
                "category": item.get("category", ""),
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "published_time": item.get("published_time", ""),
                "raw_content": item.get("raw_content", ""),
                "ai_summary": ai_data.get("summary", ""),
                "ai_tags": ai_data.get("tags", []),
                "ai_importance": ai_data.get("importance", 3),
            }
        )

    return merged
