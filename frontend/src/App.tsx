import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { AuthRoute, UnAuthRoute, AdminRoute } from './utils/AuthRoute';

import { makeStyles } from '@material-ui/core/styles';

import SnackBarContextProvider from './Store/SnackBarContext';
import { AuthContextProvider } from './Store/AuthContext';
import SpotContextProvider from './Store/SpotContext';
import { LoggerContextProvider } from './Store/LoggerContext';

import ReactGA from 'react-ga';
import { ThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import teal from '@material-ui/core/colors/teal';
import deepOrange from '@material-ui/core/colors/deepOrange';

import { Landing, Trips, Planner, PlannerWeb, Logger } from 'Pages';

declare module '@material-ui/core/styles/createMuiTheme' {
	interface Theme {
		cardWidth: number;
		maxMobileWidth: number;
	}
	interface ThemeOptions {
		cardWidth: number;
		maxMobileWidth: number;
	}
}

const theme = createMuiTheme({
	cardWidth: 300,
	maxMobileWidth: 430,
	// palette: {
	// 	primary: {
	// 		main: deepOrange['A200'],
	// 		// contrastText: '#fff',
	// 	},
	// 	secondary: {
	// 		main: teal['A700'],
	// 	},
	// },
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
									<UnAuthRoute exact path="/trips" component={Trips} />
									<UnAuthRoute
										exact
										path="/planner/:guideBookId/:tripId"
										component={Planner}
									/>
								</div>
								<AdminRoute
									exact
									path="/logger/:guideBookId"
									component={Logger}
								/>
								<Route
									exact
									path="/web/planner/:guideBookId"
									component={PlannerWeb}
								/>
								<UnAuthRoute
									exact
									path="/web/planner/:guideBookId/:tripId"
									component={PlannerWeb}
								/>
							</BrowserRouter>
						</ThemeProvider>
					</LoggerContextProvider>
				</SnackBarContextProvider>
			</SpotContextProvider>
		</AuthContextProvider>
	);
}

export default App;
