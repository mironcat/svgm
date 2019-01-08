/*
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';
// returns a window with a document and an svg root node
// const window   = require('svgdom');
const SVG = require('svg.js');
// const document = window.document;
let mtype = 'strat';
function prepareSVG(rawSvg, filename) {
  // основная процедура, которая запускает более мелкие
  // и определяет порядок действия
  mtype = 'measure'; //тип измерения или разрез
  // eslint-disable-next-line no-undef
  const svgcanvas = document.createElement('DIV');
  svgcanvas.setAttribute('id', 'svgcanvas');
  svgcanvas.setAttribute('hidden', 'true');
  // eslint-disable-next-line no-undef
  document.body.appendChild(svgcanvas);
  SVG('svgcanvas').size('800', '900').svg(rawSvg); // прорисовка svg
  // SVG(document.documentElement).svg(rawSvg);
  //получить группы как родители scalebar
  let groups = getGroups(); //groups - группы с масштабными линейками
  //$(".progress-bar").css("width", '20%');
  //debugger;
  // перебор и получение элементов для каждой группы
  let GroupItems = [];
  groups.forEach((groupitem, i) => {
    GroupItems.push(getItems(groupitem));
  });
  //GroupItems- массив объектов-грууп со свойствами:
  //elements:{image: Array(0), text: Array(2), path: Array(2), line: Array(0), rect: Array(0), …} - обработанные элементы
  //scalefactor:
  //$(".progress-bar").css("width", '80%');
  //debugger ;
  var result = [];
  GroupItems.forEach((groupitem) => {
    const rows = prepareItemGroup(groupitem); // подготовка для таблицы
    result = result.concat(rows);
    //progressValue = progressValue + progressStep;
    // //$(".progress-bar").css("width", progressValue.toFixed(0) + '%');
    //debugger;
  });
  //$(".progress-bar").css("width", '90%');

  let numbers1 = [45, 4, 9, 16, 25];
  var result = result.map(addFileName);
  function addFileName(row, index, result) {
    row.filename = filename;
    return (result[index] = row);
  }
  document.body.removeChild(svgcanvas);
  return result;
}

function getGroups() {
  const paths = SVG.select('path').members;
  let scalebars = scalebarIteration(paths);

  const rects = SVG.select('rect').members;
  let rectscalebars = scalebarIteration(rects);
  if (rectscalebars) scalebars = scalebars.concat(rectscalebars);
  const lines = SVG.select('line').members;
  let linescalebars = scalebarIteration(lines);
  if (linescalebars) scalebars = scalebars.concat(linescalebars);
  let groups = [];
  if (scalebars)
    scalebars.forEach((scalebar) => {
      var group = scalebar.item.parent();
      groups.push({
        group: group,
        scalefactor: scalebar.scalefactor
      });
    });
  return groups;
  function scalebarIteration(items) {
    // поиск масштабных линеек,
    let scalebars = [];
    items.forEach((item) => {
      var scalefactor = scalebarFinder(item);
      if (scalefactor)
        scalebars.push({
          item: item,
          scalefactor: scalefactor
        });
    });
    return scalebars;
  }
}

function scalebarFinder(item) {
  let scalefactorConstructor = {
    path(item, scalebarvalue) {
      // body...

      var d = item.node.getAttribute("d");
      var z = d.indexOf("z");
      var length = item.length();
      if (z > 0) {
        alert(
          "Масштабный отрезок в виде закрытой кривой! Это может привести к ошибочным вычислениям." +
            " Исправьте отрезок или используйте прямоугольник (rectangles) для масштабного отрезка"
        );
        length = item.length() / 2;
      }

      return length / scalebarvalue;
    },
    line(item, scalebarvalue) {
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
    rect(item, scalebarvalue) {
      // body...
      var length = item.width(),
        rectheight = item.height();
      if (rectheight > length) length = rectheight;
      return length / scalebarvalue;
    }
  };

  // body... возвращает scalefactor или false
  let type = item.type;
  let labels = getLabels(item);
  let label = labels.label;
  if (label === 'scalebar') {
    let scalebarvalue = Number(labels.labelvalue);
    let scalefactor = scalefactorConstructor[type](item, scalebarvalue);
    return scalefactor;
  }
  return false;
}

function getItems(groupitem) {
  ///sfaf
  let items = {
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
  let elements = groupitem.group.children();

  //debugger;
  elements.forEach((item) => {
    var el = getProps(item, groupitem.scalefactor);
    if (el != "scalebar" && items.elements[el.type])
      items.elements[el.type].push(el);
  });

  return items;
}

function prepareItemGroup(ItemGroup) {
  // body...
  //debugger;
  let elements = ItemGroup.elements;
  let head = {
    scalefactor: ItemGroup.scalefactor
  };
  var rows = [];
  //item	type	label	title	measurevalue	description	comments
  elements.text.forEach((text) => {
    if (text.label === "name") head.name = text.measures.t;
    if (text.label === "comments" || text.label === "comment")
      head.comments = text.measures.t;
  });
  elements.image.forEach((image) => {
    head.imagefilename = image.measures.file;
    head.imagefoldername = image.measures.folder;
  });
  if (!head.name) {
    head.name = head.imagefilename;
  }

  var rows = [];
  //debugger;
  //item	subgroup	type	label	title	measurevalue	description	comments
  elements.path.forEach((el) => {
    rows = rows.concat(getRows(el));
  });
  elements.line.forEach((el) => {
    rows = rows.concat(getRows(el));
  });
  elements.rect.forEach((el) => {
    rows = rows.concat(getRows(el));
  });
  elements.ellipse.forEach((el) => {
    rows = rows.concat(getRows(el));
  });
  elements.circle.forEach((el) => {
    rows = rows.concat(getRows(el));
  });
  elements.g.forEach((el) => {
    rows = rows.concat(getRows(el));
  });
  //	debugger;
  return rows;
  function getRows(el) {
    // подготавливает объект element в формат Datatables

    let scalefactor = head.scalefactor;
    let arr = [];
    for (let mt in el.measures) {
      let prepvalue = el.measures[mt];
      if (typeof prepvalue === 'number' && prepvalue > 1)
        prepvalue = prepvalue.toFixed(2);
      let row = {
        name: head.name,
        type: el.type + '-' + mt,
        label: el.label,
        value: prepvalue,
        title: el.title || '',
        //.toFixed(2)
        description: el.desc || '',
        comments: head.comments || ''
      };
      arr.push(row);
    }
    return arr;
  }
}

function getProps(item, scalefactor) {
  // body...
  let labels = getLabels(item);
  let label = labels.label;
  if (label === 'scalebar') return label;
  let type = item.type;
  let attributes = item.attr();
  let id = attributes['id'];
  let el = {
    type,
    id,
    label
  };
  let measures = getMeasures(item, id, scalefactor);
  if (measures) el.measures = measures;

  let desc = SVG.select('desc', item.node).members[0];
  let title = SVG.select('title', item.node).members[0];
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
  let labeltext = attributes['inkscape:label'];
  if (!labeltext)
    return {
      label: attributes['id']
    };
  let arr = labeltext.split('=');
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
  let arr = idtext.split('-');
  //получаем массив символов измерений
  const setchars = {
    rect: ['w', 'h', 'area', 'p', 'c'],
    ellipse: ['area', 'w', 'h', 'p', 'c'],
    circle: ['area', 'w', 'h', 'c', 'diameter'],
    path: ['area', 'l', 'h'],
    line: ['l', 'h'],
    text: ['t', 'y'],
    image: ['file', 'folder'],
    g: ['count', 'd', 'area']
  };
  //все возможные символы измерений
  const defchars = {
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
  };
  //измерения по умолчанию

  if (!setchars[itemtype]) return false;
  // если тип элемента неопределен, выходим

  let chars = matchArr(arr, setchars[itemtype], itemtype);
  //if (itemtype='g') {debugger;}
  if (chars.length === 0) chars = defchars[mtype][itemtype];
  //измерения по умолчанию
  // если тип элемента неопределен, выходим
  if (!chars) return false;

  let measures = {};
  chars.forEach((ch) => {
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
  let type = 'na';
  switch (char) {
    case 'ellipse-c':
      value = { x: item.cx() / scalefactor, y: item.cy() / scalefactor };
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
      value = dist(point1, point2) / scalefactor;
      // debugger;
      break;
    case 'line-h':
      var points = item.array().value;
      var point1 = points[0];
      var point2 = points[1];
      value = dist(point1, point2) / scalefactor;
      // debugger;
      break;
    case 'line-start':
      var x = item.attr('x1'),
          y = item.attr('y1'),
          y2 = item.attr('y2');
      debugger;
      if (y2 > y) y = y2;
      value = { x, y };
      break;
    case 'circle-c':
      value = { x: item.cx() / scalefactor, y: item.cy() / scalefactor };
      break;
    case 'circle-diameter' || 'circle-h':
      value = item.height() / scalefactor;
      //  debugger;
      break;
    case 'rect-start':
      value = { x: item.x() / scalefactor, y: item.y() / scalefactor };
      break;
    case 'rect-c':
      value = { x: item.cx() / scalefactor, y: item.cy() / scalefactor };
      break;
    case 'rect-area':
      value =
        (attributes.width * attributes.height) / (scalefactor * scalefactor);
      //debugger;
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
      value = (Math.PI * (R * R)) / (scalefactor * scalefactor);
      break;
    case 'path-start':
      arrayPoints = item.array().value;
      var y = arrayPoints[0][2],
          x = 0,
          numberOfPoints = arrayPoints.length;
      arrayPoints.forEach((point) => {
        // body...
        if (y < point[2]) y = point[2];
        x = x + point[1];
      });
      x /= numberOfPoints;
      value = { x: x / scalefactor, y: y / scalefactor };
      // debugger;
      break;
    case 'path-h':
      value = item.length() / scalefactor;
      break;
    case 'path-area' || 'ellipse-area' || 'circle-area':
      value = calcPathArea(item.node) / (scalefactor * scalefactor);
      break;
    case 'path-l':
      value = item.length() / scalefactor;
      // debugger;
      break;
    case 'text-t':
      if (item.node.childNodes.length > 1) {
        let tspan = SVG.select('tspan', item.node).members[0].node.textContent;
        let d = SVG.select('desc', item.node).members[0];
        let t = SVG.select('title', item.node).members[0];
        let desc = '',
            title = '';
        if (d) desc = '-' + d.node.textContent;
        if (t) title = '-' + t.node.textContent;
        var value = tspan + title + desc;
      } else {
        var value = item.text();
      }

      //debugger;
      break;
    case 'text-y':
      value = item.attr('y') / scalefactor;
      //  debugger;
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
        let attr = rect.attr();
        var area = (attr.width * attr.height) / (scalefactor * scalefactor);
      }
      var count = item.children().length - 1;
      value = count / area;
      break;
    case 'g-count':
      //debugger;
      value = item.children().length - 1;
      break;
    default:
  }

  // return обект с измерением и его типом
  if (value) {
    return value;
  } else {
    return 'нет измерений';
  }
}
//----------------------- Line length-------------------------------------
function dist(point1, point2) {
  let x1 = point1[0],
      x2 = point2[0];
  let y1 = point1[1],
      y2 = point2[1];
  return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
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
////------------------------Budnikov------------------------------
/*FAD:"32.61"
LAD:"36.13"
PubCode:"Arefiev_et_al2015"
SectCode:"Sec_Mikulino"
name:"Toyemia tverdochlebovi "
note:""
x:15180.921
*/
function BudnikovDataOptimization(points) {
  let rowArray = [];
  points.forEach((point) => {
    var rowNameExist = point.name in rowArray;
    if (!rowNameExist) {
      rowArray[point.name] = {
        FAD: point.FAD.toFixed(2),
        LAD: point.LAD.toFixed(2),
        PubCode: point.PubCode,
        SectCode: point.SectCode,
        name: point.name,
        note: point.note,
        x: point.x
      };
    }
    if (rowArray[point.name].FAD > point.FAD)
      rowArray[point.name].FAD = point.FAD.toFixed(2);
    if (rowArray[point.name].LAD < point.LAD)
      rowArray[point.name].LAD = point.LAD.toFixed(2);
  });
  //console.log(rowArray);
  return rowArray;
} //end BudnikovDataOptimization
////------------------------------------------------------
function prepareBudnikovSVG(rawSvg) {
  // body...
  mtype = 'strat';
  $('#svgcanvas').empty();
  let draw = SVG('svgcanvas').size('800', '900');
  draw.svg(rawSvg);
  //получить группы как родители scalebar
  //groups - группы с масштабными линейками
  let maingroup = SVG.get('budnikov');
  let lineArray = SVG.get('scalebar').attr();
  let boreArray = SVG.select('rect').members[0].attr();
  let boreName = boreArray.id;
  let Yzero = boreArray.y + boreArray.height;
  let scalefactor =
    200 / dist(lineArray.x1, lineArray.x2, lineArray.y1, lineArray.y2);
  let groups = maingroup.children();
  let points = [];
  groups.forEach((group) => {
    if (group.type === "metadata") return;
    if (group.attr("id") === "descr") return;

    var ellArr = group.select("ellipse").members[0].attr();
    var rY = ellArr.ry,
      cY = ellArr.cy;
    // debugger;

    var items = group.children();
    items.forEach(function(item) {
      var type = item.type;
      if (type != "ellipse" && type != "g") {
        var itemID = item.attr("id");
        console.log(itemID);
        var itemNames = itemID.slice(1).split("-");
        itemNames.forEach(function(name) {
          var point = {
            FAD: 0,
            LAD: 0,
            PubCode: "BudnikovScheme1",
            SectCode: boreName,
            name: "",
            note: "",
            x: 0
          };
          point.name = name;
          point.LAD = (Yzero - cY + rY) * scalefactor;
          point.FAD = (Yzero - cY - rY) * scalefactor;
          point.x = cY.toFixed(2);
          points.push(point);
        });
      }
    });
  });
  console.log(points);
  let results = this.BudnikovDataOptimization(points);
  return results;
  //debugger;

  function dist(x1, x2, y1, y2) {
    return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
  }
}
//-------

///------------------------ STRAT------------------------------------------
function prepareSecSVG(rawSvg) {
  // body...
  mtype = 'strat';
  $('#svgcanvas').empty();
  let draw = SVG('svgcanvas').size('800', '900');
  draw.svg(rawSvg);
  //получить группы как родители scalebar
  //groups - группы с масштабными линейками
  let groups = getGroups();
  //debugger;
  //$(".progress-bar").css("width", '20%');
  //debugger;
  // перебор и получение элементов для каждой группы
  let GroupItems = [];
  groups.forEach((groupitem, i) => {
    GroupItems.push(getItems(groupitem));
  });
  debugger;
  let result = [];
  GroupItems.forEach((groupitem) => {
    const rows = prepareSecItemGroup(groupitem);
    //debugger;
    result = result.concat(rows);
  });
  return result;
  console.log(Items);
}

function prepareSecItemGroup(ItemGroup) {
  // body...

  //var scalefactor=ItemGroup.scalefactor;
  let elements = ItemGroup.elements;
  let head = {
    scalefactor: 1
  };
  let rows = [];
  //'PubCode','SectCode','name','FAD','LAD'
  let textnames = [];
  elements.text.forEach((text) => {
    if (text.label === "PubCode") {
      head.PubCode = text.measures.t;
      return;
    }
    if (text.label === "SectCode") {
      head.SectCode = text.measures.t;
      return;
    }
    textnames.push({ name: text.measures.t, y: text.measures.y });
    //console.log (text);
  });
  elements.ellipse.forEach((ellipse) => {
    if (ellipse.label === "zero" || ellipse.label === "#zero")
      head.zero = ellipse.measures.c;
  });
  if (!head.zero) {
    elements.circle.forEach((circle) => {
      if (circle.label === "zero" || circle.label === "#zero")
        head.zero = circle.measures.c;
    });
  }
  //debugger;
  /*		elements.rect.forEach(function(el) {
			var ad = getFADLAD(el);
			//debugger;
			var row = {
				PubCode:head.PubCode,
				SectCode:head.SectCode,
				name:el.id,
				FAD:ad.FAD,
				LAD:ad.LAD, //.toFixed(2)
				note:'',
                y:el.measures.start.y
			};
			rows.push(row);
 		}); */

  elements.path.forEach((el) => {
    var ad = getFADLAD(el);
    //debugger;
    var row = {
      PubCode: head.PubCode,
      SectCode: head.SectCode,
      name: el.label,
      FAD: ad.FAD,
      LAD: ad.LAD, //.toFixed(2)
      note: "",
      x: el.measures.start.x
    };
    rows.push(row);
  });
  elements.line.forEach((el) => {
    //debugger;
    var ad = getFADLAD(el);
    //debugger;
    var row = {
      PubCode: head.PubCode,
      SectCode: head.SectCode,
      name: el.id,
      FAD: ad.FAD,
      LAD: ad.LAD, //.toFixed(2)
      note: "",
      x: el.measures.start.x
    };
    rows.push(row);
  });
  //debugger;
  rows.sort(compareNumeric);
  if (textnames.length === rows.length) {
    textnames.sort(compareText);
    rows.forEach((row, i) => {
      row.name = textnames[i].name;
      rows[i] = row;
    });
  }

  //debugger;
  return rows;
  function compareText(a, b) {
    //debugger;
    return b.y - a.y;
  }
  function compareNumeric(a, b) {
    //debugger;
    return b.x - a.x;
  }
  function getFADLAD(el) {
    // body...
    var el = el.measures;
    el.end = el.start.y - el.h;
    let FAD = head.zero.y - el.start.y;
    let LAD = head.zero.y - el.end;
    if (FAD < 0) debugger;
    //debugger;
    return { FAD: FAD.toFixed(2), LAD: LAD.toFixed(2) };
  }
}

// path:      an SVG <path> element
// threshold: a 'close-enough' limit (ignore subdivisions with area less than this)
// segments:  (optional) how many segments to subdivisions to create at each level
// returns:   a new SVG <polygon> element
function pathToPolygonViaSubdivision(path, threshold, segments) {
  if (!threshold) threshold = 0.0001; // Get really, really close
  if (!segments) segments = 3; // 2 segments creates 0-area triangles

  let points = subdivide(ptWithLength(0), ptWithLength(path.getTotalLength()));

  for (let i = points.length; i--;) points[i] = [points[i].x, points[i].y];

  let doc = path.ownerDocument;
  let poly = doc.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  poly.setAttribute('points', points.join(' '));
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

module.exports = {
  prepareSVG
};
