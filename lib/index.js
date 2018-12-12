/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';
import { svgdom } from './canvas';
import { getGroups } from './groups';
import { getGroupItems } from './items';
import { getResults } from "./prepres";
let SVG = svgdom['node']; //mode of svg dom: node or html
function svgm (rawSvg, filename) {
    SVG = SVG(rawSvg);
    //groups with scalebars
    let groups = getGroups(SVG); 
    //extract and measure elements
    let gi = getGroupItems(groups, SVG); //array
    console.log('from index:', gi);
    return getResults(gi);
    /*
    // testingg
     let rect = SVG.select('rect').members[0];
    console.log('from index:',rect.width()); 
    */    
};

let results = svgm('', 'testfile.svg');
console.log(results);
