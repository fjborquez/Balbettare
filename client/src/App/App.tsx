import React, { useEffect, useState, useRef } from 'react';
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

  const chunks = useRef([]);

  function getAccess() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mic) => {
        let  mediaRecorder = new MediaRecorder(mic, {
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
        };

        mediaRecorder.ondataavailable = function (e) {
          console.log("data available");
          chunks.current.push(e.data);
        };

        mediaRecorder.onstop = async function () {
          console.log("stopped");

          const url = URL.createObjectURL(chunks.current[0]);
          chunks.current = [];

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
  
  return (
    <div className="App">
      {stream.access ? (
        <div className="audio-container"> 
        
          {!recording.active ?  
            <input type={"button"} 
              onClick={() => !recording.active && stream.recorder.start()}  
              value="Start Recording" /> 
          : 
            <input type={"button"} 
              onClick={() => stream.recorder.stop()}  
              value="Stop Recording" />
          }

          {recording.available && <audio controls src={recording.url} />}
        </div>
      ) : (
        <input type={"button"} 
          onClick={getAccess} 
          value="Get Mic Access" />
      )}
    </div>
  );
} 