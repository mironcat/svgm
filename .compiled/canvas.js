'use strict';

let mode = 'debug';
let svgdom = {
  debug(rawSVG) {
    console.log(rawSVG);

    const window = require('svgdom');

    const SVG = require('svg.js')(window);

    const document = window.document;
    const draw = SVG(document.documentElement);
    return draw;
  },

  production(rawSVG) {
    return 'production mode';
  }

}; //console.log(mode);

let a = svgdom[mode]; // console.log(a('afasfasf'));
//# sourceMappingURL=canvas.js.map