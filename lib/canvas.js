'use strict'
let mode ='debug';
function test (mode) {
    console.log('from test!');
    return 'text from test, mode:' + mode;
}
let svgdom = {
    debug (rawSVG) {
        console.log(rawSVG);
        const window = require('svgdom');
        const SVG = require('svg.js')(window);
        const document = window.document;
        const draw = SVG(document.documentElement);
        return draw;
    },
    production(rawSVG){
        return 'production mode';
    }
};
export { test, svgdom };
//console.log(mode);
/* 
export svgdom; */
// let a= svgdom[mode];
// console.log(a('afasfasf'));