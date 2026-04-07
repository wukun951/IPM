import contextlib
import http.server
import os
import socket
import socketserver
import sys
import threading
import time
import webbrowser


HOST = "127.0.0.1"
DEFAULT_PORT = 4317


def find_free_port(start_port: int = DEFAULT_PORT) -> int:
    port = start_port
    while port < start_port + 50:
        with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind((HOST, port))
                return port
            except OSError:
                port += 1
    raise RuntimeError("No available port found in the expected range.")


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        return

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def run_server(directory: str, port: int) -> socketserver.TCPServer:
    os.chdir(directory)
    server = socketserver.TCPServer((HOST, port), QuietHandler)
    server.allow_reuse_address = True
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def main() -> int:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    port = find_free_port()
    server = run_server(base_dir, port)
    url = f"http://{HOST}:{port}/"

    print("=" * 60)
    print("IPM 启动器")
    print("=" * 60)
    print(f"服务目录: {base_dir}")
    print(f"访问地址: {url}")
    print("浏览器会自动打开。")
    print("使用期间请保持此窗口开启。")
    print("按 Ctrl+C 可停止本地服务。")
    print("=" * 60)

    time.sleep(0.35)
    webbrowser.open(url)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n正在停止本地演示服务...")
    finally:
        server.shutdown()
        server.server_close()

    return 0


if __name__ == "__main__":
    sys.exit(main())
