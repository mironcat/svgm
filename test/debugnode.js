//import SVG from 'svg.js';
const SVGJS = require("svg.js");
import { getTestSVGcontent, getSVGinstance } from "./instance";
import { getGroups } from "../src/groups";
import { getGroupItems } from "../src/items";
import { getResults } from "../src/prepres";
//read test .svg file
const rawSVG = getTestSVGcontent("./assets/test.svg");
const SVG = getSVGinstance(rawSVG, SVGJS);
let groups = getGroups(SVG);
//extract and measure elements
let gi = getGroupItems(groups); //array
//console.log("from index:", gi);
const res = getResults(gi, "test");

if (Array.isArray(res)) console.log("1. OK. res is Array"); else console.log("error");

