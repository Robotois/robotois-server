const moment = require('moment');
const { stats, monthStats, globalStats, globalMonthStats } = require('../api');

const weekDays = {
  1: 'lun',
  2: 'mar',
  3: 'mie',
  4: 'jue',
  5: 'vie',
  6: 'sab',
  7: 'dom',
};

const getDay = (date) => weekDays[moment(date).isoWeekday()];

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
    month: monthStat ? monthStat.value : 0,
  }
};
