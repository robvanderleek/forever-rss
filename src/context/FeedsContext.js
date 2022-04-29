import {createContext, useContext, useEffect, useState} from "react";
import {apiFetch} from "../utils";
import {useAuth} from "./AuthContext";
import {useMediaQuery} from "@mui/material";

const FeedsContext = createContext();

export const modeLoading = Symbol('loading');
export const modeFeeds = Symbol('feeds');
export const modeEntries = Symbol('entries');
export const modeContent = Symbol('content');

export function FeedsContextProvider({children}) {
    const [loading, setLoading] = useState(true);
    const [feeds, setFeeds] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState(-1);
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(-1);
    const {user} = useAuth();
    const wideScreen = useMediaQuery('(min-width:900px)');

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

    const mode = () => {
        if (loading) {
            return modeLoading;
        } else if (selectedFeed >= 0) {
            if (selectedEntry >= 0 && !wideScreen) {
                return modeContent;
            } else {
                return modeEntries;
            }
        } else {
            return modeFeeds;
        }
    }

    return (<FeedsContext.Provider value={{
        mode, feeds, entries, selectedFeed, setSelectedFeed, selectedEntry, setSelectedEntry
    }}>{children}</FeedsContext.Provider>)
}

export function useFeeds() {
    return useContext(FeedsContext);
}