import React, { useMemo } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TablePagination from '@material-ui/core/TablePagination'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import {
	useTable,
	useGroupBy,
	useFilters,
	useSortBy,
	useExpanded,
	usePagination,
	HeaderColumn,
} from 'react-table'

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
	render?: Function,
	sort?: boolean,
}

export interface DataInterface {
	[key: string]: any,
}
interface TableProps {
	headers: HeadersInterface[],
	data?: DataInterface[] | undefined,
}

interface HeaderComponentProps {
	headers: any[]
	// headers: HeadersInterface[]
}

interface ILabelProps {
	header: HeadersInterface
}

// TODO: Type this out later
const HeaderComponent = ({ headers }) => {
	console.log('headers:', headers)

	const Label = (props: ILabelProps) => {
		const { header } = props
		if (header.sort === undefined || header.sort) {
			return (
				<TableSortLabel
					onClick={(test) => {
						console.log('hii')
					}}
				>
					{header.name}
					{/* {orderBy === headCell.id ? (
											<span className={classes.visuallyHidden}>
												{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
											</span>
										) : null} */}
				</TableSortLabel>
			)
		}

		return (
			<>
				{header.name}
			</>
		)
	}
	return (
		<TableHead>
			<TableRow>
				{headers[0].headers.map((column) => (
					<TableCell>
						{column.render('Header')}
						{/* <Label header={} /> */}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

const DataComponent = ({ rows, prepareRow }) => {
	return (
		<TableBody>
			{rows.map(
				(row, i) => {
					prepareRow(row)
					return (
						<TableRow {...row.getRowProps()}>
							{row.cells.map((cell) => {
								return (
									<TableCell
										component="th"
										{...cell.getCellProps()}
									>
										{cell.render('Cell')}
									</TableCell>
								)
							})}
						</TableRow>
					)
				},
			)}
		</TableBody>
	)
}

const TableComponent = ({ headers, data }: TableProps) => {
	const classes = useStyles({})

	const columns = useMemo(() => {
		const cols = headers.map((header) => {
			return {
				Header: header.name,
				accessor: header.getValue ?? header.key,
			}
		})

		return cols
	}, [headers])

	const {
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data,
	})

	console.log('headerGroups:', headerGroups)
	console.log('rows:', rows)

	return (
		<>
			<Paper>
				<TableContainer>
					<Table className={classes.table} aria-label="simple table">
						<HeaderComponent headers={headerGroups} />
						<DataComponent rows={rows} prepareRow={prepareRow} />
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 11, 15]}
					component="div"
					count={1}
					rowsPerPage={20}
					page={1}
					onChangePage={(event, page) => {

					}}
					onChangeRowsPerPage={() => {}}
				/>
			</Paper>
		</>
	)
}

export default TableComponent
