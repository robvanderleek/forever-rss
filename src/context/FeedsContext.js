import {createContext, useContext, useEffect, useState} from "react";
import {apiFetch} from "../utils";
import {useAuth} from "./AuthContext";

const FeedsContext = createContext();

export function FeedsContextProvider({children}) {
    const [loading, setLoading] = useState(true);
    const [feeds, setFeeds] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState(-1);
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(-1);
    const {user} = useAuth();

    useEffect(() => {
        async function loadFeeds() {
            const fetchedFeeds = await apiFetch('feeds', user);
            setFeeds(fetchedFeeds);
            setLoading(false);
        }

        loadFeeds();
    }, [user]);

    useEffect(() => {
        async function loadEntries() {
            const json = await apiFetch('entries?url=' + encodeURIComponent(feeds[selectedFeed].url));
            setEntries(json.message);
            setLoading(false);
        }

        if (feeds.length > 0 && selectedFeed >= 0) {
            setLoading(true);
            loadEntries();
        }
    }, [feeds, selectedFeed]);

    return (<FeedsContext.Provider value={{
        loading, feeds, entries, selectedFeed, setSelectedFeed, selectedEntry, setSelectedEntry
    }}>{children}</FeedsContext.Provider>)
}

export function useFeeds() {
    return useContext(FeedsContext);
}