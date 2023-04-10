import React, { useEffect } from 'react';
import './error.css';

export default function Error() { 
    useEffect(() => {
        document.title = "Page not found";
    });
    return (
        <article className="error-article">
            <p className="error-title">
                404 / PAGE NOT FOUND
            </p>
            <a className="error-button" href="/">Go back to home</a>
        </article>
    )
}