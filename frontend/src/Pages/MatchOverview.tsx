/* eslint-disable no-param-reassign */
import React, { useContext } from 'react'

import {
	useHistory,
	useParams,
} from 'react-router-dom'

import Button from '@material-ui/core/Button'
import { ScoutedMatch } from '@shared/Interfaces'
import { store } from '../store'
import { paths } from '../App'
import TableComponent, { HeadersInterface } from '../ui/Table'

interface StatsRes {
	highStat?: string,
	highPercent?: number,
	lowStat?: string,
	lowPercent?: number,
}

const getStats = (matchesArr: ScoutedMatch[] | undefined): StatsRes => {
	if (!matchesArr || matchesArr.length === 0) {
		return {}
	}

	const matchData = matchesArr.reduce((base, match) => {
		const { auto } = match?.data

		if (auto) {
			base.highSuccess += auto.numHighSuccess
			base.highFail += auto.numHighFailed
			base.lowSuccess += auto.numLowSuccess
			base.lowFail += auto.numLowFailed
			base.count += 1
		}

		return base
	}, {
		highSuccess: 0,
		highFail: 0,
		lowSuccess: 0,
		lowFail: 0,
		count: 0,
	})

	console.log('matchData123:', matchData)

	const getAvg = (num: number, den: number) => {
		const avg = num / (num + den)
		return Math.round(avg * 1e2) / 1e2
	}

	return {
		highStat: `${matchData.highSuccess}/${matchData.highFail}`,
		highPercent: getAvg(matchData.highSuccess, matchData.highFail),
		lowStat: `${matchData.lowSuccess}/${matchData.lowFail}`,
		lowPercent: getAvg(matchData.lowSuccess, matchData.lowFail),
	}
}

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

	console.log('matchesForTeams:', matchesForTeams)

	interface IDataRow extends StatsRes, ITeamInfo {
	}

	const tableData: IDataRow[] = allTeams.map((teamData) => {
		return {
			...teamData,
			...getStats(matchesForTeams[teamData.team]),
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
			name: 'High Goal',
			key: 'high',
			getValue: (row: IDataRow) => {
				if (row.highPercent) {
					return `${row.highPercent} (${row.highStat})`
				}

				return null
			},
		},
		{
			name: 'Low Goal',
			key: 'low',
			getValue: (row: IDataRow) => {
				if (row.lowPercent) {
					return `${row.lowPercent} (${row.lowStat})`
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
