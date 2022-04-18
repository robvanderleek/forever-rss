import {createContext, useContext, useEffect, useState} from "react";

const FeedsContext = createContext();

export function FeedsContextProvider({children}) {
    const [feedsLoading, setFeedsLoading] = useState(true);
    const [allFeeds, setAllFeeds] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState(0);
    const [entriesLoading, setEntriesLoading] = useState(false);
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(0);

    useEffect(() => {
        async function loadFeeds() {
            const res = await fetch('/.netlify/functions/feeds');
            if (res.ok) {
                const feeds = await res.json();
                setAllFeeds(feeds);
                setFeedsLoading(false);
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
                setSelectedEntry(0);
                setEntriesLoading(false);
            }
        }

        if (allFeeds.length > 0) {
            setEntriesLoading(true);
            loadEntries();
        }
    }, [allFeeds, selectedFeed]);

    return (<FeedsContext.Provider value={{
        feedsLoading, allFeeds, entries, selectedFeed, setSelectedFeed, entriesLoading, selectedEntry, setSelectedEntry
    }}>{children}</FeedsContext.Provider>)
}

export function useFeeds() {
    return useContext(FeedsContext);
}