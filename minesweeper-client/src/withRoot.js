import React from "react";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import lightBlue from "@material-ui/core/colors/lightBlue";
import blueGrey from "@material-ui/core/colors/blueGrey";
import green from "@material-ui/core/colors/green";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: lightBlue[500],
            main: lightBlue[700],
            dark: lightBlue[900]
        },
        secondary: {
            light: blueGrey[300],
            main: blueGrey[500],
            dark: blueGrey[700]
        },
        accent: {
            light: green[300],
            main: green[500],
            dark: green[700]
        }
    },
    typography: {
        useNextVariants: true
    }
});

function withRoot(Component) {
    function WithRoot(props) {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <Component {...props} />
            </MuiThemeProvider>
        );
    }

    return WithRoot;
}

export default withRoot;
