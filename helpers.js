
const Pi = Math.PI;
const round = (x) => Math.round(x * 100) / 100;
const dim = 100;

const width = d3.select('svg').attr('width');
const height = d3.select('svg').attr('height');

const xScale = d3.scaleLinear()
                  .domain([0, 100])
                  .range([0, width]);

const yScale = d3.scaleLinear()
                  .domain([0, 100])
                  .range([height, 0]);

const rScale = xScale;

function dist(obj1, obj2) {
  return round(Math.sqrt(
    (obj1.x - obj2.x) * (obj1.x - obj2.x)
    + (obj1.y - obj2.y) * (obj1.y - obj2.y)
  ));
}
function sin(x) { return Math.sin(x); }
function cos(x) { return Math.cos(x); }
function atan(x) { return Math.atan(x); }
