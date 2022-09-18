import {getInitials, parseValue} from "./utils";

test('get initials', () => {
   expect(getInitials('Rob van der Leek')).toBe('RL');
   expect(getInitials('Rob van der leek')).toBe('RL');
   expect(getInitials('rob van der leek')).toBe('RL');
   expect(getInitials('robvanderleek@gmail.com')).toBe('R');
})

test('parse value', () => {
   expect(parseValue('type', 'type="aap"')).toBe('aap');
   expect(parseValue('type', "type='aap'")).toBe('aap');
   expect(parseValue('type', '  type =    "aap" ')).toBe('aap');
})