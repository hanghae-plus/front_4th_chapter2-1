import ReactDOM from "react-dom/client"
import React from "react"
import App from "./App.tsx"

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLDivElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
