/* eslint-disable no-param-reassign */
import React from 'react'
import { Typography } from '@material-ui/core'

// import firebase from 'firebase/app'

import 'firebase/firestore'
// import { useCollection } from 'react-firebase-hooks/firestore'
// import moment from 'moment'

// import Axios from 'axios'
import useAxios from 'axios-hooks'
import TableComponent, { HeadersInterface } from './ui/Table'
import { MatchInterface } from './Interfaces'
import { Model } from '@shared/model'

console.log('new Model().title:', new Model().title)

// const matchesRefInOrder = firebase
// .firestore()
// .collection('scoutMatches')
// .orderBy('time', 'asc')

const Home: React.FC = () => {
	// const [scoutMatches] = useCollection(matchesRefInOrder)
	const [{ data }] = useAxios('http://localhost:8080')

	console.log('data:', data)

	// const scoutMatchesArr: ScoutedMatch[] = scoutMatches?.docs.map(
	// (doc) => doc.data() as ScoutedMatch
	// ) || []

	const output: MatchInterface[] = [
		{
			name: 'match1',
			teams: [4, 330, 254],
		},
	]


	// const output = scoutMatchesArr.reduce((base, scoutedMatch) => {
	// if (!base[scoutedMatch.match]) {
	// base[scoutedMatch.match] = {}
	// }

	// base[scoutedMatch.match].
	// }, {})

	const headers: HeadersInterface[] = [
		{
			name: 'Match Name',
			key: 'name',
		},
		{
			name: 'Teams In Match',
			key: 'teams',
			getValue: (arr: string[]) => arr.join(', '),
		},
	]

	return (
		<div>
			<h1>Welcome to Phoenix Scout Home!</h1>
			<h2>{data}</h2>
			<Typography variant="h4">
        Upcoming Matches
			</Typography>
			<TableComponent headers={headers} data={output} />
		</div>
	)
}

export default Home

// const headersForMatchResult = [
// {
// name: '# High Auto',
// key: 'numHighAuto',
// },
// {
// name: '# Low Auto',
// key: 'numLowAuto',
// },
// {
// name: '# High Teleop',
// key: 'numHighTele',
// },
// {
// name: '# Low Teleop',
// key: 'numLowTele',
// },
// {
// name: 'Did Engage Colorwheel',
// key: 'isColorWheel',
// },
// {
// name: 'Did Climb',
// key: 'didClimb',
// },
// ]
