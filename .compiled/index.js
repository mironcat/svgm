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
exports.svgm = svgm;

var _canvas = require("./canvas");

var _groups = require("./groups");

var _items = require("./items");

var _prepres = require("./prepres");

function svgm(rawSvg, filename) {
  var mode = 'html';
  debugger;
  if (typeof document === 'undefined') mode = 'node';

  var SVG = _canvas.svgdom['node'](rawSvg); //mode of svg dom: node or html
  //groups with scalebars


  var groups = (0, _groups.getGroups)(SVG); //extract and measure elements

  var gi = (0, _items.getGroupItems)(groups, SVG); //array

  console.log('from index:', gi);
  return (0, _prepres.getResults)(gi, filename);
  /*
  // testingg
   let rect = SVG.select('rect').members[0];
  console.log('from index:',rect.width()); 
  */
}

;
/* let defaultresults = svgm('', 'testfile.svg');
console.log(defaultresults); */
//# sourceMappingURL=index.js.map