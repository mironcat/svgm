/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
import { dist,calcAngle,calcPathArea } from "./math";

const MTYPE = "measure";
function getProps(item, scalefactor) {
  // body...
  let labels = getLabels(item);
  let label = labels.label;
  if (label === "scalebar") return label;
  let type = item.type;
  let attributes = item.attr();
  let id = attributes["id"];
  let el = {
    type,
    id,
    label
  };
  let measures = getMeasures(item, id, scalefactor);
  if (measures) el.measures = measures;

  let desc = SVG.select("desc", item.node).members[0];
  let title = SVG.select("title", item.node).members[0];
  if (desc) el.desc = desc.node.textContent;
  if (title) {
    //console.log(title);
    el.title = title.node.textContent;
  }

  //debugger;
  return el;
}
function getLabels(item) {
  // body...

  let attributes = item.attr();
  // debugger;
  let labeltext = attributes["inkscape:label"];
  if (!labeltext)
    return {
      label: attributes["id"]
    };
  if (typeof (labeltext) == 'number') return {
    label: labeltext
  };
  let arr = labeltext.split("=");
  /*    if (arr.length) {arr = labeltext.split('-')}*/

  let label = arr[0],
    labelvalue = arr[1];
  return {
    label,
    labelvalue
  };
}
function getMeasures(item, idtext, scalefactor) {
  let itemtype = item.type;
  let arr = idtext.split(":");
  console.log(arr);
  //получаем массив символов измерений
  const setchars = {
    rect: ["w", "h", "area", "p", "c"],
    ellipse: ["area", "w", "h", "p", "c"],
    circle: ["area", "w", "h", "c", "diameter"],
    path: ["area", "l", "h", "angle"],
    line: ["l", "h"],
    text: ["t", "y"],
    image: ["file", "folder"],
    g: ["count", "d", "area"]
  };
  //все возможные символы измерений
  const defchars = {
    measure: {
      rect: ["w", "h"],
      ellipse: ["w", "h"],
      circle: ["diameter"],
      path: ["l", "start"],
      line: ["l","start"],
      text: ["t"],
      image: ["file", "folder"],
      g: ["count", "d"]
    },
    strat: {
      ellipse: ["c"],
      circle: ["c"],
      line: ["h", "start"],
      path: ["h", "start"],
      text: ["t", "y"],
      g: ["count"]
    }
  };
  //измерения по умолчанию

  if (!setchars[itemtype]) return false;
  // если тип элемента неопределен, выходим

  let chars = matchArr(arr, setchars[itemtype], itemtype);
  //if (itemtype='g') {debugger;}
  if (chars.length === 0) chars = defchars[MTYPE][itemtype];
  //измерения по умолчанию
  // если тип элемента неопределен, выходим
  if (!chars) return false;

  let measures = {};
  chars.forEach(ch => {
    measures[ch] = measure(item, itemtype + "-" + ch, scalefactor);
    //measures.push(measure(item, ch));
  });
  //debugger;
  return measures;
  function matchArr(a1, a2) {
    //совпадающие элементы массивов
    let idx = 0,
      matchingElements = [];
    for (let i = 0; i < a2.length; i++) {
      idx = a1.indexOf(a2[i]);
      if (idx >= 0) matchingElements.push(a1[idx]);
    }
    return matchingElements;
  }
}
function measure(item, char, scalefactor) {
  let attributes = item.attr();
  var value = 0;
  let type = "na";
  switch (char) {
    case "ellipse-c":
      value = { x: item.cx() / scalefactor, y: item.cy() / scalefactor };
      break;
    case "ellipse-w":
      value = item.width() / scalefactor;
      break;
    case "ellipse-h":
      value = item.height() / scalefactor;
      break;
    case "line-l":
      var points = item.array().value;
      var point1 = points[0];
      var point2 = points[1];
      value = dist(point1, point2) / scalefactor;
      // debugger;
      break;
    case "line-h":
      var points = item.array().value;
      var point1 = points[0];
      var point2 = points[1];
      value = dist(point1, point2) / scalefactor;
      // debugger;
      break;
    case "line-start":
      var x = item.attr("x1"),
        y = item.attr("y1"),
        y2 = item.attr("y2");
      debugger;
      if (y2 > y) y = y2;
      value = { x, y };
      break;
    case "circle-c":
      value = { x: item.cx() / scalefactor, y: item.cy() / scalefactor };
      break;
    case "circle-diameter" || "circle-h":
      value = item.height() / scalefactor;
      //  debugger;
      break;
    case "rect-start":
      value = { x: item.x() / scalefactor, y: item.y() / scalefactor };
      break;
    case "rect-c":
      value = { x: item.cx() / scalefactor, y: item.cy() / scalefactor };
      break;
    case "rect-area":
      value =
        (attributes.width * attributes.height) / (scalefactor * scalefactor);
      //debugger;
      break;
    case "rect-l":
      value = attributes.height / scalefactor;
      break;
    case "rect-w":
      value = item.width() / scalefactor;
      break;
    case "rect-h":
      value = item.height() / scalefactor;
      break;
    case "circle-area":
      var R = item.height() / 2;
      value = (Math.PI * (R * R)) / (scalefactor * scalefactor);
      break;
    case "path-start":
      arrayPoints = item.array().value;
      var y = arrayPoints[0][2],
        x = 0,
        numberOfPoints = arrayPoints.length;
      arrayPoints.forEach(point => {
        // body...
        if (y < point[2]) y = point[2];
        x = x + point[1];
      });
      x /= numberOfPoints;
      value = { x: x / scalefactor, y: y / scalefactor };
      // debugger;
      break;
    case "path-h":
      value = item.length() / scalefactor;
      break;
    case "path-area" || "ellipse-area" || "circle-area":
      value = calcPathArea(item.node) / (scalefactor * scalefactor);
      break;
    case "path-l":
      value = item.length() / scalefactor;
      // debugger;
      break;
    case "path-angle":
      var points = item.array().value;
      if (points.length != 3) {
        value = "err. path-angle must be with 3 points";
      } else {
        value = calcAngle(points);
      }
      break;
    case "text-t":
      if (item.node.childNodes.length > 1) {
        let tspan = SVG.select("tspan", item.node).members[0].node.textContent;
        let d = SVG.select("desc", item.node).members[0];
        let t = SVG.select("title", item.node).members[0];
        let desc = "",
          title = "";
        if (d) desc = "-" + d.node.textContent;
        if (t) title = "-" + t.node.textContent;
        var value = tspan + title + desc;
      } else {
        var value = item.text();
      }

      //debugger;
      break;
    case "text-y":
      value = item.attr("y") / scalefactor;
      //  debugger;
      break;
    case "image-file":
      var filepath = attributes["xlink:href"].split("/");
      value = filepath[filepath.length - 1].split(".")[0];
      break;
    case "image-folder":
      var filepath = attributes["xlink:href"].split("/");
      value = filepath[filepath.length - 2];
      break;
    case "g-d":
      //debugger;
      var rect = item.select("rect").members[0];
      if (rect) {
        let attr = rect.attr();
        var area = (attr.width * attr.height) / (scalefactor * scalefactor);
      }
      var count = item.children().length - 1;
      value = count / area;
      break;
    case "g-count":
      //debugger;
      value = item.children().length - 1;
      break;
    default:
  }

  // return обект с измерением и его типом
  if (value) {
    return value;
  } else {
    return "нет измерений";
  }
}
export { getProps, getLabels };