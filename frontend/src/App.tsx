
import React from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom'

import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from "@apollo/react-hooks";
import './config/firebase'
import About from './About'
import Home from './Home'
import AddMatch from './Pages/AddMatch'
import Admin from './Pages/Admin'
import Header from './components/Header'
import TeamDetail from './Pages/TeamDetail'
import TeamsPage from './Pages/Teams'

const client = new ApolloClient({
  uri: 'http://localhost:8080/',
});

export const paths = {
	aboutPage: '/about',
	addMatchPage: '/add-match/:matchKey',
	teamsPage: '/teams',
	teamDetailsPage: '/team-detail',
	adminPage: '/admin',
	homePage: '/',
	schedulePage: '/schedule',
}

const App: React.FC = () => (
	<ApolloProvider client={client}>
		<Router>
			<Header>
				<Switch>
					<Route path={paths.aboutPage}>
						<About />
					</Route>
					<Route path={paths.addMatchPage}>
						<AddMatch />
					</Route>
					<Route path={paths.teamsPage}>
						<TeamsPage />
					</Route>
					<Route path={paths.teamDetailsPage}>
						<TeamDetail />
					</Route>
					<Route path={paths.adminPage}>
						<Admin />
					</Route>
					<Route path={paths.homePage}>
						<Home />
					</Route>
				</Switch>
			</Header>
		</Router>
	</ApolloProvider>
)

export default App
