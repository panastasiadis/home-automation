import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import FetcherMQTT from "./FetcherMQTT";
import AlertMessage from "./AlertMessage";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  appBarSpacer: theme.mixins.toolbar,
}));
export default function MainPanel(props) {
  const classes = useStyles();

  return (
    <main>
      <div className={classes.appBarSpacer} />
      <AlertMessage/>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <FetcherMQTT />
          {/* <Grid item xs={12} md={6} lg={4}>
            <TempHumCard />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <RelayCard />
          </Grid> */}
        </Grid>
      </Container>
    </main>
  );
}
