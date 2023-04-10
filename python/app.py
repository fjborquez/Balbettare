import os
import tempfile
from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import whisper
 
app = Flask(__name__)
CORS(app)

@app.route('/mediaTranscription', methods = ['POST']) 
def transcription():
    if request.method == 'POST': 
        model = "base"
        audio_model = whisper.load_model(model)

        temp_dir = tempfile.mkdtemp()
        save_path = os.path.join(temp_dir, 'temp.wav')

        wav_file = request.files['audio']
        language = request.form.get('language')
        wav_file.save(save_path)
        result = audio_model.transcribe(save_path, language=language.lower())

        os.remove(save_path)  
        return result['text'] 

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')