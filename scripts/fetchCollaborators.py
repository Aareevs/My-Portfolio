import urllib.request
import json
import urllib.parse
import os

REPOS = [
    "Aareevs/Stock-Website",
    "Aareevs/AltaHackathon_CodeBloods",
    "Aareevs/Openenv-LLMAI-Scalar"
]

OUTPUT_FILE = "public/collaborators.json"
results = {}

for repo in REPOS:
    url = f"https://api.github.com/repos/{repo}/contributors"
    proxy_url = f"https://api.allorigins.win/get?url={urllib.parse.quote(url)}"
    print(f"Fetching contributors for {repo}...")
    req = urllib.request.Request(proxy_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data.get('contents'):
                contents = json.loads(data['contents'])
                if isinstance(contents, list):
                    contributors = [c['login'] for c in contents if 'login' in c]
                    results[repo] = contributors
                    print(f"Found: {contributors}")
                else:
                    print(f"Failed to parse, got: {contents}")
            else:
               print("No contents")
    except Exception as e:
        print(f"Failed to fetch for {repo}: {e}")

with open(OUTPUT_FILE, 'w') as f:
    json.dump(results, f, indent=2)

print(f"Saved collaborators to {OUTPUT_FILE}")
