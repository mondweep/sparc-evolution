#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser

PORT = 8080
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Claude Flow Course App serving at:")
        print(f"   http://localhost:{PORT}")
        print(f"   http://127.0.0.1:{PORT}")
        print(f"\n📚 Open the URL above in your browser to start the course!")
        print(f"   Press Ctrl+C to stop the server")
        
        # Try to open browser automatically
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
            
        httpd.serve_forever()