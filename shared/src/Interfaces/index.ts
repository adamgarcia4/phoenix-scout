export type User = {
  name: string,
}

export type ScoutedMatch = {
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
    numHighAuto: number,
    numLowAuto: number,
    numHighTele: number,
    numLowTele: number,
    isColorWheel: boolean,
    didClimb: boolean,
  },
  assignedTo: User
}