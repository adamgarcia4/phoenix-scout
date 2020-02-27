/* eslint-disable no-tabs */
import React, { useContext } from 'react'

import { ScoutedMatch } from '@shared/Interfaces'
import { StatsRes, getMatchStats } from '../../utils'
import TableComponent, { HeadersInterface } from '../../ui/Table'
import { store } from '../../store'

interface ITeamInfo {
	team: string,
	side: 'red' | 'blue'
}

type IDataRow = StatsRes & ScoutedMatch

type Props = {
	// data: IDataRow[],
	teamNum: string,
}

const TeamMatchTable: React.FC<Props> = ({ teamNum }: Props) => {
	const state = useContext(store)
	// auto high/low, autoMoved, tele high/low, underTrench, s2/3, attemptedClimb/Success
	const allMatches = Object.values(state.scoutedMatch.state.documents)

	const teamMatches = allMatches.filter((match) => match.team === teamNum)

	const data: IDataRow[] = teamMatches.map((teamMatch) => {
		return {
			...teamMatch,
			...getMatchStats([teamMatch]),
		}
	})

	const getBooleanString = (val: boolean) => {
		return val ? 'Yes' : 'No'
	}

	const headers: HeadersInterface[] = [
		{
			name: 'Match #',
			key: 'match',
		},
		{
			name: 'autoHigh',
			key: 'autoHigh',
			getValue: (row: IDataRow) => {
				if (row.autoHigh) {
					return `${row.autoHigh.percent} ${row.autoHigh.stat}`
				}

				return null
			},
		},
		{
			name: 'autoLow',
			key: 'autoLow',
			getValue: (row: IDataRow) => {
				if (row.autoLow) {
					return `${row.autoLow.percent} ${row.autoLow.stat}`
				}

				return null
			},
		},
		{
			name: 'autoMoved',
			key: 'autoMoved',
			getValue: (row: IDataRow) => {
				if ('didMove' in row.data.auto) {
					return getBooleanString(row.data.auto.didMove)
				}

				return null
			},
		},
		{
			name: 'teleHigh',
			key: 'teleHigh',
			getValue: (row: IDataRow) => {
				if (row.teleHigh) {
					return `${row.teleHigh.percent} ${row.teleHigh.stat}`
				}

				return null
			},
		},
		{
			name: 'teleLow',
			key: 'teleLow',
			getValue: (row: IDataRow) => {
				if (row.teleLow) {
					return `${row.teleLow.percent} ${row.teleLow.stat}`
				}

				return null
			},
		},
		{
			name: 'underTrench',
			key: 'underTrench',
			getValue: (row: IDataRow) => {
				if ('fitUnderTrench' in row.data.tele) {
					return getBooleanString(row.data.tele.fitUnderTrench)
				}

				return null
			},
		},
		{
			name: 'Color Stage 2',
			key: 'color2',
			getValue: (row: IDataRow) => {
				if ('stage2Color' in row.data.tele) {
					return getBooleanString(row.data.tele.stage2Color)
				}

				return null
			},
		},
		{
			name: 'Color Stage 3',
			key: 'color3',
			getValue: (row: IDataRow) => {
				if ('stage3Color' in row.data.tele) {
					return getBooleanString(row.data.tele.stage3Color)
				}

				return null
			},
		},
		{
			name: 'Attempted Climb',
			key: 'attempted',
			getValue: (row: IDataRow) => {
				if ('attemptedClimb' in row.data.tele) {
					return getBooleanString(row.data.tele.attemptedClimb)
				}

				return null
			},
		},
		{
			name: 'Sucessful Climb',
			key: 'success',
			getValue: (row: IDataRow) => {
				if ('climbSuccess' in row.data.tele) {
					return getBooleanString(row.data.tele.climbSuccess)
				}

				return null
			},
		},
	]

	return (
		<TableComponent
			headers={headers}
			data={data}
		/>
	)
}

export default TeamMatchTable
