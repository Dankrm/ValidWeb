import React, { useEffect } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { VSCodeAPI } from "./lib/VSCodeApi";
import Main from "./pages/Main/Main";
import Files from "./pages/Files/Files";

import "./index.css";

export default function App() {
  useEffect(() => {
    return VSCodeAPI.onMessage((message) => console.log('app', message));
  });
  VSCodeAPI.postMessage("loaded");
  return (
    <MemoryRouter
      initialEntries={[
        '/'
      ]}>
        
      <Routes>
        <Route path="/" element={<Main></Main>} />
        <Route path="/files" element={<Files></Files>} />
      </Routes>
    </MemoryRouter>
  );
}