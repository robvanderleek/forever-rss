import moment from "moment";

export function getInitials(name: string): string {
    name = name.trim()
    if (name.length <= 2) {
        return name
    }
    const wordLetters = name.split(/\s+/).map(w => w.charAt(0));
    let initials = wordLetters[0]
    if (wordLetters.length > 1) {
        initials += wordLetters[wordLetters.length - 1];
    }
    return initials.toUpperCase();
}

export function parseValue(key: string, s: string): string | undefined {
    const pattern = new RegExp(`${key}\\s*=\\s*['"](?<value>.*?)['"]`, 'i');
    const match = pattern.exec(s);
    return match?.groups?.value;
}

export function unescapeMarkdown(markdown: string): string {
    return markdown.replaceAll(/\\([^\\])/g, '$1').replaceAll(/\\/g, '\\\\');
}

export function formatDate(dateString: string): string {
    const date = moment(dateString);
    return date.format('MMM Do YYYY');
}