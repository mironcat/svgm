/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';
import { svgdom } from './canvas';
function svgm (rawSvg, filename) {
    let SVG = svgdom['node'](rawSvg);
    let rect = SVG.select('rect').members[0];
    console.log('from index:',rect.width());
};
//console.log('exampleSVGcontent', exampleSVGcontent);
svgm('', 'testfile.svg');
// console.log('draw:', svgdom['debug']('sssdfsdfs'));