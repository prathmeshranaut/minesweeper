import React, {useState} from "react";
import {Mutation} from "react-apollo";
import {gql} from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import {Paper, Typography, Button} from "@material-ui/core";
import {Redirect} from "react-router-dom";
import Error from "../components/Shared/Error";

const App = ({classes}) => {
    const [game, setGame] = useState("");

    if (game) {
        return <Redirect to={`/game/${game}`}/>
    }

    const handleSubmit = (event, createGame) => {
        event.preventDefault();
        createGame();
    };

    return (
        <div className={classes.container}>
            <Paper className={classes.paper}>
                <Typography variant="h1" className={classes.welcomeBack}>Welcome back!</Typography>

                <Mutation mutation={CREATE_GAME_MUTATION}
                          onCompleted={data => {
                              setGame(data.createGame.game.id)
                          }}>
                    {(createGame, {loading, error}) => {
                        return (
                            <form
                                onSubmit={event => handleSubmit(event, createGame)}
                                className={classes.form}>

                                <Button
                                    type={"submit"}
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    className={classes.create}>Create a new game</Button>

                                {error && <Error error={error}/>}
                            </form>
                        );
                    }}
                </Mutation>
            </Paper>
        </div>
    );
};

const CREATE_GAME_MUTATION = gql`
  mutation {
    createGame {
      game {
        id,
        openTile,
        size,
        user {
          username
        },
        updatedAt
      }
    }
  }
`;

const styles = theme => ({
    container: {
        margin: "0 auto",
        maxWidth: 960,
        padding: theme.spacing(2)
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(2)
    },
    welcomeBack: {
        marginTop: theme.spacing(2),
        color: theme.palette.secondary.dark,
        fontSize: 32,
        fontWeight: 700
    },
    create: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }
});

export default withStyles(styles)(App);
