from flask import Flask
import whisper
import os
app = Flask(__name__)

@app.route("/media_transcription")
def english_transcription():
    audio_path = os.path.join(os.path.dirname(__file__), "media", "jfk.flac")
    whole_transcription = transcription("base", audio_path)  
    return whole_transcription 

def transcription(model_name: str, audio_path: str):
    model = whisper.load_model(model_name)
    result = model.transcribe(audio_path)
    transcription = result["segments"]
    return transcription 

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4010))
    app.run(debug=True,host='0.0.0.0',port=port)