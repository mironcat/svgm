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
    SVG("svgcanvas")
      .size("800", "900")
      .svg(rawSVG); // прорисовка svg
    return SVG;
};
export {svgdom};
