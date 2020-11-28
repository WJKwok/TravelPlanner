import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { AuthRoute, UnAuthRoute } from './utils/AuthRoute';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Planner from './Pages/planner';
import Logger from './Pages/logger';
import Landing from './Pages/landing';
import Trips from './Pages/trips';
import AppBar from './Components/appBar';

import PlaceContextProvider from './Store/PlaceContext';
import SnackBarContextProvider from './Store/SnackBarContext';
import { AuthContextProvider } from './Store/AuthContext';
import SpotContextProvider from './Store/SpotContext';

import ReactGA from 'react-ga';

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: 100,
		marginBottom: 10,
	},
}));

function App() {
	const classes = useStyles();

	useEffect(() => {
		ReactGA.initialize('UA-184129626-1');
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	return (
		<AuthContextProvider>
			<PlaceContextProvider>
				<SpotContextProvider>
					<SnackBarContextProvider>
						<BrowserRouter>
							<AppBar />
							<Container className={classes.container}>
								<Route exact path="/" component={Landing} />
								<Route exact path="/planner/:guideBookId" component={Planner} />
								<Route exact path="/logger" component={Logger} />
								<UnAuthRoute exact path="/trips" component={Trips} />
								<UnAuthRoute
									exact
									path="/planner/:guideBookId/:tripId"
									component={Planner}
								/>
							</Container>
						</BrowserRouter>
					</SnackBarContextProvider>
				</SpotContextProvider>
			</PlaceContextProvider>
		</AuthContextProvider>
	);
}

export default App;
