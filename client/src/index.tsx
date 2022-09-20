import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
//import reportWebVitals from './reportWebVitals';

import { AuthProvider } from './context/AuthContext_Provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

console.log(`%cWARNING!%c
Using this console should %conly%c be done by developers.
If anyone asked you to copy or paste anything here, 
we strongly suggest you do %cnot%c. 
It is a scam/fraud to steal information from you via an attack called Self-XSS`
, 'font-size:40px; color:red; font-weight:bold; text-shadow: 0 4px 4px black; font-family: arial;'
, 'font-style:normal'
, 'font-weight:bold; text-decoration: underline'
, 'font-style:normal'
, 'font-weight:bold; text-decoration: underline'
, 'font-style:normal'
)

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
