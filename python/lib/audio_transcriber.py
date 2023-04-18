import whisper


class AudioTranscriber:
    def __init__(self, model: str = "base"):
        self.__model = model
        self.__trained_model = whisper.load_model(self.__model)

    def transcribe(self, audio_file: str, language: str) -> dict:
        return self.__trained_model.transcribe(audio_file, language=language.lower())


