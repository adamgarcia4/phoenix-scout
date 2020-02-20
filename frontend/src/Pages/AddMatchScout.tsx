/* eslint-disable react/destructuring-assignment */
import React, {
	useState, useContext, useEffect, useReducer,
} from 'react'
import {
	Button,
	Typography,
	Box,
	Theme,
} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import SaveIcon from '@material-ui/icons/Save'
import Fab from '@material-ui/core/Fab'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'
import {
	useHistory,
	useParams,
} from 'react-router-dom'

import {
	ScoutedMatch,
	ScoutedMatchData,
	MatchAPIResponse,
} from '@shared/Interfaces'

import { paths } from '../App'
import Expansion from '../ui/Expansion'
import { store } from '../store'

const NumberButton = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: 50px;
  height: 36px;
  text-align: center;
  line-height: 36px;
`

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

const incrementOnPositive = (
	hookFunc: Function,
	newNum: number,
) => {
	if (newNum > -1) {
		hookFunc(newNum)
	}
}

interface BallCountSectionInterface {
  title: string,
  numBalls: number,
  incrementFunction: Function
}

const BallCountSection = ({
	title,
	numBalls,
	incrementFunction,
}: BallCountSectionInterface) => (
	<>
		<Typography variant="h6">
			{title}
		</Typography>
		<NumberButton>
			{numBalls}
		</NumberButton>
		<Button variant="contained" color="primary" size="small" onClick={() => incrementOnPositive(incrementFunction, numBalls + 1)}>+</Button>
		<Button variant="contained" color="secondary" size="small" onClick={() => incrementOnPositive(incrementFunction, numBalls - 1)}>-</Button>
	</>
)

interface AutonModeProps {
	numHighSuccess: number;
	setNumHighSuccess: Function;
	numHighFailed: number;
	setNumHighFailed: Function;
	numLowSuccess: number;
	setNumLowSuccess: Function;
	numLowFailed: number;
	setNumLowFailed: Function;
	didMove: boolean;
	setDidMove: Function;
}

const AutonMode = ({
	numHighSuccess,
	setNumHighSuccess,
	numHighFailed,
	setNumHighFailed,
	numLowSuccess,
	setNumLowSuccess,
	numLowFailed,
	setNumLowFailed,
	didMove,
	setDidMove,
}: AutonModeProps) => {
	return (
		<Box display="flex" flexDirection="column">
			<FormControlLabel
				control={(
					<Switch
						checked={didMove}
						// TODO: Fix to type safety
						onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
							setDidMove(checked)
							return true
						}}
						value="checkedB"
						color="primary"
					/>
				)}
				label="Did Robot Move?"
			/>
			<Box>
				<BallCountSection
					title="High Balls Scored"
					numBalls={numHighSuccess}
					incrementFunction={setNumHighSuccess}
				/>
			</Box>
			<Box>
				<BallCountSection
					title="High Balls Missed"
					numBalls={numHighFailed}
					incrementFunction={setNumHighFailed}
				/>
			</Box>
			<Box>
				<BallCountSection
					title="Low Balls Scored"
					numBalls={numLowSuccess}
					incrementFunction={setNumLowSuccess}
				/>
			</Box>
			<Box>
				<BallCountSection
					title="Low Balls Missed"
					numBalls={numLowFailed}
					incrementFunction={setNumLowFailed}
				/>
			</Box>
		</Box>
	)
}

interface TeleModeProps {
  numHigh: number,
  setNumHigh: Function,
  numLow: number,
  setNumLow: Function,
  isColorWheel: boolean,
  setIsColorWheel: Function,
}

const TeleMode = ({
	numHigh,
	setNumHigh,
	numLow,
	setNumLow,
	isColorWheel,
	setIsColorWheel,
}: TeleModeProps) => {
	return (
		<Box display="flex" flexDirection="column">
			<Typography>
                Please record results of Teleop Here!
			</Typography>
			<Box>
				<BallCountSection
					title="High Balls"
					numBalls={numHigh}
					incrementFunction={setNumHigh}
				/>
			</Box>
			<Box>
				<BallCountSection
					title="Low Balls"
					numBalls={numLow}
					incrementFunction={setNumLow}
				/>
			</Box>

			<Box>
				<FormGroup row>
					<FormControlLabel
						control={
							<Switch checked={isColorWheel} onChange={() => setIsColorWheel(!isColorWheel)} value="checkedA" />
						}
						label="Color Wheel Engaged"
					/>
				</FormGroup>
			</Box>


		</Box>

	)
}

interface EndGameModeProps {
  expanded: any,
  handlePanelChange: any,
  didClimb: boolean,
  setDidClimb: Function,
}

const EndGameMode = ({
	didClimb,
	setDidClimb,
}: EndGameModeProps) => {
	// const classes = useStyles({})
	return (
		<Box display="flex" flexDirection="column">
			<Typography>
                Please record results of the End Game!
			</Typography>
			<Box>
				<FormGroup row>
					<FormControlLabel
						control={
							<Switch checked={didClimb} onChange={() => setDidClimb(!didClimb)} value="checkedA" />
						}
						label="Did they climb"
					/>
				</FormGroup>
			</Box>


		</Box>
	)
}

interface IMatchFieldContainer {
	label: string | number,
	value: string | number,
}

const MatchSummaryFieldContainer = (props: IMatchFieldContainer) => {
	const { label, value } = props
	const styles = useStyles({})

	return (
		<div className={styles.fieldContainer}>
			<span className={styles.fieldContainerLabel}>{label}</span>
			<span>{value}</span>
		</div>
	)
}

const getSide = (matchDetails, teamNum) => {
	const sideForTeamObj = Object
		.keys(matchDetails?.alliances || {})
		.reduce((base, side) => {
			for (const teamKey of matchDetails.alliances[side].team_keys) {
			// eslint-disable-next-line no-param-reassign
				base[teamKey] = side
			}

			return base
		}, {})

	return sideForTeamObj[teamNum]
}

interface ISummaryProps {
	matchDetails?: MatchAPIResponse,
	teamNum: string
}
const Summary = ({
	matchDetails,
	teamNum,
}: ISummaryProps) => {
	return (
		<>
			<MatchSummaryFieldContainer label="Side" value={getSide(matchDetails, teamNum)} />
			<MatchSummaryFieldContainer label="Team" value={teamNum} />
			<MatchSummaryFieldContainer label="Match #" value={`${matchDetails?.comp_level} ${matchDetails?.match_number}`} />
		</>
	)
}

type MatchActions = {
	type: 'initializeData',
	data: ScoutedMatchData
} | {
	type: 'setAuto',
	key: string,
	value: any,
}

const matchReducer = (prevState: ScoutedMatchData, action: MatchActions) => {
	switch (action.type) {
	case 'initializeData':
		return action.data
	case 'setAuto':
		return {
			auto: {
				...prevState.auto,
				[action.key]: action.value,
			},
		}
	default:
		return prevState
	}
}

export default function AddMatch() {
	const context = useContext(store)

	const { matchKey, teamNum } = paths.addMatchPage.params(useParams())

	const matchDetails = context.matches.state.documents?.[matchKey]

	const scoutMatchKey = `${matchKey}_${teamNum}`
	const scoutedMatch = context.scoutedMatch.state.documents?.[scoutMatchKey]

	const getInitialState: () => ScoutedMatchData = () => ({
		auto: {
			numHighSuccess: 0,
			numHighFailed: 0,
			numLowSuccess: 0,
			numLowFailed: 0,
			didMove: false,
		},
	})

	const [data, dispatch] = useReducer(matchReducer, getInitialState())
	const [oldData, setOldData] = useState(undefined)

	const [numHighTele, setNumHighTele] = useState(0)
	const [numLowTele, setNumLowTele] = useState(0)
	const [isColorWheel, setIsColorWheel] = useState(false)
	const [didClimb, setDidClimb] = useState(false)

	// update all state when data comes live
	useEffect(() => {
		if (scoutedMatch?.data) {
			setOldData(scoutedMatch.data)

			dispatch({
				type: 'initializeData',
				data: scoutedMatch.data,
			})
		}
	}, [scoutedMatch])

	const history = useHistory()

	const [expanded, setExpanded] = useState<string | false>('panel1')
	const classes = useStyles({})

	const handlePanelChange = (panel: string) => (
		event: React.ChangeEvent<{}>,
		isExpanded: boolean,
	) => {
		setExpanded(isExpanded ? panel : false)
	}

	const styles = useStyles({})

	const submitMatch = () => {
		const newMatchObj: ScoutedMatch = {
			key: `${matchDetails.key}_${teamNum}`,
			match: matchKey,
			team: teamNum,
			compLevel: matchDetails.comp_level,
			side: getSide(matchDetails, teamNum),
			data,
		}

		console.log('newMatchObj:', newMatchObj)
		context.scoutedMatch.dispatch({
			type: 'addData',
			data: newMatchObj,
		})

		history.push('/')
	}

	const updateAutoVal = (key) => (val) => {
		dispatch({
			type: 'setAuto',
			key,
			value: val,
		})
	}

	return (
		<div className={classes.root}>
			<Paper className={styles.matchSummaryContainer}>
				<Summary
					matchDetails={matchDetails}
					teamNum={teamNum}
				/>
			</Paper>
			<Expansion
				sections={[
					{
						title: 'Auton Mode',
						content: (
							<AutonMode
								numHighSuccess={data.auto.numHighSuccess}
								setNumHighSuccess={updateAutoVal('numHighSuccess')}
								numHighFailed={data.auto.numHighFailed}
								setNumHighFailed={updateAutoVal('numHighFailed')}
								numLowSuccess={data.auto.numLowSuccess}
								setNumLowSuccess={updateAutoVal('numLowSuccess')}
								numLowFailed={data.auto.numLowFailed}
								setNumLowFailed={updateAutoVal('numLowFailed')}
								didMove={data.auto.didMove}
								setDidMove={updateAutoVal('didMove')}
							/>
						),
					},
					{
						title: 'Tele Mode',
						content: (
							<TeleMode
								numHigh={numHighTele}
								setNumHigh={setNumHighTele}
								numLow={numLowTele}
								setNumLow={setNumLowTele}
								isColorWheel={isColorWheel}
								setIsColorWheel={setIsColorWheel}
							/>
						),
					},
					{
						title: 'End Game',
						content: (
							<EndGameMode
								expanded={expanded}
								handlePanelChange={handlePanelChange}
								didClimb={didClimb}
								setDidClimb={setDidClimb}
							/>
						),
					},
				]}
			/>

			<Fab
				color="primary"
				className={classes.saveFab}
				disabled={JSON.stringify(oldData) === JSON.stringify(data)}
				onClick={() => submitMatch()}
			>
				<SaveIcon />
			</Fab>
		</div>
	)
}
