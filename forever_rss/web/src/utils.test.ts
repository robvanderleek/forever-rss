import {getInitials, parseValue, unescapeMarkdown} from "./utils";

test('get initials', () => {
    expect(getInitials('Rob van der Leek')).toBe('RL');
    expect(getInitials('Rob van der leek')).toBe('RL');
    expect(getInitials('rob van der leek')).toBe('RL');
    expect(getInitials('robvanderleek@gmail.com')).toBe('R');
});

test('parse value', () => {
    expect(parseValue('type', 'type="aap"')).toBe('aap');
    expect(parseValue('type', "type='aap'")).toBe('aap');
    expect(parseValue('type', '  type =    "aap" ')).toBe('aap');
});

test('unescape markdown', () => {
    expect(unescapeMarkdown('\\# STAGE 1:')).toBe('# STAGE 1:');

    const code = '1\\. Use minimal base images\n\n2\\. Use multistage builds\n\n';
    const expe = '1. Use minimal base images\n\n2. Use multistage builds\n\n';

    expect(unescapeMarkdown(code)).toBe(expe);

    expect(unescapeMarkdown('A backslash (`\\\\`)')).toBe('A backslash (`\\\\`)');
})