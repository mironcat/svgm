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
exports.getProps = getProps;
exports.getLabels = getLabels;
var MTYPE = 'measure';

function getProps(item, scalefactor, SVG) {
  // body...
  var labels = getLabels(item);
  var label = labels.label;
  if (label === 'scalebar') return label;
  var type = item.type;
  var attributes = item.attr();
  var id = attributes['id'];
  var el = {
    type: type,
    id: id,
    label: label
  };
  var measures = getMeasures(item, id, scalefactor, SVG);
  if (measures) el.measures = measures;
  var desc = SVG.select('desc', item.node).members[0];
  var title = SVG.select('title', item.node).members[0];
  if (desc) el.desc = desc.node.textContent;

  if (title) {
    //console.log(title);
    el.title = title.node.textContent;
  } //debugger;


  return el;
}

function getLabels(item) {
  // body...
  var attributes = item.attr(); // debugger;

  var labeltext = attributes['inkscape:label'];
  if (!labeltext) return {
    label: attributes['id']
  };
  var arr = labeltext.split('=');
  /*    if (arr.length) {arr = labeltext.split('-')}*/

  var label = arr[0],
      labelvalue = arr[1];
  return {
    label: label,
    labelvalue: labelvalue
  };
}

function getMeasures(item, idtext, scalefactor, SVG) {
  var itemtype = item.type;
  var arr = idtext.split('-'); //получаем массив символов измерений

  var setchars = {
    rect: ['w', 'h', 'area', 'p', 'c'],
    ellipse: ['area', 'w', 'h', 'p', 'c'],
    circle: ['area', 'w', 'h', 'c', 'diameter'],
    path: ['area', 'l', 'h'],
    line: ['l', 'h'],
    text: ['t', 'y'],
    image: ['file', 'folder'],
    g: ['count', 'd', 'area']
  }; //все возможные символы измерений

  var defchars = {
    measure: {
      rect: ['w', 'h'],
      ellipse: ['w', 'h'],
      circle: ['diameter'],
      path: ['l'],
      line: ['l'],
      text: ['t'],
      image: ['file', 'folder'],
      g: ['count', 'd']
    },
    strat: {
      ellipse: ['c'],
      circle: ['c'],
      line: ['h', 'start'],
      path: ['h', 'start'],
      text: ['t', 'y'],
      g: ['count']
    }
  }; //измерения по умолчанию

  if (!setchars[itemtype]) return false; // если тип элемента неопределен, выходим

  var chars = matchArr(arr, setchars[itemtype], itemtype); //if (itemtype='g') {debugger;}

  if (chars.length === 0) chars = defchars[MTYPE][itemtype]; //измерения по умолчанию
  // если тип элемента неопределен, выходим

  if (!chars) return false;
  var measures = {};
  chars.forEach(function (ch) {
    measures[ch] = measure(item, itemtype + "-" + ch, scalefactor, SVG); //measures.push(measure(item, ch));
  }); //debugger;

  return measures;

  function matchArr(a1, a2) {
    //совпадающие элементы массивов
    var idx = 0,
        matchingElements = [];

    for (var i = 0; i < a2.length; i++) {
      idx = a1.indexOf(a2[i]);
      if (idx >= 0) matchingElements.push(a1[idx]);
    }

    return matchingElements;
  }
}

function measure(item, char, scalefactor, SVG) {
  var attributes = item.attr();
  var value = 0;
  var type = 'na';

  switch (char) {
    case 'ellipse-c':
      value = {
        x: item.cx() / scalefactor,
        y: item.cy() / scalefactor
      };
      break;

    case 'ellipse-w':
      value = item.width() / scalefactor;
      break;

    case 'ellipse-h':
      value = item.height() / scalefactor;
      break;

    case 'line-l':
      var points = item.array().value;
      var point1 = points[0];
      var point2 = points[1];
      value = dist(point1, point2) / scalefactor; // debugger;

      break;

    case 'line-h':
      var points = item.array().value;
      var point1 = points[0];
      var point2 = points[1];
      value = dist(point1, point2) / scalefactor; // debugger;

      break;

    case 'line-start':
      var x = item.attr('x1'),
          y = item.attr('y1'),
          y2 = item.attr('y2');
      debugger;
      if (y2 > y) y = y2;
      value = {
        x: x,
        y: y
      };
      break;

    case 'circle-c':
      value = {
        x: item.cx() / scalefactor,
        y: item.cy() / scalefactor
      };
      break;

    case 'circle-diameter' || 'circle-h':
      value = item.height() / scalefactor; //  debugger;

      break;

    case 'rect-start':
      value = {
        x: item.x() / scalefactor,
        y: item.y() / scalefactor
      };
      break;

    case 'rect-c':
      value = {
        x: item.cx() / scalefactor,
        y: item.cy() / scalefactor
      };
      break;

    case 'rect-area':
      value = attributes.width * attributes.height / (scalefactor * scalefactor); //debugger;

      break;

    case 'rect-l':
      value = attributes.height / scalefactor;
      break;

    case 'rect-w':
      value = item.width() / scalefactor;
      break;

    case 'rect-h':
      value = item.height() / scalefactor;
      break;

    case 'circle-area':
      var R = item.height() / 2;
      value = Math.PI * (R * R) / (scalefactor * scalefactor);
      break;

    case 'path-start':
      arrayPoints = item.array().value;
      var y = arrayPoints[0][2],
          x = 0,
          numberOfPoints = arrayPoints.length;
      arrayPoints.forEach(function (point) {
        // body...
        if (y < point[2]) y = point[2];
        x = x + point[1];
      });
      x /= numberOfPoints;
      value = {
        x: x / scalefactor,
        y: y / scalefactor
      }; // debugger;

      break;

    case 'path-h':
      value = item.length() / scalefactor;
      break;

    case 'path-area' || 'ellipse-area' || 'circle-area':
      value = calcPathArea(item.node) / (scalefactor * scalefactor);
      break;

    case 'path-l':
      value = item.length() / scalefactor; // debugger;

      break;

    case 'text-t':
      if (item.node.childNodes.length > 1) {
        var tspan = SVG.select('tspan', item.node).members[0].node.textContent;
        var d = SVG.select('desc', item.node).members[0];
        var t = SVG.select('title', item.node).members[0];
        var desc = '',
            title = '';
        if (d) desc = '-' + d.node.textContent;
        if (t) title = '-' + t.node.textContent;
        var value = tspan + title + desc;
      } else {
        var value = item.text();
      } //debugger;


      break;

    case 'text-y':
      value = item.attr('y') / scalefactor; //  debugger;

      break;

    case 'image-file':
      var filepath = attributes['xlink:href'].split('/');
      value = filepath[filepath.length - 1].split('.')[0];
      break;

    case 'image-folder':
      var filepath = attributes['xlink:href'].split('/');
      value = filepath[filepath.length - 2];
      break;

    case 'g-d':
      //debugger;
      var rect = item.select('rect').members[0];

      if (rect) {
        var attr = rect.attr();
        var area = attr.width * attr.height / (scalefactor * scalefactor);
      }

      var count = item.children().length - 1;
      value = count / area;
      break;

    case 'g-count':
      //debugger;
      value = item.children().length - 1;
      break;

    default:
  } // return обект с измерением и его типом


  if (value) {
    return value;
  } else {
    return 'нет измерений';
  }
} //----------------------- Line length-------------------------------------


function dist(point1, point2) {
  var x1 = point1[0],
      x2 = point2[0];
  var y1 = point1[1],
      y2 = point2[1];
  return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
} //----------------------- AREA-------------------------------------


function calcPathArea(path) {
  // calculate area from outline path...
  function polyArea(poly) {
    var area = 0,
        pts = poly.points,
        len = pts.numberOfItems;

    for (var i = 0; i < len; ++i) {
      var p1 = pts.getItem(i),
          p2 = pts.getItem((i + len - 1) % len);
      area += (p2.x + p1.x) * (p2.y - p1.y);
    }

    return Math.abs(area / 2);
  }

  var poly = pathToPolygonViaSubdivision(path, 0);
  var numberOfItems = poly.points.numberOfItems;
  return polyArea(poly);
} // path:      an SVG <path> element
// threshold: a 'close-enough' limit (ignore subdivisions with area less than this)
// segments:  (optional) how many segments to subdivisions to create at each level
// returns:   a new SVG <polygon> element


function pathToPolygonViaSubdivision(path, threshold, segments) {
  if (!threshold) threshold = 0.0001; // Get really, really close

  if (!segments) segments = 3; // 2 segments creates 0-area triangles

  var points = subdivide(ptWithLength(0), ptWithLength(path.getTotalLength()));

  for (var i = points.length; i--;) {
    points[i] = [points[i].x, points[i].y];
  }

  var doc = path.ownerDocument;
  var poly = doc.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  poly.setAttribute('points', points.join(' '));
  return poly; // Record the distance along the path with the point for later reference

  function ptWithLength(d) {
    var pt = path.getPointAtLength(d);
    pt.d = d;
    return pt;
  } // Create segments evenly spaced between two points on the path.
  // If the area of the result is less than the threshold return the endpoints.
  // Otherwise, keep the intermediary points and subdivide each consecutive pair.


  function subdivide(p1, p2) {
    var pts = [p1];

    for (var i = 1, step = (p2.d - p1.d) / segments; i < segments; i++) {
      pts[i] = ptWithLength(p1.d + step * i);
    }

    pts.push(p2);
    if (polyArea(pts) <= threshold) return [p1, p2];else {
      var result = [];

      for (var i = 1; i < pts.length; ++i) {
        var mids = subdivide(pts[i - 1], pts[i]);
        mids.pop(); // We'll get the last point as the start of the next pair

        result = result.concat(mids);
      }

      result.push(p2);
      return result;
    }
  } // Calculate the area of an polygon represented by an array of points


  function polyArea(points) {
    // debugger;
    var p1, p2;

    for (var area = 0, len = points.length, i = 0; i < len; ++i) {
      p1 = points[i];
      p2 = points[(i - 1 + len) % len]; // Previous point, with wraparound

      area += (p2.x + p1.x) * (p2.y - p1.y);
    }

    return Math.abs(area / 2);
  }
}
//# sourceMappingURL=measures.js.map