import React from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom'
import './config/firebase'
import About from './About'
import Home from './Home'
import AddMatch from './Pages/AddMatch'
import Admin from './Pages/Admin'
import Header from './components/Header'
import TeamDetail from './Pages/TeamDetail'
import TeamsPage from './Pages/Teams'

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
)

export default App
