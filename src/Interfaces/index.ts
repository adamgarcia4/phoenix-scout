export type MatchInterface = {
  numHighAuto: number,
  numLowAuto: number,
  numHighTele: number,
  numLowTele: number,
  isColorWheel: boolean,
  didClimb: boolean,
}

export type TeamInterface = {
  city: string,
  country: string,
  key: string,
  name: string,
  nickname: string,
  // eslint-disable-next-line
  state_prov: string,
  // eslint-disable-next-line
  team_number: number
}
