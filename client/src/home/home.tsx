import React, { useEffect } from 'react';
import UploadVideo from './upload-video';
import './home.css';


function Home() { 
    useEffect(() => {
        document.title = "Speech recognition";
    });
    return (
        <article className="home-article"> 
            <UploadVideo />
        </article>
    )
}

export default Home;