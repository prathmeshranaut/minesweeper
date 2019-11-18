import React from "react";
import withRoot from "./withRoot";
import {Query} from "react-apollo";
import {gql} from 'apollo-boost';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import App from "./routes/App";
import Game from "./routes/Game";
import Navigation from "./components/Shared/Navigation";
import Loading from "./components/Shared/Loading";
import Error from "./components/Shared/Error";


const Root = () => (
    <Query query={ME_QUERY}>
        {({data, loading, error}) => {
            if (loading) return <Loading/>;
            if (error) return <Error error={error}/>

            const currentUser = data.me;

            return (
                <Router>
                    <>
                        <Navigation currentUser={currentUser} />
                        <Switch>
                            <Route exact path="/" component={App} />
                            <Route path="/game/:id" component={Game} />
                        </Switch>
                    </>
                </Router>
            )
        }}
    </Query>
);

const ME_QUERY = gql`
{
    me {
        username
        email
    }
}`;

// const GET_TRACKS_QUERY = gql`
//     {
//         tracks {
//             id
//             title
//             description
//         }
//     }
// `;

export default withRoot(Root);
