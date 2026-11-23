import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / "typedoc.json").read_text(encoding="utf-8"))
BASE_PATH = CONFIG["cleanJsdocTheme"]["basePath"].rstrip("/")


class DocsHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = urlsplit(self.path).path
        if BASE_PATH and path != BASE_PATH and not path.startswith(BASE_PATH + "/"):
            self.send_error(404)
            return None
        return super().send_head()

    def translate_path(self, path):
        return super().translate_path(path[len(BASE_PATH):])


if __name__ == "__main__":
    handler = partial(DocsHandler, directory=str(ROOT / "docs"))
    with ThreadingHTTPServer(("127.0.0.1", 3000), handler) as server:
        print(f"Serving documentation at http://127.0.0.1:3000{BASE_PATH}/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
