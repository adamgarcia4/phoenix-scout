export type User = {
  name: string,
}

export type ScoutedMatch = {
  /**
   * Mongo ID
   */
  _id?: string,
  /**
   * Defined as `<MATCHAPI.key>_frc<TbaTeamKey>`
   */
  key: string,
  /**
   * Shows what state the scouted match is in.
   */
  status: 'toBeAssigned' | 'assigned' | 'notScouted' | 'inProgress' | 'scouted',
  /**
   * Match Key identifier.
   */
  match: string,
  /**
   * Team Key identifier
   */
  team: string,
  /**
   * Start time of match, as set by the FIRST schedule.
   */
  time: number,
  /**
   * The competition level the match was played at.
   */
  compLevel: 'qm' | 'ef' | 'qf' | 'sf' | 'f',
  /**
   * Alliance Side
   */
  side: 'red' | 'blue',
  /**
   * This is the actual scouted data
   */
  data?: {
    auto: {
      numHighSuccess: number,
      numHighFailed: number,
      numLowSuccess: number,
      numLowFailed: number,
      didMove: boolean,
    },
    // tele: {
    //   numHighSuccess: number,
    //   numHighFailed: number,
    //   numLowSuccess: number,
    //   numLowFailed: number,
    //   fitUnderTrench: boolean,
    //   didRotateColorWheel: boolean,
    //   didAttemptClimb: boolean,
    //   didClimbSuccess: boolean,
    // }
  },
  fromAPI?: boolean,
  /**
   * The profile of the scout assigned
   */
  assignedTo?: User
}

/* eslint-disable camelcase */

// export type MatchInterface = {
//   numHighAuto: number,
//   numLowAuto: number,
//   numHighTele: number,
//   numLowTele: number,
//   isColorWheel: boolean,
//   didClimb: boolean,
// }

export type TeamInterface = {
  city: string,
  country: string,
  key: string,
  name: string,
  nickname: string,
  state_prov: string,
  team_number: number
}

type MatchAlliance = {
  /**
   * Score for this alliance.  Will be null or -1 for an unplayed match
   */
  score: number,
  /**
   * TBA Team keys (eg: frc254) for teams on this alliance
   */
  team_keys: string[],
  /**
   * TBA team keys (eg frc254) of any teams playing as a surrogate.
   */
  surrogate_team_keys?: string[],
  /**
   * TBA team keys (eg frc254) of any disqualified teams.
   */
  dq_team_keys?: string[]
}

/**
 * Response from `/event/{event_key}/matches`
 */
export type MatchAPIResponse = {
  /**
   * TBA match key with the format yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER],
   *  where yyyy is the year, and EVENT_CODE is the event code of the event,
   * COMP_LEVEL is (qm, ef, qf, sf, f), and MATCH_NUMBER is the match number in
   * the competition level. A set number may be appended to the competition
   * level if more than one match in required per set.
   */
  key: string,
  /**
   * The competition level the match was played at.
   */
  comp_level: 'qm' | 'ef' | 'qf' | 'sf' | 'f',
  /**
   * The set number in a series of matches where more than one match is required
   * in the match series.
   */
  set_number: number,
  /**
   * The match number of the match in the competition level.
   */
  match_number: number,
  /**
   * A list of alliances, the teams on the alliances, and their score.
   */
  alliances?: {
    red: MatchAlliance,
    blue: MatchAlliance,
  },
  /**
   * The color (red/blue) of the winning alliance. Will contain an empty string
   * in the event of no winner, or a tie.
   */
  winning_alliance?: string,
  /**
   * Event key of the event the match was played at.
   */
  event_key: string,
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the scheduled match
   * time, as taken from the published schedule.
   */
  time?: number,
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of actual match start
   * time.
   */
  actual_time?: number,
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the TBA predicted
   * match start time.
   */
  predicted_time?: number,
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) when the match result
   * was posted.
   */
  post_result_time?: number,
  /**
   * Score breakdown for auto, teleop, etc. points. Varies from year to year.
   * May be null.
   */
  score_breakdown?: any,
  /**
   * Array of video objects associated with this match.
   */
  videos?: {
    /**
     * Can be one of 'youtube' or 'tba'
     */
    type: string,
    /**
     * Unique key representing this video
     */
    key: string,
  }[],
}

export type MatchInterface = {
  name: string,
  teams: number[],
}