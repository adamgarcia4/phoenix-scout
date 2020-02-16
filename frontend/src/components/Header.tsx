import React, { useContext } from 'react'
import clsx from 'clsx'
import {
	makeStyles, useTheme, createStyles, Theme,
} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import HomeIcon from '@material-ui/icons/Home'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import RedditIcon from '@material-ui/icons/Reddit'

import Select from 'react-select'

import {
	useHistory,
	useLocation,
} from 'react-router-dom'

import { store } from '../store'
import DataSync from './DataSync'

import { paths } from '../App'


const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => createStyles({
	root: {
		display: 'flex',
	},
	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	title: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
		width: '100%',
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
}))

function PersistentDrawerLeft({ children }: {children: any}) {
	const classes = useStyles({})
	const theme = useTheme()

	const history = useHistory()
	const location = useLocation()
	const value = useContext(store)

	const [open, setOpen] = React.useState(false)

	const handleDrawerOpen = () => {
		setOpen(true)
	}

	const handleDrawerClose = () => {
		setOpen(false)
	}

	const navigateToPath = (path: string) => {
		history.push(path)
		handleDrawerClose()
	}

	const isPath = (path: string) => path === location.pathname

	const teamsSelectOptions = Object.values(value.teams.state.documents)
		.map((team) => {
			return {
				value: team.key,
				label: `Team ${team.team_number}: ${team.nickname}`,
				teamNumber: team.team_number,
			}
		})
		.sort((a, b) => {
			return a.teamNumber - b.teamNumber
		})

	return (
		<div className={classes.root}>
			<CssBaseline />

			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, open && classes.hide)}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap className={classes.title}>
            Phoenix Scout
					</Typography>
					<Select
						styles={{
							container: (provided, state) => ({
								...provided,
								marginRight: '20px',
								width: '300px',
								color: 'black',
							}),
						}}
						isClearable
						options={teamsSelectOptions}
						onChange={(res: any) => {
							if (res) {
								history.push(paths.teamDetailsPage.get(res.value))
							}
						}}
					/>
					<DataSync />
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem
						selected={isPath(paths.homePage)}
						button
						onClick={
							() => navigateToPath(paths.homePage)
						}
					>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItem>
					{/* <ListItem selected={isPath(paths.schedulePage)}
					button onClick={() => navigateToPath(paths.schedulePage)}>
						<ListItemIcon>
							<ListAltIcon />
						</ListItemIcon>
						<ListItemText primary="See Schedule" />
					</ListItem> */}
					<ListItem
						selected={isPath(paths.teamsPage)}
						button
						onClick={() => navigateToPath(paths.teamsPage)}
					>
						<ListItemIcon>
							<RedditIcon />
						</ListItemIcon>
						<ListItemText primary="See Teams" />
					</ListItem>
					<ListItem
						selected={isPath(paths.addMatchPage.route)}
						button
						onClick={() => navigateToPath(paths.addMatchPage.route)}
					>
						<ListItemIcon>
							<NoteAddIcon />
						</ListItemIcon>
						<ListItemText primary="Add Match" />
					</ListItem>
					<Divider />
					<ListItem
						selected={isPath(paths.adminPage)}
						button
						onClick={() => navigateToPath(paths.adminPage)}
					>
						<ListItemIcon>
							<SupervisorAccountIcon />
						</ListItemIcon>
						<ListItemText primary="Admin Utils" />
					</ListItem>
				</List>
				<Divider />
			</Drawer>
			<main
				className={clsx(classes.content, {
					[classes.contentShift]: open,
				})}
			>
				<div className={classes.drawerHeader} />
				{children}
			</main>
		</div>
	)
}

PersistentDrawerLeft.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
}

export default PersistentDrawerLeft
