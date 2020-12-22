import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HorizontalNav2 from "./components/HorizontalNav2";
import FetcherMQTT from "./components/FetcherMQTT";

function App() {
  return (
    <Router>
      <HorizontalNav2
        content={{
          brand: {
            text: "Home Automation",
            // image: {Logo},
            image:
              "https://www.flaticon.com/svg/static/icons/svg/3063/3063654.svg",
            width: "110",
          },
          linkPaths: ["/", "/rooms"],
          link1: "All Sensors",
          link2: "Rooms",
          link3: "Actions",
          link4: "User",
          "primary-action": "Log Out",
        }}
      />
      <FetcherMQTT />
      {/* <Switch> */}
      {/* <Route exact path="/">
          {/* <IndexPage /> */}

      {/* </Route> */}
      {/* <Route exact path="/rooms">
          <h2>Here are displayed the rooms of the house.</h2>;
        </Route>
      </Switch> */}
    </Router>
  );
}
export default App;
