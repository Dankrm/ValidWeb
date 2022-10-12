import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";

interface vscode {
  postMessage(message: any): void;
}
declare const vscode: vscode;

ReactDOM.render(<h1>Tomanocu</h1>, document.getElementById('root'));


