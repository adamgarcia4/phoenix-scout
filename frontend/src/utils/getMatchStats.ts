import { ScoutedMatch } from '@shared/Interfaces'

type AccumulationStat = {
  stat?: string
  percent?: number
}

export interface StatsRes {
  autoHigh?: AccumulationStat
  autoLow?: AccumulationStat
  autoMoved?: AccumulationStat
  teleHigh?: AccumulationStat
  teleLow?: AccumulationStat
  teleTrench?: AccumulationStat
  teleStage2?: AccumulationStat
  teleStage3?: AccumulationStat
  teleAttemptClimb?: AccumulationStat
  teleClimbSuccess?: AccumulationStat
}

const getTotalPropertyCount = (
	matchesArr: ScoutedMatch[],
	getValueFunc: Function,
) => {
	return matchesArr.reduce((base, match) => {
		const val = getValueFunc(match)
		return val ? base + val : base
	}, 0)
}

const getAccumStat = (
	matchesArr: ScoutedMatch[],
	getSuccess: Function,
	getFail: Function,
): AccumulationStat => {
	const numSuccess = getTotalPropertyCount(matchesArr, getSuccess)
	const numFail = getTotalPropertyCount(matchesArr, getFail)

	return {
		percent: Math.round((100 * numSuccess) / (numSuccess + numFail)) / 100,
		stat: `(${numSuccess}/${numSuccess + numFail})`,
	}
}

const getFrequencyStat = (
	matchesArr: ScoutedMatch[],
	getValue: Function,
): AccumulationStat => {
	const numSuccess = getTotalPropertyCount(matchesArr, getValue)

	const totalMatches = matchesArr.length

	return {
		percent: Math.round((100 * numSuccess) / totalMatches) / 100,
		stat: `(${numSuccess}/${totalMatches})`,
	}
}

const getStats = (matchesArr: ScoutedMatch[] | undefined): StatsRes => {
	if (!matchesArr || matchesArr.length === 0) {
		return {}
	}

	// auto High.  Auto Low.  Did move.
	const autoHigh = getAccumStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.auto.numHighSuccess,
		(match: ScoutedMatch) => match?.data?.auto.numHighFailed,
	)

	const autoLow = getAccumStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.auto.numLowSuccess,
		(match: ScoutedMatch) => match?.data?.auto.numLowFailed,
	)

	const autoMoved = getFrequencyStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.auto.didMove,
	)

	const teleHigh = getAccumStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.tele.numHighSuccess,
		(match: ScoutedMatch) => match?.data?.tele.numHighFailed,
	)

	const teleLow = getAccumStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.tele.numLowSuccess,
		(match: ScoutedMatch) => match?.data?.tele.numLowFailed,
	)

	const teleTrench = getFrequencyStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.tele.fitUnderTrench,
	)

	const teleStage2 = getFrequencyStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.tele.stage2Color,
	)
	const teleStage3 = getFrequencyStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.tele.stage3Color,
	)

	const teleAttemptClimb = getFrequencyStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.tele.attemptedClimb,
	)
	const teleClimbSuccess = getFrequencyStat(
		matchesArr,
		(match: ScoutedMatch) => match?.data?.tele.climbSuccess,
	)

	// tele high.  Tele low.  Trench. stage2Color, stage3color, attempted climb, climbSuccess

	return {
		autoHigh,
		autoLow,
		autoMoved,

		teleHigh,
		teleLow,
		teleTrench,
		teleStage2,
		teleStage3,
		teleAttemptClimb,
		teleClimbSuccess,
	}
}

export default getStats
