import NotFoundImage from "../assets/not-found.svg";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${NotFoundImage})`,
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    width: "80vh",
    height: "50vh",
  },
  divNoContent: {
    margin: theme.spacing(1),
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    color: "white",
    textAlign: "center"
  },
}));

export default function NoContentPage(props) {
  const classes = useStyles();

  return (
    <div className={classes.divNoContent}>
      <Typography
        variant="h3"
        component="h3"
        gutterBottom
        className={classes.title}
      >
        {props.displayItem ? `No ${props.displayItem} Found` : `Nothing Found`}
      </Typography>
      <div className={classes.image} />
    </div>
  );
}
