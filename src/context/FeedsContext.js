import {createContext, useContext, useEffect, useState} from "react";
import {apiFetch} from "../utils";
import {useAuth} from "./AuthContext";

const FeedsContext = createContext();

export function FeedsContextProvider({children}) {
    const [loading, setLoading] = useState(true);
    const [allFeeds, setAllFeeds] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState(-1);
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(-1);
    const {user} = useAuth();

    useEffect(() => {
        async function loadFeeds() {
            const feeds = await apiFetch('feeds', user);
            setAllFeeds(feeds);
            setLoading(false);
        }

        loadFeeds();
    }, [user]);

    useEffect(() => {
        async function loadEntries() {
            const json = await apiFetch('entries?url=' + encodeURIComponent(allFeeds[selectedFeed].url));
            setEntries(json.message);
            setLoading(false);
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