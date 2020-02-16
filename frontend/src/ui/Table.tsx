/* eslint-disable react/prop-types */
import React, { useMemo, useEffect } from 'react'
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
import TextField from '@material-ui/core/TextField'

import {
	useTable,
	// useFilters,
	// useSortBy,
	// useExpanded,
	usePagination,
	// HeaderColumn,
	useGlobalFilter,
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

interface ITableOptions {
	globalFilter: (origRows: any[], headerKeys: string[], query: string) => any[]
}

interface TableProps {
	headers: HeadersInterface[],
	data?: DataInterface[] | undefined,
	options?: ITableOptions
}

interface HeaderComponentProps {
	headers: any[]
	// headers: HeadersInterface[]
}

const HeaderComponent = ({ headers }) => {
	// console.log('headers:', headers)
	return (
		<TableHead>
			<TableRow>
				{headers[0].headers.map((column) => {
					return (
						<TableCell
							key={column.id}
						>
							<div style={{
								// display: 'flex',
								// flexDirection: 'column',
							}}
							>
								<div>{column.render('Header')}</div>
								{/* <TextField id="standard-search" type="search" /> */}
							</div>
						</TableCell>
					)
				})}
			</TableRow>
		</TableHead>
	)
}

const DataComponent = ({ rows, prepareRow }) => {
	console.log('rows:', rows)

	return (
		<TableBody>
			{rows.map(
				(row) => {
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

const TableComponent = ({ headers, data, options }: TableProps) => {
	const classes = useStyles({})

	const dataMemo = useMemo(() => {
		return data
	}, [data])

	const columns = useMemo(() => {
		const cols = headers.map((header) => {
			return {
				Header: header.name,
				accessor: header.getValue ?? header.key,
			}
		})

		return cols
	}, [headers])

	const globalFilterFunction = options?.globalFilter ? options.globalFilter : () => true

	const {
		/**
		 * Base Table Render Methods
		 */

		headerGroups,
		rows,
		prepareRow,

		/**
		 * Pagination Table Render Methods
		 */

		// This is an array of only the rows on this page
		page,
		// Updates the number of rows on a page
		setPageSize,
		// Go to particular page number
		gotoPage,
		state: {
			pageSize,
			pageIndex,
			globalFilter,
		},
		setGlobalFilter,
	} = useTable({
		columns,
		data: dataMemo,
		initialState: {
			// globalFilter: '',
		},
		globalFilter: globalFilterFunction,
	},
	useGlobalFilter,
	usePagination)

	useEffect(() => {
		if (page.length === 0 && pageIndex !== 0) {
			gotoPage(0)
		}
	}, [page, pageIndex])

	return (
		<>
			<Paper style={{ padding: '10px' }}>
				<TextField
					label="Search"
					helperText="Search by team. Eg: frc4"
					variant="outlined"
					onChange={(event) => {
						if (!event.target.value) {
							setGlobalFilter(undefined)
						} else {
							setGlobalFilter(event.target.value)
						}
					}}
					value={globalFilter || ''}
				/>
				<TableContainer>
					<Table className={classes.table} aria-label="simple table">
						<HeaderComponent headers={headerGroups} />
						<DataComponent rows={page} prepareRow={prepareRow} />
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 15]}
					component="div"
					count={rows.length}
					rowsPerPage={pageSize}
					page={pageIndex}
					onChangePage={(event, newPage) => {
						gotoPage(newPage)
					}}
					onChangeRowsPerPage={(event) => {
						setPageSize(parseInt(event.target.value, 10))
						gotoPage(0)
					}}
				/>
			</Paper>
		</>
	)
}

export default TableComponent
