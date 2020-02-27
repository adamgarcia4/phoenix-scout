/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import React, { useContext } from 'react'

import {
	useHistory,
	useParams,
} from 'react-router-dom'

import Button from '@material-ui/core/Button'
import { store } from '../store'
import { paths } from '../App'
import TableComponent, { HeadersInterface } from '../ui/Table'
import { getMatchStats, StatsRes } from '../utils'

const MatchOverview = () => {
	const value = useContext(store)
	const history = useHistory()

	const { matchKey } = paths.matchOverview.params(useParams())
	const matchData = value.matches.state.documents[matchKey]

	interface ITeamInfo {
		team: string,
		side: 'red' | 'blue'
	}

	const allTeams: ITeamInfo[] = []
	for (const side of Object.keys(matchData?.alliances ?? {})) {
		for (const team of matchData.alliances[side].team_keys) {
			allTeams.push({
				team,
				side: side as 'red' | 'blue',
			})
		}
	}

	const allScoutedMatches = value.scoutedMatch.state.documents
	const matchesForTeams = allTeams.reduce((base, teamNum) => {
		if (!base[teamNum.team]) {
			base[teamNum.team] = []
		}

		for (const scoutedMatch of Object.values(allScoutedMatches)) {
			if (scoutedMatch.team === teamNum.team) {
				base[teamNum.team].push(scoutedMatch)
			}
		}

		return base
	}, {})

	type IDataRow = StatsRes & ITeamInfo

	const tableData: IDataRow[] = allTeams.map((teamData) => {
		return {
			...teamData,
			...getMatchStats(matchesForTeams[teamData.team]),
		}
	})

	const headers: HeadersInterface[] = [
		{
			name: 'Team #',
			key: 'teamNum',
			getValue: (row: IDataRow) => {
				const style = row.side === 'red' ? { color: 'red' } : { color: 'blue' }

				return (
					<span style={style}>
						{row.team}
					</span>
				)
			},
		},
		{
			name: 'Auto High Goal',
			key: 'high',
			getValue: (row: IDataRow) => {
				if (row.autoHigh) {
					return `${row.autoHigh.percent} ${row.autoHigh.stat}`
				}

				return null
			},
		},
		{
			name: 'Auto Low Goal',
			key: 'low',
			getValue: (row: IDataRow) => {
				if (row.autoLow) {
					return `${row.autoLow.percent} ${row.autoLow.stat}`
				}

				return null
			},
		},
		{
			name: 'Auto Moved',
			key: 'autoMoved',
			getValue: (row: IDataRow) => {
				if (row.autoMoved) {
					return `${row.autoMoved.percent} ${row.autoMoved.stat}`
				}

				return null
			},
		},
		{
			name: 'Tele High',
			key: 'teleHigh',
			getValue: (row: IDataRow) => {
				if (row.teleHigh) {
					return `${row.teleHigh.percent} ${row.teleHigh.stat}`
				}

				return null
			},
		},
		{
			name: 'Tele Low',
			key: 'teleLow',
			getValue: (row: IDataRow) => {
				if (row.teleLow) {
					return `${row.teleLow.percent} ${row.teleLow.stat}`
				}

				return null
			},
		},
		{
			name: 'Under Trench',
			key: 'trench',
			getValue: (row: IDataRow) => {
				if (row.teleTrench) {
					return `${row.teleTrench.percent} ${row.teleTrench.stat}`
				}

				return null
			},
		},
		{
			name: 'Stage 2',
			key: 'stage2',
			getValue: (row: IDataRow) => {
				if (row.teleStage2) {
					return `${row.teleStage2.percent} ${row.teleStage2.stat}`
				}

				return null
			},
		},
		{
			name: 'Stage 3',
			key: 'stage3',
			getValue: (row: IDataRow) => {
				if (row.teleStage3) {
					return `${row.teleStage3.percent} ${row.teleStage3.stat}`
				}

				return null
			},
		},
		{
			name: 'Attempted Climb',
			key: 'attemptedClimb',
			getValue: (row: IDataRow) => {
				if (row.teleAttemptClimb) {
					return `${row.teleAttemptClimb.percent} ${row.teleAttemptClimb.stat}`
				}

				return null
			},
		},
		{
			name: 'Climb Success',
			key: 'climbSuccess',
			getValue: (row: IDataRow) => {
				if (row.teleClimbSuccess) {
					return `${row.teleClimbSuccess.percent} ${row.teleClimbSuccess.stat}`
				}

				return null
			},
		},
		{
			name: 'Actions',
			key: 'actions',
			getValue: (row: IDataRow) => {
				return (
					<div>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								history.push(paths.teamDetailsPage.get(row.team))
							}}
						>
							See More
						</Button>
					</div>
				)
			},
		},
	]
	return (
		<div>
			<TableComponent
				headers={headers}
				data={tableData}
			/>
		</div>
	)
}

export default MatchOverview
