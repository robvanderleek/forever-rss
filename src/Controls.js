import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./context/FeedsContext";
import {Fragment, useEffect, useRef, useState} from "react";
import {Area, CenteredArea, ContentArea} from "./styles";
import Loader from "react-loaders";
import FeedsList from "./components/FeedsList";
import EntriesList from "./components/EntriesList";
import {Button, Divider, IconButton, styled, Toolbar} from "@mui/material";
import {ArrowBack, Article, RssFeed} from "@mui/icons-material";
import Content from "./Content";
import {useAuth} from "./context/AuthContext";
import {useSwipeable} from "react-swipeable";

export default function Controls(props) {
    const {active, showContent = false} = props;
    const {loading, allFeeds, selectedFeed, setSelectedFeed, entries, selectedEntry, setSelectedEntry} = useFeeds();
    const {isAuthenticated, authenticate, logout} = useAuth();
    const [highlightedFeed, setHighlightedFeed] = useState(0);
    const [highlightedEntry, setHighlightedEntry] = useState(0);
    const refDiv = useRef(null);
    const modeLoading = Symbol('loading');
    const modeFeeds = Symbol('feeds');
    const modeEntries = Symbol('entries');
    const modeContent = Symbol('content');

    const mode = () => {
        if (loading) {
            return modeLoading;
        } else if (selectedFeed >= 0) {
            if (selectedEntry >= 0 && showContent) {
                return modeContent;
            } else {
                return modeEntries;
            }
        } else {
            return modeFeeds;
        }
    }

    const gotoFeeds = () => {
        setHighlightedFeed(0);
        setSelectedFeed(-1);
    }

    const gotoEntries = () => {
        setHighlightedEntry(0);
        setSelectedEntry(-1);
    }

    const handleBack = () => {
        switch (mode()) {
            case modeContent:
                gotoEntries();
                break;
            case modeEntries:
                gotoFeeds();
                break;
            default:
        }
    }

    const handlers = useSwipeable({ onSwipedRight: handleBack });

    const refUp = useHotkeys('up', () => {
        switch (mode()) {
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
        switch (mode()) {
            case modeEntries:
                if (highlightedEntry < entries.length - 1) {
                    setHighlightedEntry(highlightedEntry + 1);
                }
                break;
            case modeFeeds:
                if (highlightedFeed < allFeeds.length - 1) {
                    setHighlightedFeed(highlightedFeed + 1);
                }
                break;
            default:
        }
    }, [highlightedFeed, allFeeds, highlightedEntry, entries]);

    const refLeft = useHotkeys('left', () => {
        switch (mode()) {
            case modeEntries:
                gotoFeeds();
                break;
            case modeContent:
                gotoEntries();
                break;
            default:
        }
    }, [selectedFeed, selectedEntry, highlightedFeed, highlightedEntry]);

    const refEnter = useHotkeys('enter', () => {
        switch (mode()) {
            case modeFeeds:
                setSelectedFeed(highlightedFeed);
                break;
            case modeEntries:
                setSelectedEntry(highlightedEntry);
                break;
            default:
        }
    }, [highlightedFeed, highlightedEntry]);

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
        refDiv.current.focus();
    }

    function handleEntriesClick(index) {
        setSelectedEntry(index);
        refDiv.current.focus();
    }

    const FeedTitle = styled('div')({
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    });

    function getHeader() {
        switch (mode()) {
            case modeFeeds:
                return (<Fragment>
                    <Toolbar>
                        <RssFeed fontSize="medium"/>
                    </Toolbar>
                    <Divider/>
                </Fragment>);
            case modeEntries:
                return (<Fragment>
                    <Toolbar>
                        <IconButton onClick={handleBack}>
                            <ArrowBack fontSize="medium"/>
                        </IconButton>
                        <FeedTitle>
                            <RssFeed fontSize="medium"/>
                            <span style={{marginLeft: '10px'}}>{allFeeds[selectedFeed].title}</span>
                        </FeedTitle>
                    </Toolbar>
                    <Divider/>
                </Fragment>);
            case modeContent:
                return (<Fragment>
                    <Toolbar>
                        <IconButton onClick={handleBack}>
                            <ArrowBack fontSize="medium"/>
                        </IconButton>
                        <FeedTitle>
                            <Article fontSize="medium"/>
                            <span style={{marginLeft: '10px'}}>{entries[selectedEntry].title}</span>
                        </FeedTitle>
                    </Toolbar>
                    <Divider/>
                </Fragment>);
            default:
        }
    }

    function getContent() {
        switch (mode()) {
            default:
            case modeLoading:
                return (<CenteredArea>
                    <Loader type="line-scale-pulse-out" active/>
                </CenteredArea>);
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
        {getHeader()}
        {getContent()}
        {getFooter()}
    </Area>);
}
