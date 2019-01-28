/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
"use strict";
import SVG from "svg.js";
function svgdom(rawSVG = "") {
    const svgcanvas = document.createElement("DIV");
    svgcanvas.setAttribute("id", "svgcanvas");
    svgcanvas.setAttribute("hidden", "true");
    document.body.appendChild(svgcanvas);
  const draw = new SVG("svgcanvas");
    draw.clear();
    draw.svg(rawSVG); // прорисовка svg
    debugger;
  return draw;
};
export {svgdom};
