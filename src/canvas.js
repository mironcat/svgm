/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
"use strict";
const SVGJS = require("svg.js");
function svgdom(rawSVG = "") {
    const svgcanvas = document.createElement("DIV");
    svgcanvas.setAttribute("id", "svgcanvas");
    svgcanvas.setAttribute("hidden", "true");
    document.body.appendChild(svgcanvas);
    SVGJS("svgcanvas")
      .size("800", "900")
      .svg(rawSVG); // прорисовка svg
    return SVGJS;
};
export {svgdom};
