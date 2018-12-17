"use strict";

// 'use strict';
// returns a window with a document and an svg root node
var window = require('svgdom');

var SVG = require('svg.js')(window);

var document = window.document;
var draw = SVG(document.documentElement); // get your svg as string

console.log(draw); // or
//console.log(draw.node.outerHTML)
//# sourceMappingURL=test.js.map