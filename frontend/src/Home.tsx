/* eslint-disable no-param-reassign */
import React from 'react'
import { Typography } from '@material-ui/core'

import 'firebase/firestore'

import TableComponent, { HeadersInterface } from './ui/Table'
// import { MatchInterface } from './Interfaces'
import { ScoutedMatch } from '@shared/Interfaces'

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const FIRST_QUERY = gql`
	{
		scoutedMatches {
			key
			status
			compLevel
			time
			team
			assignedTo {
				name
			}
		}
	}
`

interface QueryResponse {
	scoutedMatches?: [ScoutedMatch]
}
const Home: React.FC = () => {
	// const [scoutMatches] = useCollection(matchesRefInOrder)
	const { data } = useQuery<QueryResponse>(FIRST_QUERY)

	const headers: HeadersInterface[] = [
		{
			name: 'Match Name',
			key: 'key',
		},
		{
			name: 'Status',
			key: 'status'
		},
		{
			name: 'Team',
			key: 'team'
		}
	]

	return (
		<div>
			<h1>Welcome to Phoenix Scout Home!</h1>
			<Typography variant="h4">
        Upcoming Matches
			</Typography>
			<TableComponent headers={headers} data={data?.scoutedMatches} />
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
