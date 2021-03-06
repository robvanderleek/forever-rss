import React, {createContext, useContext, useState} from "react";
import {Mode} from "../entities/Mode";
import {useHotkeys} from "react-hotkeys-hook";
import {useMediaQuery} from "@mui/material";
import {useFeeds} from "./FeedsContext";

interface AppModeContextValue {
    activeSection: number;
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
    const [activeSection, setActiveSection] = useState(0);
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
        setHighlightedFeed
    } = useFeeds();
    const wideScreen = useMediaQuery('(min-width:900px)');

    useHotkeys('right', () => {
        if (activeSection < 1) {
            setActiveSection(activeSection + 1);
        }
    }, [activeSection]);

    useHotkeys('up', () => {
        switch (mode) {
            case Mode.Entries:
                if (highlightedEntry > 0) {
                    const previousEntry = highlightedEntry - 1;
                    setHighlightedEntry(previousEntry);
                    if (selectedEntry >= 0) {
                        setSelectedEntry(previousEntry);
                    }
                }
                break;
            case Mode.Feeds:
                if (highlightedFeed > 0) {
                    setHighlightedFeed(highlightedFeed - 1);
                }
                break;
            default:
        }
    }, [highlightedEntry, highlightedFeed, selectedEntry]);

    useHotkeys('down', () => {
        switch (mode) {
            case Mode.Entries:
                if (highlightedEntry < entries.length - 1) {
                    const nextEntry = highlightedEntry + 1;
                    setHighlightedEntry(nextEntry);
                    if (selectedEntry >= 0) {
                        setSelectedEntry(nextEntry);
                    }
                }
                break;
            case Mode.Feeds:
                if (highlightedFeed < feeds.length - 1) {
                    setHighlightedFeed(highlightedFeed + 1);
                }
                break;
            default:
        }
    }, [mode, highlightedFeed, feeds, highlightedEntry, selectedEntry, entries]);

    const handleBack = () => {
        switch (mode) {
            case Mode.Content:
                setMode(Mode.Entries);
                break;
            case Mode.Entries:
                setSelectedEntry(-1);
                setHighlightedEntry(0);
                setMode(Mode.Feeds);
                break;
            default:
                if (activeSection > 0) {
                    setActiveSection(activeSection - 1);
                }
        }
    }

    useHotkeys('left', () => {
        handleBack();
    }, [mode, activeSection]);

    const handleClick = () => {
        switch (mode) {
            case Mode.Feeds:
                setSelectedFeed(highlightedFeed);
                setSelectedEntry(-1);
                setMode(Mode.Entries);
                break;
            case Mode.Entries:
                setSelectedEntry(highlightedEntry);
                if (!wideScreen) {
                    setMode(Mode.Content);
                }
                break;
            default:
        }
    }

    return (<AppModeContext.Provider value={{
        activeSection, mode, setMode, wideScreen, handleBack, handleClick
    }}>{props.children}</AppModeContext.Provider>)
}

export function useAppMode() {
    return useContext(AppModeContext);
}