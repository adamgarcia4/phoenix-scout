import React, { useState } from 'react'
import { Button, Typography, Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Theme, Box } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import firebase from 'firebase'
import styled from 'styled-components'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SaveIcon from '@material-ui/icons/Save'
import Fab from '@material-ui/core/Fab'

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


export default function AddMatch() {
  const [numHigh, setNumHigh] = useState(0)
  const [numLow, setNumLow] = useState(0)
  const [count, setCount] = useState(0)
  const [expanded, setExpanded] = useState<string | false>('panel1')
  const classes = useStyles()

  firebase.firestore().collection('matches').onSnapshot((docs) => {
    docs.docs.map((doc) => {
      console.log('doc:', doc.data())
    })
  })

  const submitMatch = () => {
    firebase.firestore().collection('matches').add({
      numHigh: count,
      numLow: count,
    })

    setCount(count + 1)
  }

  const isDirty = () => !(numHigh || numLow)

  const incrementFunction = (hookFunc: React.Dispatch<React.SetStateAction<number>>, newNum: number) => {
    if (newNum > -1) {
      hookFunc(newNum)
    }
  }

  const highBallSection = () => (
    <>
      <Typography variant="h6">
          Number High Balls
      </Typography>
      <NumberButton>
        {numHigh}
      </NumberButton>
      <Button variant="contained" color="primary" size="small" onClick={() => incrementFunction(setNumHigh, numHigh + 1)}>+</Button>
      <Button variant="contained" color="secondary" size="small" onClick={() => incrementFunction(setNumHigh, numHigh - 1)}>-</Button>
    </>
  )

  const lowBallSection = () => (
    <>
      <Typography variant="h6">
          Number Low Balls
      </Typography>
      <NumberButton>
        {numLow}
      </NumberButton>
      <Button variant="contained" color="primary" size="small" onClick={() => incrementFunction(setNumLow, numLow + 1)}>+</Button>
      <Button variant="contained" color="secondary" size="small" onClick={() => incrementFunction(setNumLow, numLow - 1)}>- </Button>
    </>
  )

  const handlePanelChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  
  return (
    <div className={classes.root}>
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
              {highBallSection()}
            </Box>
            <Box>
              {lowBallSection()}
            </Box>
          </Box>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === 'panel2'}
        onChange={handlePanelChange('panel2')}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Teleop Mode</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Box display="flex" flexDirection="column">
            <Typography>
              Please record results of Teleop Here!
            </Typography>
            <Box>
              {highBallSection()}
            </Box>
            <Box>
              {lowBallSection()}
            </Box>
          </Box>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <Fab color="primary" className={classes.saveFab} disabled={isDirty()}>
        <SaveIcon />
      </Fab>
    </div>
  )

  // return (
  //   <>
  //     <Paper elevation={3} className={classes.section}>
  //       <Typography align="center">
  //         Autonomous Mode
  //       </Typography>
  //       {highBallSection()}
  //       {lowBallSection()}
  //     </Paper>
  //     <Button variant="contained" className={classes.submitButton} onClick={() => submitMatch()}>Submit</Button>
  //   </>
  // )
}
