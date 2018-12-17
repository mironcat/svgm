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
exports.getGroupItems = getGroupItems;

var _measures = require("./measures");

function getGroupItems(groups, SVG) {
  var gi = [];
  groups.forEach(function (groupitem, i) {
    gi.push(getItems(groupitem, SVG));
  });
  return gi;
}

;

function getItems(groupitem, SVG) {
  ///sfaf
  var items = {
    scalefactor: groupitem.scalefactor,
    elements: {
      image: [],
      text: [],
      path: [],
      line: [],
      rect: [],
      ellipse: [],
      circle: [],
      g: []
    }
  };
  var elements = groupitem.group.children(); //debugger;

  elements.forEach(function (item) {
    var el = (0, _measures.getProps)(item, groupitem.scalefactor, SVG);
    if (el != "scalebar" && items.elements[el.type]) items.elements[el.type].push(el);
  });
  return items;
}
//# sourceMappingURL=items.js.map