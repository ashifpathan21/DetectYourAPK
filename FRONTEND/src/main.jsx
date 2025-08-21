import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
    import "remixicon/fonts/remixicon.css";import { store } from "./Store/store.js";
import SocketProvider from "./context/SocketContext.jsx";
import toast, { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
  <>
    <SocketProvider>
      <Toaster />
      <Provider store={store}>
        <App />
      </Provider>
    </SocketProvider>
  </>

  //</React.StrictMode>,
);
