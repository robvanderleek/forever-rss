import React, {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "./AuthContext";
import {Feed} from "@/entities/Feed";
import {Entry} from "@/entities/Entry";

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
    saveFeed: (url: string) => Promise<Response>;
    deleteFeed: (uuid: string) => Promise<void>;
    clearEntries: () => void;
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
    const {isLoading, user, apiFetch, apiPost} = useAuth();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        async function loadFeeds() {
            const fetchedFeeds: Array<Feed> = await apiFetch('user-list-feeds', user);
            if (fetchedFeeds) {
                const sortedFeeds = fetchedFeeds.sort((a, b) => ('' + a.title).localeCompare(b.title));
                setFeeds(sortedFeeds);
            } else {
                setFeeds([]);
            }
            setLoading(false);
        }

        loadFeeds();
    }, [isLoading, user, apiFetch]);

    useEffect(() => {
        async function loadEntries() {
            const json = await apiFetch('entries?url=' + encodeURIComponent(feeds[selectedFeed].url), user);
            setEntries(json.message);
            setLoading(false);
        }

        if (feeds.length > 0 && selectedFeed >= 0) {
            setLoading(true);
            loadEntries();
        }
    }, [feeds, selectedFeed, user, apiFetch]);

    const saveFeed = async (url: string): Promise<Response> => {
        const response = await apiPost('user-add-feed', JSON.stringify({url: url}), user);
        if (response.ok) {
            const addedFeed = await response.json();
            const updatedFeeds = feeds.concat(addedFeed);
            const sortedFeeds = updatedFeeds.sort((a, b) => ('' + a.title).localeCompare(b.title));
            setFeeds(sortedFeeds);
        }
        return response;
    }

    const deleteFeed = async (uuid: string) => {
        setLoading(true);
        const res = await apiPost('user-delete-feed', JSON.stringify({uuid: uuid}), user);
        if (res) {
            feeds.splice(feeds.findIndex(f => f.uuid === uuid), 1);
            const newFeedsArray = feeds.map(x => x);
            setFeeds(newFeedsArray);
        }
        setLoading(false);
    }

    const clearEntries = () => {
        setSelectedEntry(-1);
        setEntries([]);
    }

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
        setHighlightedEntry,
        saveFeed,
        deleteFeed,
        clearEntries
    }}>{props.children}</FeedsContext.Provider>)
}

export function useFeeds() {
    return useContext(FeedsContext);
}