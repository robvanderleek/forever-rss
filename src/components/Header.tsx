import {Fragment, useState} from "react";
import {Avatar, Divider, IconButton, Menu, MenuItem, styled, Toolbar, Tooltip} from "@mui/material";
import {AccountBox, ArrowBack} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";
import logo from '../static/forever-rss-logo.svg';
import {version} from "../version";
import {Mode} from "../entities/Mode";
import {useAuth} from "../contexts/AuthContext";
import {getInitials} from "../utils";

const Title = styled('span')({
    marginLeft: '12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontFamily: 'Roboto, sans-serif'
});

const HeaderToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

const LogoImg = styled('img')`
  border-radius: 4px;
  margin-left: 16px;
  margin-right: 16px;
`;

interface HeaderProps {
    mode: Mode;
    handleBack: () => void;
}

export default function Header(props: HeaderProps) {
    const {mode, handleBack} = props;
    const {feeds, selectedFeed, entries, selectedEntry} = useFeeds();
    const {isAuthenticated, authenticate, logout, getUserFullName, getAvatarUrl} = useAuth();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const open = Boolean(anchor);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
    const handleClose = () => setAnchor(null);

    const avatar = () => {
        if (isAuthenticated) {
            const avatarUrl = getAvatarUrl();
            if (avatarUrl) {
                return (<Avatar src={avatarUrl}/>);
            } else {
                return (<Avatar>{getInitials(getUserFullName())}</Avatar>);
            }
        } else {
            return (<AccountBox fontSize="large"/>);
        }
    }

    const feedsHeader = () => {
        return (<Fragment>
            <HeaderToolbar disableGutters>
                <Tooltip title={`Forever RSS version ${version.revision}`}>
                    <LogoImg src={logo} alt="logo" width={32} height={32}/>
                </Tooltip>
                <IconButton onClick={handleClick} color={isAuthenticated ? "secondary" : "primary"}>
                    {avatar()}
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