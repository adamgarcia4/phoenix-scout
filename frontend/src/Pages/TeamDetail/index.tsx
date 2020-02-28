import React, { useContext, useReducer, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PitScout } from '@shared/Interfaces'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { store } from '../../store'
import SummaryPanel from '../../ui/SummaryPanel'
import Expansion from '../../ui/Expansion'
import TeamMatchTable from './TeamMatchTable'

interface IPitSummary {
	pitScoutData: PitScout
}

const PitSummary = ({ pitScoutData }: IPitSummary) => {
	if (!pitScoutData) return null

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
		canPickUp,
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
					label: 'Can Shoot From',
					value: (canShoot || []).join(', '),
				},
				{
					label: 'Can Pick up from',
					value: (canPickUp || []).join(', '),
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

const getInitialState: (teamNum: string) => PitScout = (teamNum) => {
	return {
		key: teamNum,
		fitUnderTrench: false,
		canClimb: false,
		ballCapacity: 0,
		canShootHigh: false,
		canShootLow: false,

		canDoStage2Color: false,
		canDoStage3Color: false,

		canAutonShoot: false,
		canAutonMove: false,

		canShoot: [],
		canPickUp: [],

		wheelSize: '',

		canVisionTrack: false,
		comments: '',
	}
}

type IActions = {
	type: 'initializeData',
	data: PitScout
} | {
	type: 'updateField',
	key: string,
	value: any,
}

const reducer = (prevState: PitScout, action: IActions) => {
	switch (action.type) {
	case 'initializeData':
		return action.data

	case 'updateField':
		return {
			...prevState,
			[action.key]: action.value,
		}
	default:
		return prevState
	}
}

const TeamDetail = () => {
	const value = useContext(store)
	const params = useParams<{ teamNum: string }>()
	const { teamNum } = params

	const teamDetails = value.teams.state.documents?.[teamNum] || undefined

	const pitScout = value.pitScout.state.documents?.[teamNum]

	const [pitScoutData, dispatch] = useReducer(reducer, getInitialState(teamNum))

	useEffect(() => {
		if (pitScout) {
			dispatch({
				type: 'initializeData',
				data: pitScout,
			})
		}
	}, [pitScout])

	if (!teamDetails) {
		return null
	}

	return (
		<div>
			<h1>{`Team ${teamDetails.team_number}: ${teamDetails.nickname}`}</h1>

			<Expansion
				style={{
					marginBottom: '5px',
				}}
				sections={[
					{
						title: 'Robot Stats',
						content: (
							<PitSummary
								pitScoutData={pitScoutData}
							/>
						),
					},
					{
						title: 'Matches',
						content: (
							<TeamMatchTable
								teamNum={teamDetails.key}
							/>
						),
					},
					{
						title: 'Comments',
						content: (
							<div>
								<TextField
									multiline
									fullWidth
									value={pitScoutData.comments}
									onChange={(newVal) => {
										dispatch({
											type: 'updateField',
											key: 'comments',
											value: newVal.target.value,
										})
									}}
								/>
							</div>
						),
					},
				]}
			/>
			<Button
				variant="contained"
				onClick={() => {
					value.pitScout.dispatch({
						type: 'addData',
						data: pitScoutData,
					})
				}}
			>
				Update Data
			</Button>
		</div>
	)
}

export default TeamDetail
