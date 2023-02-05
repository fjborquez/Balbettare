FROM python:3.10

RUN apt install git
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

COPY . . 

RUN pip install --upgrade pip  
RUN pip install -r requirements.txt 

EXPOSE 4010 

ENTRYPOINT ["python"]

CMD ["app.py"]