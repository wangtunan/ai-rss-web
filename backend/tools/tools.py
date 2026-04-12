import yaml

def get_feed_sources():
    """
     解析 sources.yml 文件，获取 feed 源
    """
    with open("sources.yml", "r", encoding="utf-8") as f:
        sources = yaml.load(f, Loader=yaml.FullLoader)
    
    return sources["sources"]

if __name__ == "__main__":
    print(get_feed_sources())