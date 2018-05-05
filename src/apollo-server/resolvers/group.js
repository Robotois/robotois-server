const moment = require('moment');
const { groups, devices, stats, monthStats } = require('../api');

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
    {}));

const weekSum = (myStats) => (
  myStats.reduce(
    (res, stat) => res + stat.value,
    0));

const groupWeekStats = (group) => {
  const allStats = stats.filter(st => st.type === 'group' && st.groupId === group.id);
  return allStats.length !== 0 ? {
    today: allStats[0].value,
    total: weekSum(allStats),
    ...weekResume(allStats),
  } : {};
};
exports.groupWeekStats = groupWeekStats;

const groupMonthStats = (group) => {
  const stats = monthStats.find(st => st.type === 'group' && st.groupId === group.id);
  return stats ? stats.value : 0;
};
exports.groupMonthStats = groupMonthStats;

exports.groupStats = (group) => {
  // const stats = monthStats.find(st => st.type === 'group' && st.groupId === group.id);
  const month = groupMonthStats(group);
  const week = groupWeekStats(group);

  return week.total !== undefined ? {
    ...week,
    month
  } : {};
};

exports.groupDevices = (group) => devices.filter(dev => dev.groupId === group.id) || [];

exports.groups = () => groups;

exports.group = (_, { id }) => groups.find(g => g.id === id);
