import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Mutation} from "react-apollo";
import {Redirect} from "react-router-dom";
import {Query} from "@apollo/react-components";
import {gql} from "apollo-boost";
import {Button, Paper, Typography} from "@material-ui/core";
import Error from "../components/Shared/Error";
import Grid from "@material-ui/core/Grid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const Game = ({classes, match}) => {
    const gameId = match.params.id;
    var [openTiles, setOpenTiles] = useState([]);
    const [gameError, setGameError] = useState("");
    const [isOver, setIsOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    if (gameError) {
        return <Redirect to={`/`}/>
    }

    const getCellValue = (row, col) => {
        {/* TODO Getting called multiple times, so need to optimize */
        }
        if (openTiles[row] && col in openTiles[row]) {
            if (openTiles[row][col] === 9) {
                return (
                    <FontAwesomeIcon icon={['fas', 'bomb']}/>
                );
            }
            return openTiles[row][col]
        }
    };

    const handleCellClick = (event, openTile) => {
        event.preventDefault();
        const row = event.target.getAttribute('data-row');
        const col = event.target.getAttribute('data-col');

        if (openTiles[row] && col in openTiles[row]) {
            //Cell already open
        } else {
            openTile();
        }
    };

    return (
        <div className={classes.container}>
            <Paper className={classes.paper}>
                <Typography variant="h1" className={classes.startMining}>Start mining!</Typography>

                <Query query={GET_GAME}
                       variables={{gameId}}
                       onCompleted={data => {
                           console.log(data)
                           setOpenTiles(JSON.parse(data.game.openTile))
                           setIsOver(data.game.isOver)
                           setHasWon(data.game.won)
                       }}>
                    {({data, loading, error}) => {
                        if (error) {
                            setGameError(error)
                        }

                        return (
                            <>
                                {error && <Error error={error}/>}
                                {data &&
                                <Grid className={classes.gridRoot} container spacing={1}>
                                    {[...Array(data.game.size)].map((e, row) => (
                                        <Grid container className={classes.grid} key={row}>
                                            {[...Array(data.game.size)].map((e, col) => (
                                                <Mutation
                                                    mutation={OPEN_TILE_MUTATION}
                                                    variables={{gameId, row, col}}
                                                    onCompleted={data => {
                                                        setOpenTiles(JSON.parse(data.openTile.game.openTile))
                                                        setIsOver(data.openTile.game.isOver)
                                                        setHasWon(data.openTile.game.won)
                                                    }}
                                                    key={col}
                                                >
                                                    {openTile => (
                                                        <Grid container className={classes.gridCell}
                                                              key={col}
                                                              data-row={row}
                                                              data-col={col}
                                                              onClick={event => handleCellClick(event, openTile)}>
                                                            {getCellValue(row, col)}
                                                        </Grid>
                                                    )}
                                                </Mutation>
                                            ))}
                                        </Grid>
                                    ))}
                                </Grid>
                                }
                            </>
                        );
                    }}
                </Query>

            </Paper>


            <Dialog
                open={isOver}
                disableBackdropClick={true}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    Game Over
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>Oops you stepped on a landmine!</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={(event) => {
                            event.preventDefault();
                            setGameError("Game Over");
                        }}
                    >
                        Home
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={hasWon}
                disableBackdropClick={true}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    Congrats
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>You won</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={(event) => {
                            event.preventDefault();
                            setGameError("You won");
                        }}
                    >
                        Home
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const GET_GAME = gql`
  query($gameId: UUID!){
    game(gameId: $gameId) {
        id,
        openTile,
        size,
        isOver,
        win,
        user {
          username
        },
        updatedAt
      }
    }
`;

const OPEN_TILE_MUTATION = gql`
    mutation($gameId: UUID!, $row: Int!, $col: Int!) {
     openTile(gameId: $gameId, x: $row, y:$col) {
        game {
          openTile,
          isOver,
          win,
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
    gridRoot: {
        textAlign: "center",
        margin: "0 auto",
        width: "auto"
    },
    grid: {
        display: "flex",
    },
    gridCell: {
        padding: theme.spacing(2),
        textAlign: 'center',
        display: "block",
        background: "white",
        borderBlockWidth: 1,
        borderColor: "black",
        borderStyle: "solid",
        alignItems: "center",
        width: 60,
        height: 60
    },
    startMining: {
        marginTop: theme.spacing(2),
        color: theme.palette.secondary.dark,
        fontSize: 32,
        fontWeight: 700,
        paddingBottom: 30
    },
    buttonIcon: {
        color: theme.palette.secondary.dark,
    }
});

export default withStyles(styles)(Game);
