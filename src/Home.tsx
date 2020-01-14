import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core'

import firebase from 'firebase/app'
import 'firebase/firestore'

import { MatchInterface } from './Interfaces'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

function MatchTable({ data }: {data: MatchInterface[]}) {
  const classes = useStyles()
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell># High Auto</TableCell>
            <TableCell># Low Auto</TableCell>
            <TableCell># High Teleop</TableCell>
            <TableCell># Low Teleop</TableCell>
            <TableCell>Did Engage Colorwheel</TableCell>
            <TableCell>Did Climb</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.numHighAuto}
              </TableCell>
              <TableCell>
                {row.numLowAuto}
              </TableCell>
              <TableCell>
                {row.numHighTele}
              </TableCell>
              <TableCell>
                {row.numLowTele}
              </TableCell>
              <TableCell>
                {row.isColorWheel ? 'Yes' : 'No'}
              </TableCell>
              <TableCell>
                {row.didClimb ? 'Yes' : 'No'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Home: React.FC = () => {
  const [matchesArr, setMatchesArr] = useState<MatchInterface[]>([])

  useEffect(() => {
    firebase.firestore().collection('matches').onSnapshot((docs) => {
      const newMatches: MatchInterface[] = docs.docs.map((doc) => {
        const newMatch: any = doc.data()

        return newMatch
      })

      setMatchesArr([...matchesArr, ...newMatches])
    })
  }, [])


  return (
    <div>
      <h1>Welcome to Phoenix Scout Home!</h1>
      <Typography variant="h4">
        Current Matches
      </Typography>
      <MatchTable data={matchesArr} />
    </div>
  )
}

export default Home
