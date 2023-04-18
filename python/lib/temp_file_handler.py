import os
import tempfile


class TempFileHandler:
    def __init__(self, filename: str):
        self.__filename = filename
        self.__file = self.create()

    def create(self):
        temp_dir = tempfile.mkdtemp()
        file = os.path.join(temp_dir, self.__filename)
        return file

    def remove(self):
        return os.remove(self.__file)

    def file(self):
        return self.__file
