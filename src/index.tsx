import React from "react";
import ReactDOM from "react-dom";
import { ModalProvider } from "react-modal-hook";
import App from "./App";

import "./services/firebase";

import "./styles/globals.scss";

ReactDOM.render(
  <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
