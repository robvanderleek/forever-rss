import React, {createContext, useContext, useEffect, useState} from "react";
import {apiFetch} from "../utils";
import {useAuth} from "./AuthContext";
import {Feed} from "../entities/Feed";
import {Entry} from "../entities/Entry";

interface FeedsContextValue {
    loading: boolean;
    feeds: Array<Feed>;
    selectedFeed: number;
    setSelectedFeed: Function;
    entries: Array<Entry>;
    selectedEntry: number;
    setSelectedEntry: Function;
    highlightedFeed: number;
    setHighlightedFeed: Function;
    highlightedEntry: number;
    setHighlightedEntry: Function;
}

const FeedsContext = createContext({} as FeedsContextValue);

interface FeedsContextProviderProps {
    children?: React.ReactNode;
}

export function FeedsContextProvider(props: FeedsContextProviderProps) {
    const [loading, setLoading] = useState(true);
    const [feeds, setFeeds] = useState(Array<Feed>());
    const [selectedFeed, setSelectedFeed] = useState(-1);
    const [entries, setEntries] = useState(Array<Entry>());
    const [selectedEntry, setSelectedEntry] = useState(-1);
    const [highlightedFeed, setHighlightedFeed] = useState(0);
    const [highlightedEntry, setHighlightedEntry] = useState(0);
    const {user} = useAuth();

    useEffect(() => {
        async function loadFeeds() {
            const fetchedFeeds: Array<Feed> = await apiFetch('feeds', user);
            if (fetchedFeeds) {
                const sortedFeeds = fetchedFeeds.sort((a, b) => ('' + a.title).localeCompare(b.title));
                setFeeds(sortedFeeds);
            } else {
                setFeeds([]);
            }
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
        loading,
        feeds,
        entries,
        selectedFeed,
        setSelectedFeed,
        selectedEntry,
        setSelectedEntry,
        highlightedFeed,
        setHighlightedFeed,
        highlightedEntry,
        setHighlightedEntry
    }}>{props.children}</FeedsContext.Provider>)
}

export function useFeeds() {
    return useContext(FeedsContext);
}