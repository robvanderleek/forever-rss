import {createContext, useContext, useEffect, useState} from "react";

const FeedsContext = createContext();

export function FeedsContextProvider({children}) {
    const [allFeeds, setAllFeeds] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState(0);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const feeds = [
            {title: 'The Clean Code Blog', url: 'http://blog.cleancoder.com/atom.xml'},
            {title: 'RWieruch', url: 'https://www.robinwieruch.de/index.xml'}
        ];
        setAllFeeds(feeds);
    }, []);

    useEffect(() => {
        async function load() {
            const res = await fetch('/.netlify/functions/feed?url=' + encodeURIComponent(allFeeds[selectedFeed].url));
            if (res.ok) {
                const json = await res.json();
                setEntries(json.message);
            }
        }
        if (allFeeds.length > 0) {
            load();
        }
    }, [allFeeds, selectedFeed]);

    return (
        <FeedsContext.Provider value={{allFeeds, entries, selectedFeed, setSelectedFeed}}>{children}</FeedsContext.Provider>
    )
}

export function useFeeds() {
    return useContext(FeedsContext);
}