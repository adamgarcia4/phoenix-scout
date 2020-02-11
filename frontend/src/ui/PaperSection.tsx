import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { makeStyles, createStyles } from '@material-ui/core/styles'
import cx from 'classnames'

const useStyles = makeStyles(() => createStyles({
	paperContainer: {
		padding: '10px',
		// height: '200px',
		marginBottom: '10px',
	},
	divider: {
		margin: '5px 0px 10px',
	},
}))

interface PaperSectionProps {
	header: string | React.ReactNode,
	children: string | React.ReactNode,
	className?: any,
}
export default (props: PaperSectionProps) => {
	const { header, children, className } = props
	const classes = useStyles({})

	return (
		<Paper className={cx(classes.paperContainer, className)}>
			<Typography variant="h5" align="center">
				{header}
			</Typography>
			<Divider className={classes.divider} />
			{children}
		</Paper>

	)
}
