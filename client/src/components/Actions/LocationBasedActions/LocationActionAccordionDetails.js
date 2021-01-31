import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {HomeLocation} from "../../../utils/AssetImages";

const useStyles = makeStyles((theme) => ({
    accordionContent: {
        backgroundColor: theme.palette.secondary.main,
        color: "white",
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        borderRadius: "10px",
    },
    info: {
        display: "flex",
        alignItems: "center",
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        margin: theme.spacing(1),
    },
    label: {
        marginLeft: theme.spacing(1),
    },
    radiusMeters: {
        marginLeft: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        borderRadius: "10px",
        color: "white"
    }
}));

export default function LocationActionContent(props) {
    const classes = useStyles();

    return (
        <div className={classes.accordionContent}>
            <div className={classes.info}>
                <img src={`${HomeLocation}`} alt="Home Location" width="35" height="35"/>
                <Typography className={classes.label} variant="subtitle1">
                    {"Radius:"}
                </Typography>
                <Typography className={classes.radiusMeters} variant="subtitle1">
                    {`${props.radius}`}
                </Typography>
                <Typography className={classes.label} variant="subtitle1">
                    {"meters"}
                </Typography>
            </div>
        </div>
    );
}
