import { ScoutedMatch } from '@shared/Interfaces';

const data: ScoutedMatch[] = [
	{
		key: 'match1',
		status: 'toBeAssigned',
		compLevel: 'qm',
		match: 'match1',
		side: 'blue',
		team: 'frc4',
		time: new Date().valueOf(),
		assignedTo: {
			name: 'Adam Garcia'
		}
	},
	{
		key: 'match2',
		status: 'toBeAssigned',
		compLevel: 'qm',
		match: 'match2',
		side: 'red',
		team: 'frc254',
		time: new Date().valueOf(),
		assignedTo: {
			name: 'Daniel'
		}
	},
]

const get = (filterFunction?: (x: ScoutedMatch) => boolean) => {
	
	return filterFunction ? data.filter(filterFunction): data
}

const set = (scoutedMatches: ScoutedMatch[]) => {
	for (const match of scoutedMatches) {
		data.push(match)
	}
}
export default {
	get,
	set,
}