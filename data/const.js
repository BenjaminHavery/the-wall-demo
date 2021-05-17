
const brick = {
  no: { x: 501, y: 20 },
  dm: { x: 1, y: 0.25, z: 0.5 },
  sp: { x: 0.025 },
}

const message = {
  dm: { x: 3*brick.dm.x },
  htdm: { x: 100, font: 20 }
}

const colors = [
  '#e8bd42',
  '#40b3ed',
  '#40ed88',
  '#ff91eb',
  '#f5f5f5',
  '#546bff',
  '#383838',
];

export { brick, message, colors }
