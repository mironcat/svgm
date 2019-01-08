/**
 * svgm
 * https://github.com/mironcat/svgm
 *
 * Copyright (c) 2018 mironcat
 * Licensed under the MIT license.
 */
'use strict';
import { getProps } from './itemprops';
function getGroupItems(groups) {
    const gi =[];
    groups.forEach((groupitem, i) => {
        gi.push(getItems(groupitem));
    });
    return gi;
};
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
        var el = getProps(item, groupitem.scalefactor, SVG);
        if (el != "scalebar" && items.elements[el.type])
            items.elements[el.type].push(el);
    });

    return items;
}


export { getGroupItems };