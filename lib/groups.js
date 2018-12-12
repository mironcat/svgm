'use strict';
import { getLabels } from './measures';
function getGroups(SVG) {
    /**
     * iteration and check path, rects and lines for scalebar label
     * then calculate scalefactor and return parent group for 
     * each scalebar.
     * @SVG - svg.js instance
     */
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

}
function scalebarIteration(items) {
    /**
     * Iteration through potencial scalebar elements "items" (path, rects and lines) 
     * and calulate scalefactor by scalebarFinder
     */
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

export { getGroups };