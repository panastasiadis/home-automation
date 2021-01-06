import "./App.css";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import FetcherMQTT from "./components/FetcherMQTT";

function App() {
  return (
    <Router>
      <FetcherMQTT />
    </Router>
  );
}
export default App;
