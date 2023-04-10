import React, { useEffect, useState, useRef } from 'react';
import LanguageSelection from './LanguageSelection';
import env from '../env.json';
import axios from 'axios';
import './App.css';

export default function App() {   
  const [stream, setStream] = useState({
    access: false,
    recorder: null as any,
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

  const [language, setLanguage] = useState<string | null>(null);

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
    initializeRecorder(language);
    getNewSayPhrase(language);
  };

  const chunks = useRef([] as any); 
  useEffect(() => {
    document.title = "Speech Recognition";  
  }, []);
  
  async function initializeRecorder(language: string) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mic) => {
        let mediaRecorder = new MediaRecorder(mic, {
            mimeType: "audio/webm"
        });
        
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
          chunks.current.push(e.data);
        };
    
        mediaRecorder.onstop = async function () { 
            let blob = new Blob(chunks.current, { type : chunks.current[0] });
            chunks.current = [];
    
            const url = URL.createObjectURL(blob);  
    
            const formData = new FormData(); 
            formData.append("audio", blob as Blob); 
            formData.append("language", language as string);
            
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
                setTranscription({ 
                  available: true,
                  analyzing: false,
                  data: result.data
                })
            }).catch((error) => {
                console.error(error);
                setTranscription({ 
                  available: true,
                  analyzing: false,
                  data: ""
                });
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
        console.error(error);
        setStream({ ...stream, error });
      }); 
  }
  async function getNewSayPhrase(language: string) {
    await axios({ 
      url: `${env.BACKEND_URL_HOST}/${env.BACKEND_PHRASE}`,
      method: 'GET',
      params: {
        language: language,
      },
    }).then((result) => {
        setPhrase({ 
          available: true,
          sayPhrase: result.data.phrase,
          translatedPhrase: result.data.transplatedPhrase
        })
    }).catch((error) => {
        console.error(error);
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
    let longer = (s1.length < s2.length) ? s2 : s1;
    let shorter = (s1.length < s2.length) ? s1 : s2; 
    const longerLength = (longer.length === 0) ? 1.0 : longer.length; 
    return(longerLength - editDistance(longer as any, shorter as any)) / parseFloat(longerLength as any);
  }

  function editDistance(s1: string, s2: string ) { 
    let costs = [];
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i === 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
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
      {language === null ? (
         <LanguageSelection onSelect={handleLanguageChange} />
      ) : ( 
        <section className="say-phrase-container">
          {
            !recording.active && !transcription.analyzing
              ? <input type={"button"} 
                  className="start-record-button"
                  onClick={ () => !recording.active && stream.recorder.start()}  
                  value="Start Recording" /> 
              : recording.active && !transcription.analyzing
                ? <input type={"button"} 
                    className="stop-record-button"
                    onClick={() => stream.recorder.stop()}  
                    value="Stop Recording" />
                : <p>analyzing</p> 
          }

          <p>Phrase: {phrase.sayPhrase}</p>

          {
            (transcription.available && !transcription.analyzing)
            && 
            <>
              <p>Transcript: {transcription.data}</p>
              { 
                clean_phrase(phrase.sayPhrase, transcription.data) 
                ? <input 
                  className="next-button"
                  style={clean_phrase(phrase.sayPhrase, transcription.data) ? {visibility : "visible"} : {visibility : "hidden"}}
                  type={"button"}
                  onClick={() => getNewSayPhrase(language)} 
                  value="Next"
                />
                : undefined
              }
            </>
          } 
        </section>   
      )}
    </article>
  );
} 