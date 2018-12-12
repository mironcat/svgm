'use strict';
import { getProps } from './measures';
function getGroupItems(groups, SVG) {
    const gi =[];
    groups.forEach((groupitem, i) => {
        gi.push(getItems(groupitem, SVG));
    });
    return gi;
};
function getItems(groupitem,SVG) {
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