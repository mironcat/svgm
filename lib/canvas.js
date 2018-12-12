/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';
const SVGJS = require('svg.js');
let svgdom = {
    node (rawSVG='') {
       // console.log('from Canvas:',rawSVG);
       // returns a window with a document and an svg root node
        const window = require('svgdom');
        const nodeSVG = SVGJS(window);
        const document = window.document;
        // create svg.js instance
        const draw = nodeSVG(document.documentElement);
        //read test .svg file
        if (rawSVG=='') rawSVG = getTestSVGcontent('./assets/test.svg');
        draw.svg(rawSVG);
        return nodeSVG;
    },
    html(rawSVG){
        const svgcanvas = document.createElement('DIV');
        svgcanvas.setAttribute('id', 'svgcanvas');
        svgcanvas.setAttribute('hidden', 'true');
        //
        document.body.appendChild(svgcanvas);
        SVGJS('svgcanvas').size('800', '900').svg(rawSvg); // прорисовка svg        
        return SVGJS;
    }
};
function getTestSVGcontent(filepath) {
    //read test .svg file
    return require('fs').readFileSync(filepath, 'utf8');
}


//testing
/* const svgdata = getTestSVGcontent('./assets/test2.svg');
let SVG = svgdom['node'](svgdata);
let rect = SVG.select('rect').members[0];
console.log(rect.width()); */

export { svgdom };