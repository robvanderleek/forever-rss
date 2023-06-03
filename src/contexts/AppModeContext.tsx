import React, {createContext, useContext, useState} from "react";
import {Mode} from "@/entities/Mode";
import {useHotkeys} from "react-hotkeys-hook";
import {useMediaQuery} from "@mui/material";
import {useFeeds} from "./FeedsContext";

interface AppModeContextValue {
    mode: Mode;
    setMode: Function;
    wideScreen: boolean;
    handleBack: Function;
    handleClick: Function;
}

const AppModeContext = createContext({} as AppModeContextValue);

interface AppModeContextProviderProps {
    children?: React.ReactNode;
}

export function AppModeContextProvider(props: AppModeContextProviderProps) {
    const [mode, setMode] = useState(Mode.Feeds);
    const {
        feeds,
        setSelectedFeed,
        entries,
        selectedEntry,
        setSelectedEntry,
        highlightedEntry,
        setHighlightedEntry,
        highlightedFeed,
        setHighlightedFeed,
        clearEntries
    } = useFeeds();
    const wideScreen = useMediaQuery('(min-width:900px)');

    useHotkeys('right', () => {
        switch (mode) {
            case Mode.Feeds:
                if (feeds.length > 0) {
                    handleClick(highlightedFeed);
                }
                break;
            case Mode.Entries:
                handleClick(highlightedEntry);
                setMode(Mode.Content);
                break;
            default:
        }
    }, [mode, highlightedFeed, highlightedEntry]);

    useHotkeys('up', () => {
        switch (mode) {
            case Mode.Feeds:
                if (highlightedFeed > 0) {
                    setHighlightedFeed(highlightedFeed - 1);
                }
                break;
            case Mode.Entries:
                if (highlightedEntry > 0) {
                    const previousEntry = highlightedEntry - 1;
                    setHighlightedEntry(previousEntry);
                    if (selectedEntry >= 0) {
                        setSelectedEntry(previousEntry);
                    }
                }
                break;
            default:
        }
    }, [mode, highlightedEntry, highlightedFeed, selectedEntry]);

    useHotkeys('down', (event) => {
        switch (mode) {
            case Mode.Feeds:
                if (highlightedFeed < feeds.length - 1) {
                    setHighlightedFeed(highlightedFeed + 1);
                }
                event.preventDefault();
                break;
            case Mode.Entries:
                if (highlightedEntry < entries.length - 1) {
                    const nextEntry = highlightedEntry + 1;
                    setHighlightedEntry(nextEntry);
                    if (selectedEntry >= 0) {
                        setSelectedEntry(nextEntry);
                    }
                }
                event.preventDefault();
                break;
            default:
        }
    }, [mode, highlightedFeed, feeds, highlightedEntry, selectedEntry, entries]);

    const handleBack = () => {
        switch (mode) {
            case Mode.Feeds:
            default:
                break;
            case Mode.Entries:
                clearEntries();
                setSelectedFeed(-1);
                setHighlightedEntry(0);
                setMode(Mode.Feeds);
                break;
            case Mode.Content:
                setMode(Mode.Entries);
                break;
        }
    }

    useHotkeys('left', () => {
        handleBack();
    }, [mode]);

    const handleClick = (index: number) => {
        switch (mode) {
            case Mode.Feeds:
                setHighlightedFeed(index);
                setSelectedFeed(index);
                setSelectedEntry(0);
                setMode(Mode.Entries);
                break;
            default:
                setHighlightedEntry(index);
                setSelectedEntry(index);
                if (!wideScreen) {
                    setMode(Mode.Content);
                }
                break;

        }
    }

    return (<AppModeContext.Provider value={{
        mode, setMode, wideScreen, handleBack, handleClick
    }}>{props.children}</AppModeContext.Provider>)
}

export function useAppMode() {
    return useContext(AppModeContext);
}