const moment = require('moment');
const { stats, monthStats, globalStats, globalMonthStats } = require('../api');

const getDay = (date) => moment(date).isoWeekday();

const weekResume = (myStats) => (
  myStats.reduce(
    (res, stat) => ({
      ...res,
      [getDay(stat.date)]: stat.value,
    }),
    {},
  ))

const weekSum = (myStats) => (
  myStats.reduce(
    (res, stat) => res + stat.value,
    0,
  ))

const weekStats = (allStats) => {
  return allStats.length !== 0 ? {
    today: allStats[0].value,
    total: weekSum(allStats),
    ...weekResume(allStats),
  } : {};
};

exports.globalStats = () => {
  const monthStat = globalMonthStats[0];
  return {
    ...weekStats(globalStats),
    monthStats: monthStat ? monthStat.value : 0,
  }
};
