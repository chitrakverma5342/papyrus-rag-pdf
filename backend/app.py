from flask import Flask, request, jsonify
from flask_cors import CORS
from rag import index_document, ask_question
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

UPLOAD_FOLDER = "./documents"
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    pdf_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(pdf_path)

    message = index_document(pdf_path)

    return jsonify({"message": message})



@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()

    if "question" not in data:
        return jsonify({"error": "No question provided"}), 400

    question = data["question"]
    answer = ask_question(question)

    return jsonify({"answer": answer})


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)