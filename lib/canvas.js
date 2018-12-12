'use strict';
let svgdom = {
    node (rawSVG) {
       // console.log('from Canvas:',rawSVG);
       // returns a window with a document and an svg root node
        const window = require('svgdom');
        const SVG = require('svg.js')(window);
        const document = window.document;
        // create svg.js instance
        const draw = SVG(document.documentElement);
        //read test .svg file
        const fs = require('fs');
        const exampleSVGcontent = fs.readFileSync('./assets/test.svg', 'utf8');
        // use svg.js as normal
        draw.svg(exampleSVGcontent);
        return SVG;
    },
    html(rawSVG){
        return 'production mode';
    }
};
function getTestSVGcontent() {
    //read test .svg file
    return require('fs').readFileSync('./assets/test.svg', 'utf8');
}

/*
//testing
svgdom['node']();
let rect = SVG.select('rect').members[0];
console.log(rect.width()); */

export { svgdom };