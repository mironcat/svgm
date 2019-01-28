//import SVG from 'svg.js';
const SVGJS = require("svg.js");
import { getTestSVGcontent, getSVGinstance } from "./instance";
import { getGroups } from "../src/groups";
import { getGroupItems } from "../src/items";
import { getResults } from "../src/prepres";
//read test .svg file


function testSVGprepare(rawSVG, filename) {
    const SVG = getSVGinstance(rawSVG, SVGJS);
    let groups = getGroups(SVG);
    //extract and measure elements
    let gi = getGroupItems(groups); //array
//console.log("from index:", gi);
    return getResults(gi, filename);
}

const filename = "./assets/test3.svg";
const rawSVG = getTestSVGcontent(filename);

const res = testSVGprepare(rawSVG, filename);
if (Array.isArray(res)) console.log("1. OK. res is Array"); else console.log("error");

