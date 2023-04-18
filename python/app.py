from flask import Flask, request
from flask_cors import CORS

from lib.service import media_transcription

app = Flask(__name__)
CORS(app)


@app.route('/mediaTranscription', methods=['POST'])
def transcription() -> str:
    if request.method == 'POST': 
        file = request.files['audio']
        language = request.form.get('language')
        return media_transcription(file, language)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')