import React, { useEffect, useState, useRef } from 'react';
import env from '../env.json';
import axios from 'axios';
import './App.css';

export default function App() {  
  useEffect(() => {
      document.title = "Speech Recognition";
  });

  const [stream, setStream] = useState({
    access: false,
    recorder: null,
    error: ""
  });

  const [recording, setRecording] = useState({
    active: false,
    available: false,
    url: ""
  });

  const [transcription, setTranscription] = useState({ 
    available: false,
    analyzing: false,
    data: ""
  }); 

  const [phrase, setPhrase] = useState({ 
    available: false,
    sayPhrase: "",
    translatedPhrase: ""
  }); 
  
  const chunks = useRef([]);

  function getAccess() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(async (mic) => {
        let  mediaRecorder = new MediaRecorder(mic, {
            mimeType: "audio/webm"
        });

        await updateSayPhrase()

        const track = mediaRecorder.stream.getTracks()[0];
        track.onended = () => console.log("ended");

        mediaRecorder.onstart = function () {
          setRecording({
            active: true,
            available: false,
            url: ""
          });
          cleanTranscription();
        };

        mediaRecorder.ondataavailable = function (e) {
          console.log("data available");
          chunks.current.push(e.data);
        };

        mediaRecorder.onstop = async function () {
          console.log("stopped"); 
          
            let blob = new Blob(chunks.current, { type : chunks.current[0] });
            chunks.current = [];

            const url = URL.createObjectURL(blob);  

            const formData = new FormData(); 
            formData.append("audio", blob); 
            
            setTranscription({ 
              available: true,
              analyzing: true,
              data: ""
            })

            await axios({ 
                url: `${env.PYTHON_URL_HOST}/${env.PYTHON_MEDIA_TRANSCRIPTIOM}`,
                method: 'POST',
                data: formData
            }).then((result) => {
                console.log(result);
                setTranscription({ 
                  available: true,
                  analyzing: false,
                  data: result.data
                })
            }).catch((error) => {
                setTranscription({ 
                  available: true,
                  analyzing: false,
                  data: ""
                })
                console.log(error);
            });

          setRecording({
            active: false,
            available: true,
            url
          });
        };

        setStream({
          ...stream,
          access: true,
          recorder: mediaRecorder as any
        });
      })
      .catch((error) => {
        console.log(error);
        setStream({ ...stream, error });
      });
  } 
 
  async function updateSayPhrase() {
    await axios({ 
      url: `${env.BACKEND_URL_HOST}/${env.BACKEND_PHRASE}`,
      method: 'GET'
    }).then((result) => {
        console.log(result);
        setPhrase({ 
          available: true,
          sayPhrase: result.data.phrase,
          translatedPhrase: result.data.transplatedPhrase
        })
    }).catch((error) => {
        console.log(error);
    });
    cleanTranscription();
  }

  function cleanTranscription() { 
    setTranscription({ 
      available: false,
      analyzing: false,
      data: ""
    });
  }  

  return (
    <article> 
      {stream.access ? (
          <section className="audio-container">   
            <section>
              {!recording.active && !transcription.analyzing
              ? <input type={"button"} 
                  onClick={() => !recording.active && stream.recorder.start()}  
                  value="Start Recording" /> 
              : recording.active && !transcription.analyzing
              ? <input type={"button"} 
                  onClick={() => stream.recorder.stop()}  
                  value="Stop Recording" />
              : <p>analyzing</p>

              }

              <p>Phrase: {phrase.sayPhrase}</p>
            </section> 
             
            
            {
                (transcription.available && !transcription.analyzing)
                &&  
                <section>
                  <p>
                    Transcript: {transcription.data}
                  </p>
                  <input 
                    type={"button"}
                    onClick={updateSayPhrase} 
                    value="Next"
                  />
                </section>
              } 

          </section> 
        ) : (
          <input type={"button"} 
            onClick={getAccess} 
            value="Get Mic Access" />
        )}
    </article>
  );
} 