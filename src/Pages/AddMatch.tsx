import React, { useState } from 'react'
import {
  Button,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Box,
  Theme,
} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import styled from 'styled-components'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SaveIcon from '@material-ui/icons/Save'
import Fab from '@material-ui/core/Fab'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import {
  useHistory,
} from 'react-router-dom'

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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  section: {
    margin: 'auto',
    width: '80%',
    padding: '20px',
  },
  submitButton: {
    marginTop: '30px',
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
  expanded: any,
  handlePanelChange: any,
  numHigh: number,
  setNumHigh: Function,
  numLow: number,
  setNumLow: Function,
}

const AutonMode = ({
  expanded,
  handlePanelChange,
  numHigh,
  setNumHigh,
  numLow,
  setNumLow,
}: AutonModeProps) => {
  const classes = useStyles()
  return (
    <ExpansionPanel
      expanded={expanded === 'panel1'}
      onChange={handlePanelChange('panel1')}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Auton Mode</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
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
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

interface TeleModeProps {
  expanded: any,
  handlePanelChange: any,
  numHigh: number,
  setNumHigh: Function,
  numLow: number,
  setNumLow: Function,
  isColorWheel: boolean,
  setIsColorWheel: Function,
}

const TeleMode = ({
  expanded,
  handlePanelChange,
  numHigh,
  setNumHigh,
  numLow,
  setNumLow,
  isColorWheel,
  setIsColorWheel,
}: TeleModeProps) => {
  const classes = useStyles()
  return (
    <ExpansionPanel
      expanded={expanded === 'panel2'}
      onChange={handlePanelChange('panel2')}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Tele Mode</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
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
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

interface EndGameModeProps {
  expanded: any,
  handlePanelChange: any,
  didClimb: boolean,
  setDidClimb: Function,
}

const EndGameMode = ({
  expanded,
  handlePanelChange,
  didClimb,
  setDidClimb,
}: EndGameModeProps) => {
  const classes = useStyles()
  return (
    <ExpansionPanel
      expanded={expanded === 'panel3'}
      onChange={handlePanelChange('panel3')}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>End Game</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
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
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default function AddMatch() {
  const [numHighAuto, setNumHighAuto] = useState(0)
  const [numLowAuto, setNumLowAuto] = useState(0)
  const [numHighTele, setNumHighTele] = useState(0)
  const [numLowTele, setNumLowTele] = useState(0)
  const [isColorWheel, setIsColorWheel] = useState(false)
  const [didClimb, setDidClimb] = useState(false)

  const history = useHistory()

  const [expanded, setExpanded] = useState<string | false>('panel1')
  const classes = useStyles()

  const submitMatch = () => {
    firebase.firestore().collection('matches').add({
      numHighAuto,
      numLowAuto,
      numHighTele,
      numLowTele,
      isColorWheel,
      didClimb,
    })

    history.push('/')
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
      <AutonMode
        expanded={expanded}
        handlePanelChange={handlePanelChange}
        numHigh={numHighAuto}
        setNumHigh={setNumHighAuto}
        numLow={numLowAuto}
        setNumLow={setNumLowAuto}
      />
      <TeleMode
        expanded={expanded}
        handlePanelChange={handlePanelChange}
        numHigh={numHighTele}
        setNumHigh={setNumHighTele}
        numLow={numLowTele}
        setNumLow={setNumLowTele}
        isColorWheel={isColorWheel}
        setIsColorWheel={setIsColorWheel}
      />
      <EndGameMode
        expanded={expanded}
        handlePanelChange={handlePanelChange}
        didClimb={didClimb}
        setDidClimb={setDidClimb}
      />
      <Fab color="primary" className={classes.saveFab} disabled={isDirty()} onClick={() => submitMatch()}>
        <SaveIcon />
      </Fab>
    </div>
  )
}
