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
exports.getResults = getResults;

function getResults(gi, filename) {
  var results = [];
  gi.forEach(function (groupitem) {
    var rows = prepareItemGroup(groupitem); // подготовка для таблицы

    results = results.concat(rows);
  });
  return results.map(addFileName);

  function addFileName(row, index, results) {
    row.filename = filename;
    return results[index] = row;
  }
}

function prepareItemGroup(ItemGroup) {
  // body...
  //debugger;
  var elements = ItemGroup.elements;
  var head = {
    scalefactor: ItemGroup.scalefactor
  };
  var rows = []; //item	type	label	title	measurevalue	description	comments

  elements.text.forEach(function (text) {
    if (text.label === "name") head.name = text.measures.t;
    if (text.label === "comments" || text.label === "comment") head.comments = text.measures.t;
  });
  elements.image.forEach(function (image) {
    head.imagefilename = image.measures.file;
    head.imagefoldername = image.measures.folder;
  });

  if (!head.name) {
    head.name = head.imagefilename;
  }

  var rows = []; //debugger;
  //item	subgroup	type	label	title	measurevalue	description	comments

  elements.path.forEach(function (el) {
    rows = rows.concat(getRows(el));
  });
  elements.line.forEach(function (el) {
    rows = rows.concat(getRows(el));
  });
  elements.rect.forEach(function (el) {
    rows = rows.concat(getRows(el));
  });
  elements.ellipse.forEach(function (el) {
    rows = rows.concat(getRows(el));
  });
  elements.circle.forEach(function (el) {
    rows = rows.concat(getRows(el));
  });
  elements.g.forEach(function (el) {
    rows = rows.concat(getRows(el));
  }); //	debugger;

  return rows;

  function getRows(el) {
    // подготавливает объект element в формат Datatables
    var scalefactor = head.scalefactor;
    var arr = [];

    for (var mt in el.measures) {
      var prepvalue = el.measures[mt];
      if (typeof prepvalue === 'number' && prepvalue > 1) prepvalue = prepvalue.toFixed(2);
      var row = {
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

;
//# sourceMappingURL=prepres.js.map