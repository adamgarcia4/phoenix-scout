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
import Expansion from '../ui/Expansion'
import { ScoutedMatch } from 'src/Interfaces'
import { store } from '../config/store'

const NumberButton = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: 50px;
  height: 36px;
  /* background-color: red; */
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
  numHigh: number,
  setNumHigh: Function,
  numLow: number,
  setNumLow: Function,
}

const AutonMode = ({
	numHigh,
	setNumHigh,
	numLow,
	setNumLow,
}: AutonModeProps) => {
	return (
		<Box display="flex" flexDirection="column">
			<Typography>
				Please record results of Auton Here!
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
	const [numHighAuto, setNumHighAuto] = useState(0)
	const [numLowAuto, setNumLowAuto] = useState(0)
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
			side: 'red',
			data: {
				numHighAuto,
				numLowAuto,
				numHighTele,
				numLowTele,
				isColorWheel,
				didClimb
			}
		}

		context.dispatch({
			type: 'addData',
			data: newMatch,
		})
		// history.push('/')
	}

	const isDirty = () => !(
		numHighAuto
    || numLowAuto
    || numHighTele
    || numLowTele
    || isColorWheel
    || didClimb
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
								numHigh={numHighAuto}
								setNumHigh={setNumHighAuto}
								numLow={numLowAuto}
								setNumLow={setNumLowAuto}
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
