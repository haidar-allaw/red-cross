// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// 1) Define the loader function exactly as in your snippet:
function loadChatbase() {
  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...args) => {
      if (!window.chatbase.q) window.chatbase.q = [];
      window.chatbase.q.push(args);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") return target.q;
        return (...args) => target(prop, ...args);
      },
    });
  }

  const script = document.createElement("script");
  script.src = "https://www.chatbase.co/embed.min.js";
  script.id = "sBsdhbxSaBQZD457ZYeMl";
  script.domain = "www.chatbase.co";
  document.body.appendChild(script);
}

// 2) Invoke it once the page has fully loaded:
if (document.readyState === "complete") {
  loadChatbase();
} else {
  window.addEventListener("load", loadChatbase);
}

// 3) Then render your React tree as usual:
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
