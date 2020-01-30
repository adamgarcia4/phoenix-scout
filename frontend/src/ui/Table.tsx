import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
})

export interface HeadersInterface {
	name: string,
	key: string,
	align?: 'right',
	getValue?: Function | undefined,
}

export interface DataInterface {
	[key: string]: any,
}
interface Props {
	headers: HeadersInterface[],
	data: DataInterface[],
}

interface HeaderComponentProps {
	headers: HeadersInterface[]
}
const HeaderComponent = ({ headers }: HeaderComponentProps) => (
	<TableHead>
		<TableRow>
			{headers.map((header) => (
				<TableCell align={header.align} key={header.key}>{header.name}</TableCell>
			))}
		</TableRow>
	</TableHead>
)

interface DataComponentProps {
	data: DataInterface[],
	headers: HeadersInterface[]
}
const DataComponent = ({ data, headers }: DataComponentProps) => {
	// eslint-disable-next-line no-shadow
	const getValue = (row, key: string, getValue: Function | undefined) => {
		return (getValue && getValue(row[key])) ?? row[key]
	}
	
	return (
		<TableBody>
			{data.map((row) => (
				<TableRow key={row[headers[0].key]}>
					{headers.map((header) => (
						<TableCell
							component="th"
							align={header.align}
							key={header.key}
						>
							{getValue(row, header.key, header.getValue)}
							{/* {row[header.key]} */}
						</TableCell>
					))}
				</TableRow>
			))}
		</TableBody>
	)
}

const TableComponent = ({ headers, data }: Props) => {
	const classes = useStyles({})
	return (
		<>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<HeaderComponent headers={headers} />
					<DataComponent data={data} headers={headers} />
				</Table>
			</TableContainer>
		</>
	)
}

export default TableComponent
