import React, { useState, useContext } from 'react'
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
import Switch from '@material-ui/core/Switch'
import {
	useHistory,
} from 'react-router-dom'

// eslint-disable-next-line
import { ScoutedMatch } from '@shared/Interfaces'

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
			<Typography>
				Please record results of Auton Here!
			</Typography>
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
				label="Primary"
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

export default function AddMatch() {
	// TODO: Reducer
	const [numHighSuccessAuto, setNumHighSuccessAuto] = useState(0)
	const [numHighFailedAuto, setNumHighFailedAuto] = useState(0)
	const [numLowSuccessAuto, setNumLowSuccessAuto] = useState(0)
	const [numLowFailedAuto, setNumLowFailedAuto] = useState(0)
	const [didMove, setDidMove] = useState(false)

	const [numHighTele, setNumHighTele] = useState(0)
	const [numLowTele, setNumLowTele] = useState(0)
	const [isColorWheel, setIsColorWheel] = useState(false)
	const [didClimb, setDidClimb] = useState(false)

	const context = useContext(store)

	const history = useHistory()

	const [expanded, setExpanded] = useState<string | false>('panel1')
	const classes = useStyles({})

	const submitMatch = () => {
		console.log('submit match')
		const randomNum = Math.round(Math.random() * 1000)
		const newMatch: ScoutedMatch = {
			key: `match${randomNum}_frc4`,
			status: 'inProgress',
			match: `match${randomNum}`,
			team: 'frc4',
			time: Date.now(),
			compLevel: 'qm',
			side: 'blue',
			data: {
				auto: {
					numHighSuccess: numHighSuccessAuto,
					numHighFailed: numHighFailedAuto,
					numLowSuccess: numLowSuccessAuto,
					numLowFailed: numLowFailedAuto,
					didMove,
				},
				// tele: {
				// numHighSuccess,
				// numHighFailed,
				// numLowSuccess,
				// numLowFailed,
				// fitUnderTrench,
				// didRotateColorWheel,
				// didAttemptClimb,
				// didClimbSuccess,
				// },
			},
		}

		context.dispatch({
			type: 'addData',
			data: newMatch,
		})
		history.push('/')
	}

	const isDirty = () => !(
		numHighSuccessAuto
		|| numHighFailedAuto
		|| numLowSuccessAuto
		|| numLowFailedAuto
		|| didMove
	)

	const handlePanelChange = (panel: string) => (
		event: React.ChangeEvent<{}>,
		isExpanded: boolean,
	) => {
		setExpanded(isExpanded ? panel : false)
	}

	return (
		<div className={classes.root}>
			<Expansion
				sections={[
					{
						title: 'Auton Mode',
						content: (
							<AutonMode
								numHighSuccess={numHighSuccessAuto}
								setNumHighSuccess={setNumHighSuccessAuto}
								numHighFailed={numHighFailedAuto}
								setNumHighFailed={setNumHighFailedAuto}
								numLowSuccess={numLowSuccessAuto}
								setNumLowSuccess={setNumLowSuccessAuto}
								numLowFailed={numLowFailedAuto}
								setNumLowFailed={setNumLowFailedAuto}
								didMove={didMove}
								setDidMove={setDidMove}
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

			<Fab color="primary" className={classes.saveFab} disabled={isDirty()} onClick={() => submitMatch()}>
				<SaveIcon />
			</Fab>
		</div>
	)
}
