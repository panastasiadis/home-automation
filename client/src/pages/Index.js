import React from "react";

import HorizontalNav2 from "../components/HorizontalNav2";
import Main from "../components/Main";

export default function Index() {
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
          link1: "All Sensors",
          link2: "Rooms",
          link3: "Actions",
          link4: "User",
          "primary-action": "Log Out",
        }}
      />
      <Main/>
    </React.Fragment>
  );
}
