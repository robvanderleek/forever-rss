import {createContext, useContext, useEffect, useState} from "react";

const FeedsContext = createContext();

export function FeedsContextProvider({children}) {
    const [loading, setLoading] = useState(true);
    const [allFeeds, setAllFeeds] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState(-1);
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(-1);

    useEffect(() => {
        async function loadFeeds() {
            const res = await fetch('/.netlify/functions/feeds');
            if (res.ok) {
                const feeds = await res.json();
                setAllFeeds(feeds);
                setLoading(false);
            }
        }

        loadFeeds();
    }, []);

    useEffect(() => {
        async function loadEntries() {
            const res = await fetch('/.netlify/functions/entries?url=' + encodeURIComponent(allFeeds[selectedFeed].url));
            if (res.ok) {
                const json = await res.json();
                setEntries(json.message);
                setLoading(false);
            }
        }

        if (allFeeds.length > 0 && selectedFeed >= 0) {
            setLoading(true);
            loadEntries();
        }
    }, [allFeeds, selectedFeed]);

    return (<FeedsContext.Provider value={{
        loading, allFeeds, entries, selectedFeed, setSelectedFeed, selectedEntry, setSelectedEntry
    }}>{children}</FeedsContext.Provider>)
}

export function useFeeds() {
    return useContext(FeedsContext);
}