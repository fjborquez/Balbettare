import React, { useEffect } from 'react';
import './error.css';

function Error() { 
    useEffect(() => {
        document.title = "Page not found";
    });
    return (
        <article className="error-article">
            <p className="error-text">
                Page not found
            </p>
        </article>
    )
}

export default Error;