import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import BlurOn from "@material-ui/icons/BlurOn";
import Typography from "@material-ui/core/Typography";

import {Link} from 'react-router-dom';

import Signout from "../Auth/Signout";

const Navigation = ({classes, currentUser}) => {
    return (
        <AppBar position={"static"} className={classes.root}>
            <Toolbar>
                <Link to="/" className={classes.grow}>
                    <BlurOn className={classes.logo} color={"secondary"}/>
                    <Typography className={classes.title} variant={"h1"} color={"secondary"} noWrap>
                        Minesweeper
                    </Typography>
                </Link>


                {currentUser && (
                    <Typography variant={"h1"} className={classes.username} noWrap>
                        {currentUser.username}
                    </Typography>
                )}

                <Signout className={classes.link}/>
            </Toolbar>
        </AppBar>
    )
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: 0,
        padding: 0
    },
    grow: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        textDecoration: "none"
    },
    title: {
        fontSize: 22,
        color: "white",
    },
    logo: {
        marginRight: theme.spacing(1),
        fontSize: 45,
        color: "white",
    },
    username: {
        color: "white",
        fontSize: 22,
        marginRight: theme.spacing(2),
    },
    link: {
        color: "white",
        fontSize: 30
    }
});

export default withStyles(styles)(Navigation);
