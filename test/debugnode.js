//import SVG from 'svg.js';
const SVG = require('svg.js');
import { getGroups } from "../src/groups";

function getSVGinstance(rawSVG) {
  const window = require("svgdom");
  const nodeSVG = SVG(window);
  const document = window.document;
  // create svg.js instance
  const draw = nodeSVG(document.documentElement);
  draw.svg(rawSVG);
  return nodeSVG;
}
function getTestSVGcontent(filepath) {
  //read test .svg file
  return require("fs").readFileSync(filepath, "utf8");
}

//read test .svg file
const rawSVG = getTestSVGcontent("./assets/test.svg");
const nodeSVG = getSVGinstance(rawSVG);
let groups = getGroups(nodeSVG);
console.log(groups);