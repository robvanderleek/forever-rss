import {formatDate} from "./EntriesList";

test('format date', () => {
    expect(formatDate('Sun, 19 Apr 2020 12:00:00 GMT')).toBe('Apr 19th 2020');
});