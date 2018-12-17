/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.svgdom = void 0;

var SVGJS = require('svg.js');

var svgdom = {
  node: function node() {
    var rawSVG = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    // console.log('from Canvas:',rawSVG);
    // returns a window with a document and an svg root node
    var window = require('svgdom');

    var nodeSVG = SVGJS(window);
    var document = window.document; // create svg.js instance

    var draw = nodeSVG(document.documentElement); //read test .svg file

    if (rawSVG == '') rawSVG = getTestSVGcontent('./assets/test.svg');
    draw.svg(rawSVG);
    return nodeSVG;
  },
  html: function html(rawSVG) {
    var svgcanvas = document.createElement('DIV');
    svgcanvas.setAttribute('id', 'svgcanvas');
    svgcanvas.setAttribute('hidden', 'true'); //

    document.body.appendChild(svgcanvas);
    SVGJS('svgcanvas').size('800', '900').svg(rawSvg); // прорисовка svg        

    return SVGJS;
  }
};
exports.svgdom = svgdom;

function getTestSVGcontent(filepath) {
  //read test .svg file
  return require('fs').readFileSync(filepath, 'utf8');
} //testing

/* const svgdata = getTestSVGcontent('./assets/test2.svg');
let SVG = svgdom['node'](svgdata);
let rect = SVG.select('rect').members[0];
console.log(rect.width()); */
//# sourceMappingURL=canvas.js.map