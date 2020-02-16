
import React from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom'

import About from './About'
import Home from './Home'
import AddMatch from './Pages/AddMatchScout'
import Admin from './Pages/Admin'
import Header from './components/Header'
import TeamDetail from './Pages/TeamDetail'
import TeamsPage from './Pages/Teams'
import { StateProvider } from './store'

export const paths = {
	aboutPage: '/about',
	addMatchPage: {
		route: '/match/:matchKey/scout/:teamNum',
		get: (matchKey, teamNum) => {
			return `match/${matchKey}/scout/${teamNum}`
		},
	},
	teamsPage: '/teams',
	teamDetailsPage: {
		route: '/team-detail/:teamNum/',
		get: (teamNum) => `/team-detail/${teamNum}`,
	},
	adminPage: '/admin',
	homePage: '/',
	schedulePage: '/schedule',
}

const App: React.FC = () => (
	<StateProvider>
		<Router>
			<Header>
				<Switch>
					<Route path={paths.aboutPage}>
						<About />
					</Route>
					<Route path={paths.addMatchPage.route}>
						<AddMatch />
					</Route>
					<Route path={paths.teamsPage}>
						<TeamsPage />
					</Route>
					<Route path={paths.teamDetailsPage.route}>
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
	</StateProvider>
)

export default App
