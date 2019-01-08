/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';
function getResults(gi, filename) {
    let results = [];
    gi.forEach((groupitem) => {
        const rows = prepareItemGroup(groupitem); // подготовка для таблицы
        results = results.concat(rows);
    });
    return results.map(addFileName);
    function addFileName(row, index, results) {
        row.filename = filename;
        return (results[index] = row);
    }
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
};
export { getResults };