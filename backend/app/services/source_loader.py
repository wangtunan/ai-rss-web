import yaml

from pathlib import Path


def load_sources() -> list[dict]:
    """
    读取并返回 sources.yml 中的 feed 列表。
    """
    backend_dir = Path(__file__).resolve().parents[2]
    source_path = backend_dir / "sources.yml"

    if not source_path.exists():
        raise FileNotFoundError(f"sources.yml not found: {source_path}")

    with source_path.open("r", encoding="utf-8") as file:
        data = yaml.safe_load(file) or {}

    sources = data.get("sources")
    if not isinstance(sources, list):
        raise ValueError("Invalid sources.yml: `sources` must be a list")

    return sources

if __name__ == "__main__":
    print(load_sources())