import { IResolvers, IResolverObject } from "apollo-server";
import { ScoutedMatch } from "@shared/Interfaces"
import { ScoutedMatchModel } from './models'
import tbaAxios from './config/tbaAxios'
import { AxiosResponse } from 'axios'
import { MatchAPIResponse } from '@shared/Interfaces'
interface ScoutedMatchArgs {
	filter?: {
		team?: string,
	}
}

interface SeedMatchArgs {
	eventCode: String
}

const resolverMap: IResolvers = {
	Query: {
		testMessage: (): string => 'Hello World!',
		scoutedMatches: (parent, args: ScoutedMatchArgs, context, info): ScoutedMatch[]=> {
			const { team = '' } = args?.filter ?? {}
			
			if (Object.keys(args).length === 0) {
				return ScoutedMatchModel.get()
			}

			return ScoutedMatchModel.get((match => {
				if (team && match.team === team) {
					return true
				}

				return false
			}))
		}
	},
	Mutation: {
		seedMatches: async(parent, args: SeedMatchArgs, context, info): Promise<ScoutedMatch[]> => {
			const res = await tbaAxios.get<MatchAPIResponse[]>(`event/${args.eventCode}/matches`)
			
			const allScoutedMatches: ScoutedMatch[] = []

			const addMatch = (match: MatchAPIResponse, teamKey: string, side: String) => {
				allScoutedMatches.push({
					key: `${match.key}_${teamKey}`,
					compLevel: match.comp_level,
					match: match.key,
					side: 'red',
					status: "toBeAssigned",
					team: teamKey,
					time: match.predicted_time || 0,
				})
			}
			for (const match of res.data) {
				for (const teamKey of match.alliances?.red.team_keys || []) {
					addMatch(match, teamKey, 'red')
				}

				for (const teamKey of match.alliances?.blue.team_keys || []) {
					addMatch(match, teamKey, 'blue')
				}
			}

			return allScoutedMatches
		}
	}
}

export default resolverMap