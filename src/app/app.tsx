import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import Files from "./pages/Files/Files";

import "./index.css";

export default function App() {
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