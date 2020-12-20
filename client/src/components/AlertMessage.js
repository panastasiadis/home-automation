import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";

export default function AlertMessage(props) {
  return (
    <Alert onClose={true} severity="success">
      This is a success message!
    </Alert>
  );
}
