import React from "react";
import FetcherMQTT from "./FetcherMQTT";
import HorizontalNav2 from "./HorizontalNav2";
function Dashboard(props) {
  return (
    <React.Fragment>
      <HorizontalNav2
        content={{
          brand: {
            text: "Home Automation",
            // image: {Logo},
            image:
              "https://www.flaticon.com/svg/static/icons/svg/3063/3063654.svg",
            width: "110",
          },
          link3: "Actions",
          link4: "User",
          "primary-action": "Log Out",
        }}
      />
      <FetcherMQTT />
    </React.Fragment>
  );
}

export default Dashboard;
