
function getTestSVGcontent(filepath) {
  //read test .svg file
  return require("fs").readFileSync(filepath, "utf8");
}
function getSVGinstance(rawSVG,SVG) {
  const window = require("svgdom");
  const nodeSVG = new SVG(window);
  const document = window.document;
  // create svg.js instance
  const draw = nodeSVG(document.documentElement);
  draw.clear();
  draw.svg(rawSVG);
  return nodeSVG;
}
export { getTestSVGcontent, getSVGinstance };