import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./context/FeedsContext";
import {Fragment, useEffect, useRef, useState} from "react";
import {Area, CenteredArea, ContentArea} from "./styles";
import Loader from "react-loaders";
import FeedsList from "./components/FeedsList";
import EntriesList from "./components/EntriesList";
import {Button, Divider, Toolbar} from "@mui/material";
import {RssFeed} from "@mui/icons-material";
import Content from "./Content";
import {useAuth} from "./context/AuthContext";
import {useSwipeable} from "react-swipeable";
import Header from "./Header";

export const modeFeeds = Symbol('feeds');
export const modeEntries = Symbol('entries');
export const modeContent = Symbol('content');

export default function Controls(props) {
    const {active} = props;
    const {loading, feeds, selectedFeed, setSelectedFeed, entries, selectedEntry, setSelectedEntry} = useFeeds();
    const {isAuthenticated, authenticate, logout} = useAuth();
    const [highlightedFeed, setHighlightedFeed] = useState(0);
    const [highlightedEntry, setHighlightedEntry] = useState(0);
    const refDiv = useRef(null);
    const [mode, setMode] = useState(modeFeeds);

    const handleBack = () => {
        switch (mode) {
            case modeContent:
                setMode(modeEntries);
                break;
            case modeEntries:
                setSelectedEntry(-1);
                setHighlightedEntry(0);
                setMode(modeFeeds);
                break;
            default:
        }
    }

    const handlers = useSwipeable({onSwipedRight: handleBack});

    const refUp = useHotkeys('up', () => {
        switch (mode) {
            case modeEntries:
                if (highlightedEntry > 0) {
                    setHighlightedEntry(highlightedEntry - 1);
                }
                break;
            case modeFeeds:
                if (highlightedFeed > 0) {
                    setHighlightedFeed(highlightedFeed - 1);
                }
                break;
            default:
        }
    }, [highlightedEntry, highlightedFeed]);

    const refDown = useHotkeys('down', () => {
        switch (mode) {
            case modeEntries:
                if (highlightedEntry < entries.length - 1) {
                    setHighlightedEntry(highlightedEntry + 1);
                }
                break;
            case modeFeeds:
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
            case modeFeeds:
                setSelectedFeed(highlightedFeed);
                setMode(modeEntries);
                break;
            case modeEntries:
                setSelectedEntry(highlightedEntry);
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
        setMode(modeEntries);
        refDiv.current.focus();
    }

    function handleEntriesClick(index) {
        setSelectedEntry(index);
        refDiv.current.focus();
    }


    function getContent() {
        if (loading) {
            return (<CenteredArea>
                <Loader type="line-scale-pulse-out" active/>
            </CenteredArea>);
        }
        switch (mode) {
            default:
            case modeFeeds:
                return (<ContentArea>
                    <FeedsList highlightedFeed={highlightedFeed} handleClick={handleFeedsClick}/>
                </ContentArea>);
            case modeEntries:
                return (<ContentArea>
                    <EntriesList highlightedEntry={highlightedEntry} handleClick={handleEntriesClick}/>
                </ContentArea>);
            case modeContent:
                return (<ContentArea>
                    <Content active={false}/>
                </ContentArea>)
        }
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
        {getContent()}
        {getFooter()}
    </Area>);
}