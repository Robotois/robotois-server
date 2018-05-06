exports.groups = [
  { id: 1, title: 'Habitacion', active: 0 },
  { id: 2, title: 'Cocina', active: 1 },
  { id: 3, title: 'Comedor', active: 1 },
  { id: 4, title: 'Estudio', active: 0 },
];

exports.stats = [
  {
    id: 1,
    type: 'group',
    groupId: 1,
    date: '2018-04-30',
    value: 15
  },
  {
    id: 2,
    type: 'group',
    groupId: 1,
    date: '2018-05-01',
    value: 18
  },
  {
    id: 3,
    type: 'group',
    groupId: 2,
    date: '2018-04-30',
    value: 25
  },
  {
    id: 4,
    type: 'group',
    groupId: 2,
    date: '2018-05-01',
    value: 21
  },
];

exports.monthStats = [
  {
    id: 1,
    type: 'group',
    groupId: 1,
    value: 334,
    month: 4
  },
  {
    id: 2,
    type: 'group',
    groupId: 2,
    value: 288,
    month: 4
  },
];

exports.globalStats = [
  {
    id: 5,
    date: '2018-04-30',
    value: 55
  },
  {
    id: 6,
    date: '2018-05-01',
    value: 45
  },
  {
    id: 7,
    date: '2018-05-02',
    value: 40
  },
  {
    id: 8,
    date: '2018-05-03',
    value: 35
  },
];

exports.globalMonthStats = [
  {
    id: 1,
    value: 520,
    month: 4
  },
]

exports.devices = [
  { id: 1, iguId: 'igu-1', groupId: 2, title: 'Luz Principal', icon: 'ceilingLamp', active: 0,  },
  { id: 2, iguId: 'igu-2', groupId: 2, title: 'Lavandora', icon: 'washingMachine', active: 1},
  { id: 3, iguId: 'igu-3', groupId: 2, title: 'Horno', icon: 'stove', active: 1 },
  { id: 4, iguId: 'igu-4', groupId: 2 , title: 'Aire Acondicionado', icon: 'airConditioner', active: 0 },
  { id: 5, iguId: 'igu-5', groupId: 2, title: 'Ventilador', icon: 'fan', active: 0 },
  { id: 6, iguId: 'igu-6', groupId: 2, title: 'Termostato', icon: 'thermometer', active: 1 },
  { id: 7, iguId: 'igu-7', groupId: 1, title: 'Luz Principal', icon: 'lamp', active: 0 },
  { id: 8, iguId: 'igu-8', groupId: 1, title: 'Computadora', icon: 'desktopPC', active: 1 },
  { id: 9, iguId: 'igu-9', groupId: 1, title: 'Impresora', icon: 'printer', active: 1 },
  { id: 10, iguId: 'igu-10', groupId: 1, title: 'Socket', icon: 'socket', active: 0 },
  { id: 11, iguId: 'igu-11', groupId: 1, title: 'Bocinas', icon: 'speaker', active: 0 },
  { id: 12, iguId: 'igu-12', groupId: 1, title: 'Termostato', icon: 'thermometer', active: 1 },
];
