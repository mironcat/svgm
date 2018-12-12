/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';
import { svgdom, exampleSVGcontent } from './canvas';
function svgm (rawSvg, filename) {
    const draw = svgdom['debug'];
    debugger;
    let store = draw.svg(rawSvg);
    debugger;
    const paths = store.select('path').members;
    console.log(paths);
};
//console.log('exampleSVGcontent', exampleSVGcontent);
svgm(exampleSVGcontent, 'testfile.svg');
// console.log('draw:', svgdom['debug']('sssdfsdfs'));