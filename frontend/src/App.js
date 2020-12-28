import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { AuthRoute, UnAuthRoute } from './utils/AuthRoute';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Planner from './Pages/planner';
import Logger from './Pages/logger';
import Landing from './Pages/landing';
import Trips from './Pages/trips';
import SnackBar from './Components/snackBar';

import PlaceContextProvider from './Store/PlaceContext';
import SnackBarContextProvider from './Store/SnackBarContext';
import { AuthContextProvider } from './Store/AuthContext';
import SpotContextProvider from './Store/SpotContext';
import { LoggerContextProvider } from './Store/LoggerContext';

import ReactGA from 'react-ga';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import deepOrange from '@material-ui/core/colors/deepOrange';

const theme = createMuiTheme({
	cardWidth: 300,
	maxMobileWidth: 430,
	palette: {
		primary: {
			main: deepOrange['A200'],
			// contrastText: '#fff',
		},
		secondary: {
			main: teal['A700'],
		},
	},
});

const useStyles = makeStyles((theme) => ({
	container: {
		width: '100%',
		maxWidth: 1280,
		margin: 'auto',
		padding: '0px 16px',
		[theme.breakpoints.down(430)]: {
			padding: 0,
		},
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
						<LoggerContextProvider>
							<ThemeProvider theme={theme}>
								<BrowserRouter>
									<div className={classes.container}>
										<Route exact path="/" component={Landing} />
										<Route
											exact
											path="/planner/:guideBookId"
											component={Planner}
										/>
										<Route
											exact
											path="/logger/:guideBookId"
											component={Logger}
										/>
										<UnAuthRoute exact path="/trips" component={Trips} />
										<UnAuthRoute
											exact
											path="/planner/:guideBookId/:tripId"
											component={Planner}
										/>
									</div>
								</BrowserRouter>
							</ThemeProvider>
						</LoggerContextProvider>
					</SnackBarContextProvider>
				</SpotContextProvider>
			</PlaceContextProvider>
		</AuthContextProvider>
	);
}

export default App;
