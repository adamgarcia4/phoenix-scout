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
// import FormGroup from '@material-ui/core/FormGroup'
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

interface IToggleProps {
	value: boolean,
	setValue: Function,
	label: string,
}

const Toggle = ({ value, setValue, label }: IToggleProps) => {
	return (
		<FormControlLabel
			control={(
				<Switch
					checked={value}
					// TODO: Fix to type safety
					onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
						setValue(checked)
						return true
					}}
					// value="checkedB"
					color="primary"
				/>
			)}
			label={label}
		/>
	)
}

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
			<Toggle
				label="Did Robot Move?"
				value={didMove}
				setValue={setDidMove}
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
	numHighSuccess: number;
	setNumHighSuccess: Function;
	numHighFailed: number;
	setNumHighFailed: Function;
	numLowSuccess: number;
	setNumLowSuccess: Function;
	numLowFailed: number;
	setNumLowFailed: Function;

	fitUnderTrench: boolean;
	setFitUnderTrench: Function;

  stage2Color: boolean,
	setStage2Color: Function,

	stage3Color: boolean,
	setStage3Color: Function,

	attemptedClimb: boolean,
	setAttemptedClimb: Function,

	climbSuccess: boolean,
	setClimbSuccess: Function,
}

const TeleMode = ({
	numHighSuccess,
	setNumHighSuccess,
	numHighFailed,
	setNumHighFailed,
	numLowSuccess,
	setNumLowSuccess,
	numLowFailed,
	setNumLowFailed,

	fitUnderTrench,
	setFitUnderTrench,

	stage2Color,
	setStage2Color,
	stage3Color,
	setStage3Color,

	attemptedClimb,
	setAttemptedClimb,

	climbSuccess,
	setClimbSuccess,
}: TeleModeProps) => {
	return (
		<Box display="flex" flexDirection="column">
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
			<Toggle
				label="Did Fit Under Trench?"
				value={fitUnderTrench}
				setValue={setFitUnderTrench}
			/>
			<Toggle
				label="Did Stage 2 Color Wheel"
				value={stage2Color}
				setValue={setStage2Color}
			/>
			<Toggle
				label="Did Stage 3 Color Wheel"
				value={stage3Color}
				setValue={setStage3Color}
			/>
			<Toggle
				label="Attempted Climb"
				value={attemptedClimb}
				setValue={setAttemptedClimb}
			/>
			<Toggle
				label="Climb Successful"
				value={climbSuccess}
				setValue={setClimbSuccess}
			/>
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
} | {
	type: 'setTele',
	key: string,
	value: any,
}

const matchReducer = (prevState: ScoutedMatchData, action: MatchActions) => {
	switch (action.type) {
	case 'initializeData':
		return action.data
	case 'setAuto':
		return {
			...prevState,
			auto: {
				...prevState.auto,
				[action.key]: action.value,
			},
		}
	case 'setTele':
		return {
			...prevState,
			tele: {
				...prevState.tele,
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
		tele: {
			numHighSuccess: 0,
			numHighFailed: 0,
			numLowSuccess: 0,
			numLowFailed: 0,
			fitUnderTrench: false,
			stage2Color: false,
			stage3Color: false,
			attemptedClimb: false,
			climbSuccess: false,
		},
	})

	const [data, dispatch] = useReducer(matchReducer, getInitialState())

	const [oldData, setOldData] = useState(undefined)

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

	const classes = useStyles({})

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

	const updateTeleVal = (key) => (val) => {
		dispatch({
			type: 'setTele',
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
								numHighSuccess={data.tele.numHighSuccess}
								setNumHighSuccess={updateTeleVal('numHighSuccess')}
								numHighFailed={data.tele.numHighFailed}
								setNumHighFailed={updateTeleVal('numHighFailed')}
								numLowSuccess={data.tele.numLowSuccess}
								setNumLowSuccess={updateTeleVal('numLowSuccess')}
								numLowFailed={data.tele.numLowFailed}
								setNumLowFailed={updateTeleVal('numLowFailed')}

								fitUnderTrench={data.tele.fitUnderTrench}
								setFitUnderTrench={updateTeleVal('fitUnderTrench')}

								stage2Color={data.tele.stage2Color}
								setStage2Color={updateTeleVal('stage2Color')}
								stage3Color={data.tele.stage3Color}
								setStage3Color={updateTeleVal('stage3Color')}

								attemptedClimb={data.tele.attemptedClimb}
								setAttemptedClimb={updateTeleVal('attemptedClimb')}
								climbSuccess={data.tele.climbSuccess}
								setClimbSuccess={updateTeleVal('climbSuccess')}
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
