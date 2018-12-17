const m = require("../measures");

test("Дистанция между точками (0,0) - (0, 10) = 10", () => {
    const point1=[0,0];
    const point2 = [0, 10];
    expect(m.dist(point1,point2)).toBe(10);
});