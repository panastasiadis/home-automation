import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    "palette": {
        "background": {
            "default": "#FFF",
            "emphasis": "#E8EAF6",
            "secondary": "#C5CAE9",
            "header": "#121037"
        },
        "text": {
            "primary": "#615f5d",
            "secondary": "#999693",
            "hint": "#ccc8c4",
            "whiteText": "white"
        },
        "primary": {
            // "main": "#2ca6d7",
            "main": "#383838",
            "light": "#333333",
            "dark": "#545454"
        },
        "secondary": {
            "main": "#b09058",
            // "main": "#737373",
            "light": "#deb66f",
            "dark": "#9c7f4e"
        },
        "contrastThreshold": 1.8
    },
    // "shadows": [
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none",
    //     "none"
    // ]
});

export default theme;

