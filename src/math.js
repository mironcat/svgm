/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';
//----------------------- Line length-------------------------------------
function dist(point1, point2) {
  let x1 = point1[0],
    x2 = point2[0];
  let y1 = point1[1],
    y2 = point2[1];
  return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
}
// -------------------------PATH ANGLE--------------------------------------
function calcAngle(points,Radian=false) {
    var p1 = getPoint(points[1]);
    var p2 = getPoint(points[0]);
    var p3 = getPoint(points[2]);
    debugger;
    var p12 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    var p13 = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
    var p23 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
    //angle in radians
    var resultRadian = Math.acos((Math.pow(p12, 2) + Math.pow(p13, 2) - Math.pow(p23, 2)) / (2 * p12 * p13));
    //angle in degrees
    var resultDegree = (Math.acos((Math.pow(p12, 2) + Math.pow(p13, 2) - Math.pow(p23, 2)) / (2 * p12 * p13)) * 180) / Math.PI;
    if (Radian) return resultRadian;
    return resultDegree;

}
function getPoint(point) {
    return {
        x:point[1],
        y:point[2]
    }
}
//----------------------- AREA-------------------------------------
function calcPathArea(path) {
  // calculate area from outline path...
  function polyArea(poly) {
    let area = 0,
      pts = poly.points,
      len = pts.numberOfItems;
    for (let i = 0; i < len; ++i) {
      let p1 = pts.getItem(i),
        p2 = pts.getItem((i + len - 1) % len);
      area += (p2.x + p1.x) * (p2.y - p1.y);
    }
    return Math.abs(area / 2);
  }
  let poly = pathToPolygonViaSubdivision(path, 0);
  let numberOfItems = poly.points.numberOfItems;
  return polyArea(poly);
}
// path:      an SVG <path> element
// threshold: a 'close-enough' limit (ignore subdivisions with area less than this)
// segments:  (optional) how many segments to subdivisions to create at each level
// returns:   a new SVG <polygon> element
function pathToPolygonViaSubdivision(path, threshold, segments) {
  if (!threshold) threshold = 0.0001; // Get really, really close
  if (!segments) segments = 3; // 2 segments creates 0-area triangles

  let points = subdivide(ptWithLength(0), ptWithLength(path.getTotalLength()));

  for (let i = points.length; i--; ) points[i] = [points[i].x, points[i].y];

  let doc = path.ownerDocument;
  let poly = doc.createElementNS("http://www.w3.org/2000/svg", "polygon");
  poly.setAttribute("points", points.join(" "));
  return poly;

  // Record the distance along the path with the point for later reference
  function ptWithLength(d) {
    let pt = path.getPointAtLength(d);
    pt.d = d;
    return pt;
  }

  // Create segments evenly spaced between two points on the path.
  // If the area of the result is less than the threshold return the endpoints.
  // Otherwise, keep the intermediary points and subdivide each consecutive pair.
  function subdivide(p1, p2) {
    let pts = [p1];
    for (var i = 1, step = (p2.d - p1.d) / segments; i < segments; i++) {
      pts[i] = ptWithLength(p1.d + step * i);
    }
    pts.push(p2);
    if (polyArea(pts) <= threshold) return [p1, p2];
    else {
      let result = [];
      for (var i = 1; i < pts.length; ++i) {
        let mids = subdivide(pts[i - 1], pts[i]);
        mids.pop(); // We'll get the last point as the start of the next pair
        result = result.concat(mids);
      }
      result.push(p2);
      return result;
    }
  }

  // Calculate the area of an polygon represented by an array of points
  function polyArea(points) {
    // debugger;
    let p1, p2;
    for (var area = 0, len = points.length, i = 0; i < len; ++i) {
      p1 = points[i];
      p2 = points[(i - 1 + len) % len]; // Previous point, with wraparound
      area += (p2.x + p1.x) * (p2.y - p1.y);
    }
    return Math.abs(area / 2);
  }
}

export { dist, calcAngle, calcPathArea };