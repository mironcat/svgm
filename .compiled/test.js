// 'use strict';
// returns a window with a document and an svg root node
const window = require('svgdom');

const SVG = require('svg.js')(window);

const document = window.document;
const draw = SVG(document.documentElement); // get your svg as string

console.log(draw); // export {draw};
// or
//console.log(draw.node.outerHTML)
//# sourceMappingURL=test.js.map