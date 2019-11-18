import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button, Paper, Typography} from "@material-ui/core";
import {Query} from "@apollo/react-components";
import Error from "../components/Shared/Error";
import {gql} from "apollo-boost";
import Grid from "@material-ui/core/Grid";
import {Redirect} from "react-router-dom";


const Game = ({classes, match}) => {
    const gameId = match.params.id;
    var [openTiles, setOpenTiles] = useState([]);
    const [gameError, setGameError] = useState("");

    if (gameError) {
        return <Redirect to={`/`}/>
    }

    const getCellValue = (row, col) => {
        {/* TODO Getting called multiple times, so need to optimize */
        }
        if (openTiles[row] && col in openTiles[row]) {
            return openTiles[row][col]
        }
    };

    const handleCellClick = (event) => {
        event.preventDefault();
        const row = event.target.getAttribute('data-row');
        const col = event.target.getAttribute('data-col');

        if (openTiles[row] && col in openTiles[row]) {
            //Cell already open
        } else {

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
                           openTiles = setOpenTiles(JSON.parse(data.game.openTile))
                       }}>
                    {({data, loading, error}) => {
                        if (error) {
                            setGameError(error)
                        }

                        return (
                            <>
                                {error && <Error error={error}/>}
                                {data &&
                                <Grid container spacing={1}>
                                    {[...Array(data.game.size)].map((e, row) => (
                                        <Grid container className={classes.grid} key={row}>
                                            {[...Array(data.game.size)].map((e, col) => (
                                                <Grid container className={classes.gridCell}
                                                      key={col}
                                                      data-row={row}
                                                      data-col={col}
                                                      onClick={event => handleCellClick(event)}>{getCellValue(row, col)}
                                                </Grid>
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
        </div>
    );
};

const GET_GAME = gql`
  query($gameId: UUID!){
    game(gameId: $gameId) {
        id,
        openTile,
        size,
        user {
          username
        },
        updatedAt
      }
    }
`;

const OPEN_TILE_MUTATION = gql`
    
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
        fontWeight: 700
    }
});

export default withStyles(styles)(Game);
