import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App/App';
import Error from './error/error';
import { BrowserRouter, Route, Routes, useLocation} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>

    <BrowserRouter> 
      <ScrollToTop />
      <Routes> 
        <Route path="/" element={<App/>} />   
        <Route path="*" element={<Error/>} /> 
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
} 

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
