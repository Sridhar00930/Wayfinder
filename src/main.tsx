import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SpeechProvider } from "./lib/speech";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <SpeechProvider>
        <App />
      </SpeechProvider>
    </ErrorBoundary>
  </StrictMode>,
);
