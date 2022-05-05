import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./contexts/FeedsContext";
import {Fragment, useEffect, useRef, useState} from "react";
import {Area} from "./styles";
import {Button, Divider, Toolbar, useMediaQuery} from "@mui/material";
import {RssFeed} from "@mui/icons-material";
import ControlsContent from "./ControlsContent";
import {useAuth} from "./contexts/AuthContext";
import {useSwipeable} from "react-swipeable";
import Header from "./Header";
import {Mode} from "./entities/Mode";

export default function Controls(props) {
    const {active} = props;
    const {feeds, selectedFeed, setSelectedFeed, entries, selectedEntry, setSelectedEntry} = useFeeds();
    const {isAuthenticated, authenticate, logout} = useAuth();
    const [highlightedFeed, setHighlightedFeed] = useState(0);
    const [highlightedEntry, setHighlightedEntry] = useState(0);
    const refDiv = useRef(null);
    const [mode, setMode] = useState(Mode.Feeds);
    const wideScreen = useMediaQuery('(min-width:900px)');

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
        }
    }

    const handlers = useSwipeable({onSwipedRight: handleBack});

    const refUp = useHotkeys('up', () => {
        switch (mode) {
            case Mode.Entries:
                if (highlightedEntry > 0) {
                    setHighlightedEntry(highlightedEntry - 1);
                }
                break;
            case Mode.Feeds:
                if (highlightedFeed > 0) {
                    setHighlightedFeed(highlightedFeed - 1);
                }
                break;
            default:
        }
    }, [highlightedEntry, highlightedFeed]);

    const refDown = useHotkeys('down', () => {
        switch (mode) {
            case Mode.Entries:
                if (highlightedEntry < entries.length - 1) {
                    setHighlightedEntry(highlightedEntry + 1);
                }
                break;
            case Mode.Feeds:
                if (highlightedFeed < feeds.length - 1) {
                    setHighlightedFeed(highlightedFeed + 1);
                }
                break;
            default:
        }
    }, [mode, highlightedFeed, feeds, highlightedEntry, entries]);

    const refLeft = useHotkeys('left', () => {
        handleBack();
    }, [mode]);

    const refEnter = useHotkeys('enter', () => {
        switch (mode) {
            case Mode.Feeds:
                setSelectedFeed(highlightedFeed);
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
    }, [mode, highlightedFeed, selectedFeed, highlightedEntry, selectedEntry]);

    useEffect(() => {
        refUp.current = refDiv.current;
        refDown.current = refDiv.current;
        refLeft.current = refDiv.current;
        refEnter.current = refDiv.current;
        if (active && refDiv.current) {
            refDiv.current.focus();
        }
    }, [active, refDiv, refUp, refDown, refLeft, refEnter]);

    const refPassthrough = (el) => {
        handlers.ref(el);
        refDiv.current = el;
    }

    function handleFeedsClick(index) {
        setSelectedFeed(index);
        setHighlightedFeed(index);
        setMode(Mode.Entries);
        refDiv.current.focus();
    }

    function handleEntriesClick(index) {
        setSelectedEntry(index);
        setHighlightedEntry(index)
        if (!wideScreen) {
            setMode(Mode.Content);
        }
        refDiv.current.focus();
    }

    function getFooter() {
        return (<Fragment>
            <Divider/>
            <Toolbar>
                <RssFeed fontSize="medium"/>
                {!isAuthenticated && <Button onClick={() => authenticate()}>Login</Button>}
                {isAuthenticated && <Button onClick={() => logout()}>Logout</Button>}
            </Toolbar>
        </Fragment>);
    }

    return (<Area tabIndex={-1} ref={refPassthrough}>
            <Header mode={mode} handleBack={handleBack}/>
            <ControlsContent mode={mode} highlightedFeed={highlightedFeed} handleFeedsClick={handleFeedsClick}
                             highlightedEntry={highlightedEntry} handleEntriesClick={handleEntriesClick}/>
            {getFooter()}
        </Area>
    );
}
