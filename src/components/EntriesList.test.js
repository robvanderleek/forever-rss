import {formatDate} from "./EntriesList";

test('format date', () => {
    expect(formatDate('Sun, 19 Apr 2020 23:56:03 GMT')).toBe('Apr 20th 2020');
});