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

  function clean_phrase(input_phrase: string , output_phrase: string){ 
    const cleaned_output_phrase = output_phrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").replace(/\s+$/g, '').replace(/^\s+|\s+$/g, '');
    const cleaned_input_phrase = input_phrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").replace(/\s+$/g, '').replace(/^\s+|\s+$/g, '');
    return similarity(cleaned_output_phrase, cleaned_input_phrase) >= 0.8;
  }

  function similarity(s1: string | any[], s2: string | any[]) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    } 
    return(longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1: string, s2: string) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  return (
    <article>  
      {stream.access ? (
        <section className="say-phrase-wrapper">
          <section className="say-phrase-container">
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
 
            {
              (transcription.available && !transcription.analyzing)
              &&  
              <section>
                <p>
                  Transcript: {transcription.data}
                </p>
                {clean_phrase(phrase.sayPhrase, transcription.data) ? 
                  <input 
                    type={"button"}
                    onClick={updateSayPhrase} 
                    value="Next"
                  />
                : undefined}
              </section>
            }  
          </section>  
        </section> 
      ) : (
        <section className="say-phrase-wrapper">
          <input type={"button"} 
            onClick={getAccess} 
            value="Get Mic Access" /> 
        </section>
      )}  
    </article>
  );
} 