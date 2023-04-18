from werkzeug.datastructures import FileStorage

from .audio_transcriber import AudioTranscriber
from .temp_file_handler import TempFileHandler


def media_transcription(file: FileStorage, language: str) -> str:
    transcriber = AudioTranscriber()
    file_handler = TempFileHandler("temp.wav")

    is_language_ok(language)
    file.save(file_handler.file())
    transcribed = transcriber.transcribe(file_handler.file(), language)
    file_handler.remove()

    return transcribed['text']


def is_language_ok(language: str) -> None:
    if language != 'italian' and language != 'spanish':
        raise Exception("The %s language is not supported yet", language)
