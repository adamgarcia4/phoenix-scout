
import React from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom'

import About from './About'
import MatchScout from './Pages/MatchScout'
import AddMatch from './Pages/AddMatchScout'
import Admin from './Pages/Admin'
import Header from './components/Header'
import TeamDetail from './Pages/TeamDetail'
import TeamsPage from './Pages/Teams'
import MatchOverview from './Pages/MatchOverview'
import PitScout from './Pages/PitScout'
import { StateProvider } from './store'

export const paths = {
	aboutPage: '/about',
	pitScout: {
		get: (teamNum) => {
			return `pitScout/${teamNum}`
		},
		route: '/pitScout/:teamNum',
		params: (params) => {
			return {
				teamNum: params.teamNum,
			}
		},
	},
	matchOverview: {
		route: '/match/:matchKey',
		get: (matchKey) => {
			return `match/${matchKey}`
		},
		params: (params) => {
			return {
				matchKey: params.matchKey,
			}
		},
	},
	addMatchPage: {
		route: '/match/:matchKey/scout/:teamNum',
		get: (matchKey, teamNum) => {
			return `match/${matchKey}/scout/${teamNum}`
		},
		params: (params) => {
			return {
				matchKey: params.matchKey,
				teamNum: params.teamNum,
			}
		},
	},
	teamsPage: '/teams',
	addTeams: {
		route: '/addTeams',
	},
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
					<Route path={paths.matchOverview.route}>
						<MatchOverview />
					</Route>
					<Route path={paths.teamsPage}>
						<TeamsPage />
					</Route>
					<Route path={paths.pitScout.route}>
						<PitScout/>
					</Route>
					<Route path={paths.teamDetailsPage.route}>
						<TeamDetail />
					</Route>
					<Route path={paths.adminPage}>
						<Admin />
					</Route>
					<Route path={paths.homePage}>
						<MatchScout />
					</Route>
				</Switch>
			</Header>
		</Router>
	</StateProvider>
)

export default App
