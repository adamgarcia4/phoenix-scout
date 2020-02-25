import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
	Theme,
} from '@material-ui/core'
import { ScoutedMatch, PitScout } from '@shared/Interfaces'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { store } from '../store'

import SummaryPanel from '../ui/SummaryPanel'
import Expansion from '../ui/Expansion'
import Table from '../ui/Table'

const useStyles = makeStyles((theme: Theme) => createStyles({
	root: {
		width: '100%',
	},
	saveFab: {
		position: 'absolute',
		right: theme.spacing(2),
		bottom: theme.spacing(2),
	},
	matchSummaryContainer: {
		padding: '10px',
		marginBottom: '15px',
		display: 'flex',
	},
	fieldContainer: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	fieldContainerLabel: {
		fontWeight: 'bold',
	},
}))

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

interface IPitSummary {
	pitScoutData: PitScout
}

const PitSummary = ({ pitScoutData }: IPitSummary) => {
	if (!pitScoutData) return null

	const styles = useStyles({})

	const getBoolString = (val: boolean) => {
		return val ? 'Yes' : 'No'
	}

	const {
		ballCapacity,
		canAutonMove,
		canAutonShoot,
		canClimb,
		canDoStage2Color,
		canDoStage3Color,
		canShoot,
		canShootHigh,
		canShootLow,
		canVisionTrack,
		fitUnderTrench,
		wheelSize,
	} = pitScoutData

	return (
		<SummaryPanel
			// isVertical
			data={[
				{
					label: 'Ball Capacity',
					value: ballCapacity,
				},
				{
					label: 'Can Auton Move',
					value: getBoolString(canAutonMove),
				},
				{
					label: 'Can Auton Shoot',
					value: getBoolString(canAutonShoot),
				},
				{
					label: 'Can Climb',
					value: getBoolString(canClimb),
				},
				{
					label: 'Stage 2',
					value: getBoolString(canDoStage2Color),
				},
				{
					label: 'Stage 3',
					value: getBoolString(canDoStage3Color),
				},
				{
					label: 'Can Shoot',
					value: JSON.stringify(canShoot),
				},
				{
					label: 'Shoot High',
					value: getBoolString(canShootHigh),
				},
				{
					label: 'Shoot Low',
					value: getBoolString(canShootLow),
				},
				{
					label: 'Vision',
					value: getBoolString(canVisionTrack),
				},
				{
					label: 'Under Trench',
					value: getBoolString(fitUnderTrench),
				},
				{
					label: 'Wheel Size',
					value: wheelSize,
				},
			]}
		/>
	)
}
const TeamDetail = () => {
	const value = useContext(store)
	const styles = useStyles({})
	const params = useParams<{ teamNum: string }>()
	const { teamNum } = params

	const teamDetails = value.teams.state.documents?.[teamNum] || undefined

	// console.log('teamDetails:', teamDetails)

	const teamMatchScoutsArr = Object.values(value.scoutedMatch.state.documents)
		.filter((match) => {
			return (
				match.team === teamNum
				&& match.data
			)
		})

	const pitScout = value.pitScout.state.documents?.[teamNum]
	console.log('pitScout:', pitScout)

	console.log('teamMatchScoutsArr:', teamMatchScoutsArr)

	return (
		<div>
			<h1>{`Team ${teamDetails?.team_number}: ${teamDetails?.nickname}`}</h1>

			<Expansion
				sections={[
					{
						title: 'Robot Stats',
						content: (
							<PitSummary
								pitScoutData={pitScout}
							/>
						),
					},
					{
						title: 'Matches',
						content: (
							<Table
								headers={headers}
								data={teamMatchScoutsArr}
							/>
						),
					},
				]}
			/>
		</div>
	)
}

export default TeamDetail
