import requests

response = requests.post(
    "http://localhost:5000/ask",
    json={"question": "What is the main topic?"}
)

print(response.json())