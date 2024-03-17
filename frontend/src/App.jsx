/**
 * src/App.js
 */
import React from "react";
import "./App.css";
import {BrowserRouter,Routes,Route } from "react-router-dom";
import Protected from "./Protected";
import Email from "./Pages/Email";
import Register from "./Pages/Register";

export default function App() {
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route path="/" element={<Email />} />
          <Route path="/signin" element={<Register />} />
          <Route path="/protected" element={<Protected />} />
          {/* <Route path="/signinwithemail" element={<EmailSignIn />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
       </BrowserRouter>
    </div>
  );
}