import {useFeeds} from "./contexts/FeedsContext";
import {Fragment, useState} from "react";
import {Area} from "./styles";
import {Button, Divider, Toolbar} from "@mui/material";
import {RssFeed} from "@mui/icons-material";
import ControlsContent from "./ControlsContent";
import {useAuth} from "./contexts/AuthContext";
import {useSwipeable} from "react-swipeable";
import Header from "./Header";
import {Mode} from "./entities/Mode";
import {useAppMode} from "./contexts/AppModeContext";

export default function Controls() {
    const {
        setSelectedFeed, setSelectedEntry, highlightedFeed, setHighlightedFeed, highlightedEntry, setHighlightedEntry
    } = useFeeds();
    const {isAuthenticated, authenticate, logout} = useAuth();
    const {mode, setMode, wideScreen, handleBack} = useAppMode();

    const handlers = useSwipeable({onSwipedRight: handleBack});

    const refPassthrough = (el) => {
        handlers.ref(el);
    }

    function handleFeedsClick(index) {
        setSelectedFeed(index);
        setHighlightedFeed(index);
        setMode(Mode.Entries);
    }

    function handleEntriesClick(index) {
        setSelectedEntry(index);
        setHighlightedEntry(index)
        if (!wideScreen) {
            setMode(Mode.Content);
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
        <ControlsContent mode={mode} highlightedFeed={highlightedFeed} handleFeedsClick={handleFeedsClick}
                         highlightedEntry={highlightedEntry} handleEntriesClick={handleEntriesClick}/>
        {getFooter()}
    </Area>);
}
