from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import whisper
import uuid
import os
 
app = Flask(__name__)
CORS(app)

@app.route('/media-transcription ', methods = ['POST']) 
def whole_transcription():
    if request.method == 'POST': 
        target = os.path.join(os.path.dirname(__file__), "media")
        if not os.path.isdir(target):
            os.mkdir(target) 
        file = request.files['file']
        file.filename.split(".")[-1]
        filename = secure_filename("".join([str(uuid.uuid4()), ".",file.filename.split(".")[-1]])) 
        audio_path = os.path.join(os.path.dirname(__file__), "media", filename)
        file.save(audio_path)  
        whole_transcription = transcription("base", audio_path) 
        os.remove(audio_path)
        return jsonify({"transcription" : whole_transcription})  

def transcription(model_name: str, audio_path: str):
    model = whisper.load_model(model_name)
    result = model.transcribe(audio_path)
    transcription = result["segments"]
    return transcription 

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4010))
    app.run(debug=True,host='0.0.0.0',port=port)