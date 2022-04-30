import {Fragment} from "react";
import {Divider, IconButton, styled, Toolbar} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useFeeds} from "./context/FeedsContext";
import logo from './static/forever-rss-logo.svg';
import {version} from "./version";
import {modeContent, modeEntries, modeFeeds} from "./Controls";

const Title = styled('span')({
    marginLeft: '12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '18px'
});

export default function Header(props) {
    const {mode, handleBack} = props;
    const {feeds, selectedFeed, entries, selectedEntry} = useFeeds();

    const feedsHeader = () => {
        return (<Fragment>
            <Toolbar>
                <img src={logo} alt="logo" width={32} height={32} style={{borderRadius: '4px'}}/>
                <Title>Forever RSS ({version.revision})</Title>
            </Toolbar>
            <Divider/>
        </Fragment>);
    }

    const entriesHeader = () => {
        return (<Fragment>
            <Toolbar>
                <IconButton onClick={handleBack}>
                    <ArrowBack fontSize="medium"/>
                </IconButton>
                <Title>{feeds[selectedFeed].title}</Title>
            </Toolbar>
            <Divider/>
        </Fragment>);
    }

    const contentHeader = () => {
        return (<Fragment>
            <Toolbar>
                <IconButton onClick={handleBack}>
                    <ArrowBack fontSize="medium"/>
                </IconButton>
                <Title>{entries[selectedEntry].title}</Title>
            </Toolbar>
            <Divider/>
        </Fragment>);
    }

    switch (mode) {
        case modeEntries:
            return entriesHeader();
        case modeContent:
            return contentHeader();
        case modeFeeds:
        default:
            return feedsHeader();
    }
}