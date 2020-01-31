import { IResolvers } from "apollo-server";
import { ScoutedMatch } from "@shared/Interfaces"

const resolverMap: IResolvers = {
	Query: {
		testMessage: (): string => 'Hello World!',
		scoutedMatches: (): ScoutedMatch[]=> {
			return [
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
		}
	}
}

export default resolverMap