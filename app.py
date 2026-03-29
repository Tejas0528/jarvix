from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# 🔐 BEST PRACTICE (use env variable)
API_KEY = os.getenv("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")

# 👉 fallback (only for testing)
if not API_KEY:
    API_KEY = "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"


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"reply": "⚠️ No message received"}), 400

        message = data["message"]

        print("📩 User:", message)

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a helpful AI assistant. Answer clearly."},
                    {"role": "user", "content": message}
                ]
            },
            timeout=10  # 🔥 prevent hanging
        )

        # 🔍 DEBUG
        print("📡 Status:", response.status_code)

        if response.status_code != 200:
            return jsonify({
                "reply": f"⚠️ API Error {response.status_code}: {response.text}"
            })

        result = response.json()

        # 🔥 SAFE PARSE
        reply = result.get("choices", [{}])[0].get("message", {}).get("content", "")

        if not reply:
            reply = "⚠️ Empty response from AI"

        print("🤖 AI:", reply)

        return jsonify({"reply": reply})

    except requests.exceptions.Timeout:
        return jsonify({"reply": "⚠️ Request timeout. Try again."})

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"reply": "⚠️ Server error: " + str(e)})


if __name__ == "__main__":
    app.run(debug=True)