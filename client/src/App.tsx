import Home from './home/home';
import Error from './error/error';
import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();
  
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
} 

function App() {  
  return ( 
    <BrowserRouter>
      <ScrollToTop />
      <Routes> 
        <Route path="/" element={<Home/>} /> 
        <Route path="*" element={<Error/>} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;
