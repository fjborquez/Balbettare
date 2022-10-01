import React, { useEffect } from 'react';
import './home.css';

function Home() { 
    useEffect(() => {
        document.title = "Speech recognition";
    });
    return (
        <article className="home-article"> 
            <h1>
                <p>
                    🗣 {'>'} 📦 {'>'} 📄
                </p>
            </h1>   
        </article>
    )
}

export default Home;