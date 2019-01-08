//import SVG from 'svg.js';
import { getTestSVGcontent, getSVGinstance } from "./instance";
import { getGroups } from "../src/groups";

//read test .svg file
const rawSVG = getTestSVGcontent("./assets/test.svg");
const nodeSVG = getSVGinstance(rawSVG);
let groups = getGroups(nodeSVG);
console.log(groups);