/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroups = getGroups;

var _measures = require("./measures");

function getGroups(SVG) {
  /**
   * iteration and check path, rects and lines for scalebar label
   * then calculate scalefactor and return parent group for 
   * each scalebar.
   * @SVG - svg.js instance
   */
  var paths = SVG.select('path').members;
  var scalebars = scalebarIteration(paths);
  var rects = SVG.select('rect').members;
  var rectscalebars = scalebarIteration(rects);
  if (rectscalebars) scalebars = scalebars.concat(rectscalebars);
  var lines = SVG.select('line').members;
  var linescalebars = scalebarIteration(lines);
  if (linescalebars) scalebars = scalebars.concat(linescalebars);
  var groups = [];
  if (scalebars) scalebars.forEach(function (scalebar) {
    var group = scalebar.item.parent();
    groups.push({
      group: group,
      scalefactor: scalebar.scalefactor
    });
  });
  return groups;
}

function scalebarIteration(items) {
  /**
   * Iteration through potencial scalebar elements "items" (path, rects and lines) 
   * and calulate scalefactor by scalebarFinder
   */
  var scalebars = [];
  items.forEach(function (item) {
    var scalefactor = scalebarFinder(item);
    if (scalefactor) scalebars.push({
      item: item,
      scalefactor: scalefactor
    });
  });
  return scalebars;
}

function scalebarFinder(item) {
  var scalefactorConstructor = {
    path: function path(item, scalebarvalue) {
      // body...
      var d = item.node.getAttribute("d");
      var z = d.indexOf("z");
      var length = item.length();

      if (z > 0) {
        alert("Масштабный отрезок в виде закрытой кривой! Это может привести к ошибочным вычислениям." + " Исправьте отрезок или используйте прямоугольник (rectangles) для масштабного отрезка");
        length = item.length() / 2;
      }

      return length / scalebarvalue;
    },
    line: function line(item, scalebarvalue) {
      // body...
      var points = item.array().value;
      var point1 = points[0];
      var point2 = points[1];
      var length = dist(point1, point2);
      return length / scalebarvalue;

      function dist(point1, point2) {
        var x1 = point1[0],
            x2 = point2[0];
        var y1 = point1[1],
            y2 = point2[1];
        return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
      }
    },
    rect: function rect(item, scalebarvalue) {
      // body...
      var length = item.width(),
          rectheight = item.height();
      if (rectheight > length) length = rectheight;
      return length / scalebarvalue;
    }
  }; // body... возвращает scalefactor или false

  var type = item.type;
  var labels = (0, _measures.getLabels)(item);
  var label = labels.label;

  if (label === 'scalebar') {
    var scalebarvalue = Number(labels.labelvalue);
    var scalefactor = scalefactorConstructor[type](item, scalebarvalue);
    return scalefactor;
  }

  return false;
}
//# sourceMappingURL=groups.js.map