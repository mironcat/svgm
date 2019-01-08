const SVG = require("svg.js");
function getTestSVGcontent(filepath) {
  //read test .svg file
  return require("fs").readFileSync(filepath, "utf8");
}
function getSVGinstance(rawSVG) {
  const window = require("svgdom");
  const nodeSVG = SVG(window);
  const document = window.document;
  // create svg.js instance
  const draw = nodeSVG(document.documentElement);
  draw.svg(rawSVG);
  return nodeSVG;
}
export { getTestSVGcontent, getSVGinstance };