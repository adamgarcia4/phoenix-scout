import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
// import Paper from '@material-ui/core/Paper'
import { ScoutedMatch } from '@shared/Interfaces'
import { store } from '../store'
import Table from '../ui/Table'

const headers = [
	{
		name: 'Match #',
		key: 'match',
	},
	{
		name: 'autoHigh',
		// TODO: Fix so I don't need this key
		key: 'autoHigh',
		getValue: (row: ScoutedMatch) => {
			return `${row?.data.auto.numHighSuccess}/${row?.data.auto.numHighFailed}`
		},
	},
	{
		name: 'autoLow',
		key: 'autoLow',
		getValue: (row: ScoutedMatch) => {
			return `${row?.data.auto.numLowSuccess}/${row?.data.auto.numLowFailed}`
		},
	},
	{
		name: 'autoMoved',
		key: 'didMove',
		getValue: (row: ScoutedMatch) => {
			return row?.data.auto.didMove ? 'Yes' : 'No'
		},
	},
]
const TeamDetail = () => {
	const value = useContext(store)
	const params = useParams<{ teamNum: string }>()
	const { teamNum } = params

	const teamDetails = value.teams.state.documents?.[teamNum] || undefined

	console.log('teamDetails:', teamDetails)

	const teamMatchScoutsArr = Object.values(value.scoutedMatch.state.documents)
		.filter((match) => {
			return (
				match.team === teamNum
				&& match.data
			)
		})

	console.log('teamMatchScoutsArr:', teamMatchScoutsArr)

	return (
		<div>
			<h1>{`Team ${teamDetails?.team_number}: ${teamDetails?.nickname}`}</h1>

			{/* {JSON.stringify(teamDetails, null, 2)} */}

			<Table
				headers={headers}
				data={teamMatchScoutsArr}
			/>
		</div>
	)
}

export default TeamDetail
