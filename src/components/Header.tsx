import {Fragment, useState} from "react";
import {Divider, IconButton, Menu, MenuItem, styled, Toolbar, Tooltip} from "@mui/material";
import {AccountBox, ArrowBack} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";
import logo from '../static/forever-rss-logo.svg';
import {version} from "../version";
import {Mode} from "../entities/Mode";
import {useAuth} from "../contexts/AuthContext";

const Title = styled('span')({
    marginLeft: '12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontFamily: 'Roboto, sans-serif'
});

const HeaderToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between'
});

interface HeaderProps {
    mode: Mode;
    handleBack: () => void;
}

export default function Header(props: HeaderProps) {
    const {mode, handleBack} = props;
    const {feeds, selectedFeed, entries, selectedEntry} = useFeeds();
    const {isAuthenticated, authenticate, logout} = useAuth();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const open = Boolean(anchor);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
    const handleClose = () => setAnchor(null);
    const feedsHeader = () => {
        return (<Fragment>
            <HeaderToolbar>
                <Tooltip title={`Forever RSS version ${version.revision}`}>
                    <img src={logo} alt="logo" width={32} height={32} style={{borderRadius: '4px'}}/>
                </Tooltip>
                <IconButton onClick={handleClick}>
                    <AccountBox fontSize="large"/>
                </IconButton>
                <Menu open={open} anchorEl={anchor} onClick={handleClose} onClose={handleClose}>
                    {!isAuthenticated && <MenuItem onClick={() => authenticate()}>Login</MenuItem>}
                    {isAuthenticated && <MenuItem onClick={() => logout()}>Logout</MenuItem>}
                </Menu>
            </HeaderToolbar>
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