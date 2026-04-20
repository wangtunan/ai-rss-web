import json
import os

from datetime import datetime
from pathlib import Path
from uuid import uuid4
from dotenv import load_dotenv

load_dotenv()

def _get_backup_base_dir() -> Path:
    """
    获取备份基础目录。
    """

    # 根目录data/
    project_root = Path(__file__).resolve().parents[3]
    return project_root / "data"


def is_raw_backup_enabled() -> bool:
    """
    判断是否开启备份任务。
    """
    value = os.getenv("ENABLE_SUMMARIZED_BACKUP", "false").lower()
    return value in {"1", "true", "yes", "on"}

def backup_entries(summarized_entries: list[dict]) -> Path:
    """
    备份摘要数据。
    """
    try:
        now = datetime.now();
        date_dir = _get_backup_base_dir() / now.strftime("%Y%m%d")
        date_dir.mkdir(parents=True, exist_ok=True)

        file_path = date_dir / f"{uuid4().hex[:8]}.json"

        with file_path.open("w", encoding="utf-8") as f:
            json.dump(summarized_entries, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 摘要数据备份完成: {file_path}")
        return file_path
    except Exception as e:
        print(f"⚠️ 摘要数据备份失败: {e}")
    