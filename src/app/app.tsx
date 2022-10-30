import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RuleTypes from "./pages/RuleTypes/RuleTypes";
import Rules from "./pages/Rules/Rules";

import "./index.css";

declare let routeInitial: string;

export default function App() {
  return (
    <MemoryRouter
      initialEntries={[
        routeInitial
      ]}>
      <Routes>
        <Route path="/ruletypes" element={<RuleTypes></RuleTypes>} />
        <Route path="/rules" element={<Rules></Rules>} />
      </Routes>
    </MemoryRouter>
  );
}