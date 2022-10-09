import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}
ReactDOM.render(
  <h1>teste</h1>,
  document.getElementById("root")
);