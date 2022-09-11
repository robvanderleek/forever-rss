export const getInitials = (name: string) => {
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