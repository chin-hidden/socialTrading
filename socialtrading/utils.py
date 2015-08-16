class JsonWrapper:
    @classmethod
    def from_json(cls, json_blob: dict):
        obj = cls()
        obj._json = json_blob
        return obj
