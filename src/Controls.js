import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./FeedsContext";
import {useEffect, useRef, useState} from "react";
import {Area, CenteredArea} from "./styles";
import Loader from "react-loaders";
import FeedsList from "./components/FeedsList";
import EntriesList from "./components/EntriesList";

export default function Controls(props) {
    const {active} = props;
    const {loading, allFeeds, selectedFeed, setSelectedFeed, entries, selectedEntry, setSelectedEntry} = useFeeds();
    const [highlightedFeed, setHighlightedFeed] = useState(0);
    const refDiv = useRef(null);

    const entriesMode = () => selectedFeed >= 0;

    const refUp = useHotkeys('up', () => {
        if (entriesMode()) {
            if (selectedEntry > 0) {
                setSelectedEntry(selectedEntry - 1);
            }
        } else {
            if (highlightedFeed > 0) {
                setHighlightedFeed(highlightedFeed - 1);
            }
        }
    }, [highlightedFeed, selectedEntry]);

    const refDown = useHotkeys('down', () => {
        if (entriesMode()) {
            if (selectedEntry < entries.length - 1) {
                setSelectedEntry(selectedEntry + 1);
            }
        } else {
            if (highlightedFeed < allFeeds.length - 1) {
                setHighlightedFeed(highlightedFeed + 1);
            }
        }
    }, [highlightedFeed, allFeeds, selectedEntry, entries]);

    const refLeft = useHotkeys('left', () => {
        if (entriesMode()) {
            setSelectedFeed(-1);
        }
    }, [selectedFeed]);

    const refEnter = useHotkeys('enter', () => {
        if (!entriesMode()) {
            setSelectedFeed(highlightedFeed);
        }
    }, [highlightedFeed]);

    useEffect(() => {
        refUp.current = refDiv.current;
        refDown.current = refDiv.current;
        refLeft.current = refDiv.current;
        refEnter.current = refDiv.current;
        if (active) {
            refDiv.current.focus();
        }
    }, [active, refUp, refDown, refLeft, refEnter]);

    function handleFeedsClick(index) {
        setSelectedFeed(index);
        setHighlightedFeed(index);
        refDiv.current.focus();
    }

    function handleEntriesClick(index) {
        setSelectedEntry(index);
        refDiv.current.focus();
    }

    function getContent() {
        if (loading) {
            return (
                <CenteredArea>
                    <Loader type="line-scale-pulse-out" active/>
                </CenteredArea>
            );
        } else if (selectedFeed >= 0) {
            return (
                <EntriesList handleClick={handleEntriesClick}/>
            );
        } else {
            return (
                <FeedsList highlightedFeed={highlightedFeed} handleClick={handleFeedsClick}/>
            );
        }
    }

    return (
        <Area tabIndex={-1} ref={refDiv}>
            {getContent()}
        </Area>
    );
}
