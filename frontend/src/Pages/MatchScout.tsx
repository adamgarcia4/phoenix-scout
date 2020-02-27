/* eslint-disable no-param-reassign */
import React, { useContext, useState } from 'react'
// import { Typography } from '@material-ui/core'

import Button from '@material-ui/core/Button'
import { Theme } from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CancelIcon from '@material-ui/icons/Cancel'
import TextField from '@material-ui/core/TextField'
import { useHistory } from 'react-router-dom'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MaterialSelect from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import { MatchAPIResponse, ScoutedMatch } from '@shared/Interfaces'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Select from 'react-select'
import TableComponent, { HeadersInterface } from '../ui/Table'
import { store } from '../store'
import { paths } from '../App'

const useStyles = makeStyles((theme: Theme) => createStyles({
	saveFab: {
		position: 'absolute',
		right: theme.spacing(2),
		bottom: theme.spacing(2),
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
}))

const getScoutedMatchesForMatch = (allScoutedMatches: ScoutedMatch[], matchKey: string) => {
	return allScoutedMatches.filter((scoutedMatch) => {
		return scoutedMatch.match === matchKey
	})
}

const globalFilter = (origRows, keysArr, c) => {
	const search = c.toLowerCase()

	return origRows.filter((origRow) => {
		const actualObj = origRow.original

		if (actualObj.key.includes(search)) {
			return true
		}

		if (actualObj.alliances) {
			if (
				actualObj.alliances.blue.team_keys.includes(search)
			|| actualObj.alliances.red.team_keys.includes(search)
			) {
				return true
			}
		}

		return false
	})
}

const getMatch = (comp_level: any, match_number: number, blueTeams, redTeams): MatchAPIResponse => {
	// const randomNum = Math.floor(Math.random() * 100) + 100
	// const comp_level = 'pr'
	const event_key = `2020caln_${comp_level}${match_number}`

	return {
		comp_level,
		event_key,
		key: event_key,
		match_number,
		set_number: 1,
		alliances: {
			blue: {
				score: -1,
				team_keys: blueTeams,
			},
			red: {
				score: -1,
				team_keys: redTeams,
			},
		},
	}
}

interface MatchForm {
	editAction: string | false,
	updateMatch: Function
}

const AddOrEditMatchForm: React.FC<MatchForm> = ({ editAction, updateMatch }: MatchForm) => {
	const classes = useStyles({})
	// const randomNum = Math.floor(Math.random() * 100) + 100
	// const comp_level = 'pr'
	// const event_key = `2020isde1_${comp_level}${randomNum}`


	// blue teams
	// red teams
	const matchTypes = ['pr', 'qm', 'ef', 'qf', 'sf', 'f']

	const [matchType, setMatchType] = useState('pr')
	const [matchNumber, setMatchNumber] = useState(1)
	const [blueTeams, setBlueTeams] = useState([])
	const [redTeams, setRedTeams] = useState([])

	console.log('blueTeams:', blueTeams)
	console.log('redTeams:', redTeams)

	const matchTypeOptions = matchTypes.map((type) => ({ label: type, value: type }))

	if (!editAction) {
		return null
	}

	return (
		<div style={{
			display: 'flex',
		}}
		>
			<FormControl variant="outlined" className={classes.formControl}>
				<InputLabel id="demo-simple-select-outlined-label">
          Match Type
				</InputLabel>
				<MaterialSelect
					labelId="demo-simple-select-outlined-label"
					id="demo-simple-select-outlined"
					value={matchType}
					onChange={(val) => {
						setMatchType(val.target.value as string)
					}}
					labelWidth={150}
				>
					{matchTypes.map((type) => {
						return (
							<MenuItem value={type} key={type}>{type}</MenuItem>
						)
					})}
				</MaterialSelect>
			</FormControl>
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				width: '200px',
			}}
			>
				<Select
					styles={{
						container: (provided, state) => ({
							...provided,
						}),
					}}
					placeholder="Blue"
					options={matchTypeOptions}
					onChange={(selectedVal: any[]) => {
						if (!selectedVal) {
							setBlueTeams([])
							return
						}

						const teamsArr = selectedVal.map((item) => item.value)
						setBlueTeams(teamsArr)
					}}
					isMulti
				/>
				<Select
					styles={{
						container: (provided, state) => ({
							...provided,
							// width: '150px',
						}),
					}}
					placeholder="Red"
					options={matchTypeOptions}
					onChange={(selectedVal: any[]) => {
						if (!selectedVal) {
							setRedTeams([])
							return
						}
						const teamsArr = selectedVal.map((item) => item.value)
						setRedTeams(teamsArr)
					}}
					isMulti
				/>

			</div>
			<TextField
				id="outlined-number"
				label="Match Number"
				value={matchNumber}
				onChange={(event) => {
					setMatchNumber(event.target.value as any)
				}}
				type="number"
				InputLabelProps={{
					shrink: true,
				}}
				variant="outlined"
			/>

			<Button
				variant="contained"
				onClick={() => {
					const match = getMatch(matchType, matchNumber, blueTeams, redTeams)
					console.log('match:', match)
					updateMatch(match)
				}}
				color="primary"
			>
				Submit
			</Button>
		</div>
	)
}

const MatchScout: React.FC = () => {
	const value = useContext(store)
	const history = useHistory()
	const classes = useStyles({})

	const relevantMatches = Object.values(value.matches.state.documents)
		// .filter((match) => {
		// 	return match.comp_level === 'qm'
		// })
		.sort((a, b) => a.match_number - b.match_number)

	const scoutedMatches = Object.values(value.scoutedMatch.state.documents)

	const [teamsToScout, setTeamsToScout] = useState<{[key: string]: string}>({})

	// 'add' for new entry, 'qm1' for existing
	const [editAction, setEditAction] = useState<string | false>(false)

	// setEditAction(1)

	// value.matches.state.documents

	const headers: HeadersInterface[] = [
		{
			name: 'Match #',
			key: 'match',
			getValue: (row: MatchAPIResponse) => {
				const scoutedMatchesCompleted = getScoutedMatchesForMatch(scoutedMatches, row.key)

				return `${row.comp_level}${row.match_number} (${scoutedMatchesCompleted.length}/6)`
			},
		},
		{
			name: 'Teams',
			key: 'teams',
			getValue: (row: MatchAPIResponse) => {
				const teamsList = []

				for (const side of Object.keys(row?.alliances)) {
					for (const teamKey of row.alliances[side].team_keys) {
						teamsList.push({
							value: teamKey,
							label: teamKey,
						})
					}
				}

				return (
					<Select
						options={teamsList}
						styles={{
							option: (provided, state) => {
								const teamNum = state.value
								const matchScoutKey = `${row.key}_${teamNum}`

								if (value.scoutedMatch.state.documents[matchScoutKey]) {
									return {
										...provided,
										backgroundColor: '#64ffda',
									}
								}

								return {
									...provided,
								}
							},
						}}
						onChange={(selectedVal) => {
							setTeamsToScout({
								...teamsToScout,
								[row.key]: selectedVal.value,
							})
						}}
						defaultValue={teamsToScout[row.key] ? {
							value: teamsToScout[row.key],
							label: teamsToScout[row.key],
						} : null}
					/>
				)
			},
			styles: {
				minWidth: '200px',
			},
		},
		{
			name: 'Actions',
			key: 'action',
			getValue: (row: MatchAPIResponse) => {
				return (
					<div>
						<Button
							variant="contained"
							color="primary"
							disabled={!teamsToScout[row.key]}
							onClick={() => {
								history.push(paths.addMatchPage.get(row.key, teamsToScout[row.key]))
							}}
							style={{ marginRight: '5px' }}
						>
							Scout Now
						</Button>

						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								history.push(paths.matchOverview.get(row.key))
							}}
						>
							Overview
						</Button>

					</div>
				)
			},
			sort: false,
		},
	]

	return (
		<div>
			<h1>Welcome to Phoenix Scout Home!</h1>

			<TableComponent
				headers={React.useMemo(() => headers, [headers])}
				data={React.useMemo(() => relevantMatches, [value.matches.state.documents])}
				options={{ globalFilter }}
				headerQuickAction={(
					<AddOrEditMatchForm
						editAction={editAction}
						updateMatch={(match) => {
							value.matches.dispatch({
								type: 'addData',
								data: match,
							})
						}}
					/>
				)}
			/>

			<Fab
				color="primary"
				className={classes.saveFab}
				// disabled={JSON.stringify(oldData) === JSON.stringify(data)}
				onClick={() => {
					if (editAction === false) {
						setEditAction('add')
					} else {
						setEditAction(false)
					}
				}}
			>
				{editAction === false ? <AddIcon /> : <CancelIcon />}
			</Fab>
		</div>
	)
}

export default MatchScout
