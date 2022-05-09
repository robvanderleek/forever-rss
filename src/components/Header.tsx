import {Fragment} from "react";
import {Divider, IconButton, styled, Toolbar, Tooltip} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";
import logo from '../static/forever-rss-logo.svg';
import {version} from "../version";
import {Mode} from "../entities/Mode";

const Title = styled('span')({
    marginLeft: '12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '18px',
});

const AppTitle = styled(Title)({
    fontSize: '24px',
    fontFamily: 'Shojumaru, cursive',
    color: '#808ecd'
});

interface HeaderProps {
    mode: Mode;
    handleBack: () => void;
}

export default function Header(props: HeaderProps) {
    const {mode, handleBack} = props;
    const {feeds, selectedFeed, entries, selectedEntry} = useFeeds();

    const feedsHeader = () => {
        return (<Fragment>
            <Toolbar>
                <img src={logo} alt="logo" width={32} height={32} style={{borderRadius: '4px'}}/>
                <Tooltip title={`${version.revision}`}><AppTitle>Forever RSS</AppTitle></Tooltip>
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
        case Mode.Entries:
            return entriesHeader();
        case Mode.Content:
            return contentHeader();
        case Mode.Feeds:
        default:
            return feedsHeader();
    }
}