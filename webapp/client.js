/* @flow weak */

import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRouter from 'isomorphic-relay-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, match } from 'react-router';
import Relay from 'react-relay';

import isomorphicVars from '../configuration/webapp/scripts/isomorphicVars';
import routes from '../configuration/webapp/routes';

import './styles/main.css';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin( );

const isoVars = isomorphicVars( );

// Retrieve prepared data
const data = JSON.parse( document.getElementById( 'preloadedData' ).textContent );

var token = localStorage.getItem('id_token');

// Where is the GraphQL server?
const graphQLServerURL = isoVars.PUBLIC_URL + '/graphql';

// Create Relay environment
// Ensure that on the client Relay is passing the HttpOnly cookie with auth, and the user auth token
const environment = new Relay.Environment( );
environment.injectNetworkLayer( new Relay.DefaultNetworkLayer(
    graphQLServerURL,
    {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  )
);

IsomorphicRelay.injectPreparedData(environment, data);

IsomorphicRelay.injectPreparedData(environment, data);
const rootElement = document.getElementById('root');
match( { routes, history: browserHistory }, ( error, redirectLocation, renderProps ) => {
  IsomorphicRouter.prepareInitialRender( environment, renderProps ).then( props => {
    ReactDOM.render( <Router {...props} history={browserHistory} />, rootElement );
  } );
} );
