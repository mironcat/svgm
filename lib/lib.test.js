const { sum, square} = require('./lib');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
test("2 во второй степени равно 4", () => {
    expect(square(2)).toBe(4);
});