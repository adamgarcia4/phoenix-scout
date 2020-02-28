import React, { useReducer, useContext, useEffect } from 'react'
import {
	// Button,
	// Typography,
	Box,
	Theme,
} from '@material-ui/core'
import { PitScout } from '@shared/Interfaces'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

import {
	useHistory,
	useParams,
} from 'react-router-dom'

import { makeStyles, createStyles } from '@material-ui/core/styles'


import TextField from '@material-ui/core/TextField'
import SaveIcon from '@material-ui/icons/Save'
import Fab from '@material-ui/core/Fab'
import { store } from '../store'

import Expansion from '../ui/Expansion'
import Toggle from '../ui/Toggle'
import { paths } from '../App'

const getInitialState: (teamNum: string) => PitScout = (teamNum) => {
	return {
		key: teamNum,
		fitUnderTrench: false,
		canClimb: false,
		ballCapacity: 0,
		canShootHigh: false,
		canShootLow: false,

		canDoStage2Color: false,
		canDoStage3Color: false,

		canAutonShoot: false,
		canAutonMove: false,

		canShoot: [],
		canPickUp: [],

		wheelSize: '',

		canVisionTrack: false,
		comments: '',
	}
}

type IActions = {
	type: 'initializeData',
	data: PitScout
} | {
	type: 'updateField',
	key: string,
	value: any,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
	saveFab: {
		position: 'absolute',
		right: theme.spacing(2),
		bottom: theme.spacing(2),
	},
}))

const reducer = (prevState: PitScout, action: IActions) => {
	switch (action.type) {
	case 'initializeData':
		return action.data

	case 'updateField':
		return {
			...prevState,
			[action.key]: action.value,
		}
	default:
		return prevState
	}
}

const valToOption = (val) => ({ label: val, value: val })
export default () => {
	const styles = useStyles({})
	const history = useHistory()
	const storeData = useContext(store)
	const { teamNum } = paths.pitScout.params(useParams())

	const pitScoutData: PitScout = storeData.pitScout.state.documents[teamNum]

	const [data, dispatch] = useReducer(reducer, getInitialState(teamNum))

	useEffect(() => {
		if (pitScoutData) {
			dispatch({
				type: 'initializeData',
				data: pitScoutData,
			})
		}
	}, [pitScoutData])

	const updateField = (key) => (val) => {
		dispatch({
			type: 'updateField',
			key,
			value: val,
		})
	}

	const submit = () => {
		storeData.pitScout.dispatch({
			type: 'addData',
			data,
		})

		history.push(paths.teamsPage)
	}

	const ballSelectOptions = [0, 1, 2, 3, 4, 5].map((num) => {
		return {
			label: num,
			value: num,
		}
	})

	const defaultShootFromOptions = [
		{
			label: 'anywhere',
			value: 'anywhere',
		},
		{
			label: 'trench',
			value: 'trench',
		},
	]

	const defaultPickUpFromOptions = [
		{
			label: 'feeder station',
			value: 'feeder station',
		},
		{
			label: 'floor',
			value: 'floor',
		},
	]

	return (
		<div>
			<Expansion
				sections={[
					{
						title: 'Pit Scout',
						content: (
							<div>
								<Box>
									<Toggle
										label="Can fit under trench?"
										value={data.fitUnderTrench}
										setValue={updateField('fitUnderTrench')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can climb?"
										value={data.canClimb}
										setValue={updateField('canClimb')}
									/>
								</Box>
								<Box>
									Ball Capacity
									<Select
										options={ballSelectOptions}
										onChange={(newVal: any) => {
											updateField('ballCapacity')(newVal.value)
										}}
										value={ballSelectOptions[data.ballCapacity]}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Shoot High"
										value={data.canShootHigh}
										setValue={updateField('canShootHigh')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Shoot Low"
										value={data.canShootLow}
										setValue={updateField('canShootLow')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can do stage 2 Color?"
										value={data.canDoStage2Color}
										setValue={updateField('canDoStage2Color')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can do stage 3 Color?"
										value={data.canDoStage3Color}
										setValue={updateField('canDoStage3Color')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Shoot in Auton?"
										value={data.canAutonShoot}
										setValue={updateField('canAutonShoot')}
									/>
								</Box>
								<Box>
									<TextField
										label="Wheel Size?"
										value={data.wheelSize}
										onChange={((newVal) => {
											updateField('wheelSize')(newVal.target.value)
										})}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Move in Auton?"
										value={data.canAutonMove}
										setValue={updateField('canAutonMove')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Vision Track"
										value={data.canVisionTrack}
										setValue={updateField('canVisionTrack')}
									/>
								</Box>
								<Box>
									<CreatableSelect
										styles={{
											container: (provided, state) => ({
												...provided,
											}),
										}}
										placeholder="Shoots from..."
										options={defaultShootFromOptions}
										value={(data.canShoot || []).map(valToOption)}
										onChange={(selectedVal: any[]) => {
											if (!selectedVal) {
												updateField('canShoot')(null)
												return
											}

											const valueArr = selectedVal.map((item) => item.value)

											updateField('canShoot')(valueArr)
										}}
										isMulti
									/>
								</Box>
								<Box>
									<Select
										styles={{
											container: (provided, state) => ({
												...provided,
											}),
										}}
										placeholder="Picks up from..."
										options={defaultPickUpFromOptions}
										value={(data.canPickUp || []).map(valToOption)}
										onChange={(selectedVal: any[]) => {
											if (!selectedVal) {
												updateField('canPickUp')(null)
												return
											}

											const valueArr = selectedVal.map((item) => item.value)

											updateField('canPickUp')(valueArr)
										}}
										isMulti
									/>
								</Box>
							</div>
						),
						expanded: true,
					},
				]}
			/>
			<Fab
				color="primary"
				className={styles.saveFab}
				// disabled={JSON.stringify(oldData) === JSON.stringify(data)}
				onClick={submit}
			>
				<SaveIcon />
			</Fab>
		</div>
	)
}
