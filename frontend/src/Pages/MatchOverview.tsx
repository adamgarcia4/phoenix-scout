/* eslint-disable max-len */
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

type AccumulationStat = {
	stat?: string,
	percent?: number,
}
interface StatsRes {
	autoHigh?: AccumulationStat,
	autoLow?: AccumulationStat,
	autoMoved?: AccumulationStat,
	teleHigh?: AccumulationStat,
	teleLow?: AccumulationStat,
	teleTrench?: AccumulationStat,
	teleStage2?: AccumulationStat,
	teleStage3?: AccumulationStat,
	teleAttemptClimb?: AccumulationStat,
	teleClimbSuccess?: AccumulationStat,
}


const getTotalPropertyCount = (matchesArr: ScoutedMatch[], getValueFunc: Function) => {
	return matchesArr.reduce((base, match) => {
		const val = getValueFunc(match)
		return val ? base + val : base
	}, 0)
}

const getAccumStat = (
	matchesArr: ScoutedMatch[],
	getSuccess: Function,
	getFail: Function,
): AccumulationStat => {
	const numSuccess = getTotalPropertyCount(matchesArr, getSuccess)
	const numFail = getTotalPropertyCount(matchesArr, getFail)

	return {
		percent: Math.round(
			(100 * numSuccess) / (numSuccess + numFail),
		) / 100,
		stat: `(${numSuccess}/${numSuccess + numFail})`,
	}
}

const getFrequencyStat = (
	matchesArr: ScoutedMatch[],
	getValue: Function,
): AccumulationStat => {
	const numSuccess = getTotalPropertyCount(matchesArr, getValue)

	const totalMatches = matchesArr.length

	return {
		percent: Math.round(
			(100 * numSuccess) / (totalMatches),
		) / 100,
		stat: `(${numSuccess}/${totalMatches})`,
	}
}

const getStats = (matchesArr: ScoutedMatch[] | undefined): StatsRes => {
	if (!matchesArr || matchesArr.length === 0) {
		return {}
	}

	// auto High.  Auto Low.  Did move.
	const autoHigh = getAccumStat(matchesArr, (match: ScoutedMatch) => match?.data?.auto.numHighSuccess, (match: ScoutedMatch) => match?.data?.auto.numHighFailed)

	const autoLow = getAccumStat(matchesArr, (match: ScoutedMatch) => match?.data?.auto.numLowSuccess, (match: ScoutedMatch) => match?.data?.auto.numLowFailed)

	const autoMoved = getFrequencyStat(matchesArr, (match: ScoutedMatch) => match?.data?.auto.didMove)

	const teleHigh = getAccumStat(matchesArr, (match: ScoutedMatch) => match?.data?.tele.numHighSuccess, (match: ScoutedMatch) => match?.data?.tele.numHighFailed)

	const teleLow = getAccumStat(matchesArr, (match: ScoutedMatch) => match?.data?.tele.numLowSuccess, (match: ScoutedMatch) => match?.data?.tele.numLowFailed)

	const teleTrench = getFrequencyStat(matchesArr, (match: ScoutedMatch) => match?.data?.tele.fitUnderTrench)

	const teleStage2 = getFrequencyStat(matchesArr, (match: ScoutedMatch) => match?.data?.tele.stage2Color)
	const teleStage3 = getFrequencyStat(matchesArr, (match: ScoutedMatch) => match?.data?.tele.stage3Color)

	const teleAttemptClimb = getFrequencyStat(matchesArr, (match: ScoutedMatch) => match?.data?.tele.attemptedClimb)
	const teleClimbSuccess = getFrequencyStat(matchesArr, (match: ScoutedMatch) => match?.data?.tele.climbSuccess)

	// tele high.  Tele low.  Trench. stage2Color, stage3color, attempted climb, climbSuccess

	return {
		autoHigh,
		autoLow,
		autoMoved,

		teleHigh,
		teleLow,
		teleTrench,
		teleStage2,
		teleStage3,
		teleAttemptClimb,
		teleClimbSuccess,
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

	console.log('tableData:', tableData)

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
