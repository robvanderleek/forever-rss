import React, {useState} from "react";
import {Avatar, Divider, IconButton, Link, Menu, MenuItem, Toolbar} from "@mui/material";
import {AccountBox, ArrowBack} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";
import {Mode} from "../entities/Mode";
import {getInitials} from "../utils";
import {HeaderToolbar, LogoImg, Title} from "../components/Header.style";
import {SwipeEventData} from "react-swipeable";
import {useAuth} from "../contexts/AuthContext";

interface HeaderProps {
    mode: Mode;
    handleBack: (_: SwipeEventData) => void;
}

export default function Header(props: HeaderProps) {
    const {mode, handleBack} = props;
    const {feeds, selectedFeed, entries, selectedEntry} = useFeeds();
    const {login, logout, isAuthenticated, user} = useAuth();
    const getUserFullName = () => '';
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const open = Boolean(anchor);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        if (!isAuthenticated) {
            login();
        } else {
            setAnchor(event.currentTarget);
        }
    }

    const handleMenuClose = () => setAnchor(null);

    const avatar = () => {
        if (isAuthenticated) {
            const avatarUrl = user?.avatarUrl;
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
        return (
            <>
                <HeaderToolbar disableGutters>
                    <Link href="/">
                        <LogoImg src="/forever-rss-logo.svg" alt="logo" width={32} height={32}/>
                    </Link>
                    <IconButton onClick={handleAvatarClick}>
                        {avatar()}
                    </IconButton>
                    <Menu open={open} anchorEl={anchor} onClick={handleMenuClose} onClose={handleMenuClose}>
                        {isAuthenticated && <MenuItem onClick={() => logout()}>Logout</MenuItem>}
                    </Menu>
                </HeaderToolbar>
                <Divider/>
            </>
        );
    }

    const entriesHeader = () => {
        return (
            <>
                <Toolbar>
                    <IconButton onClick={() => {
                        handleBack({} as SwipeEventData)
                    }}>
                        <ArrowBack fontSize="medium"/>
                    </IconButton>
                    <Title>{feeds[selectedFeed].title}</Title>
                </Toolbar>
                <Divider/>
            </>
        );
    }

    if (selectedFeed >= 0) {
        return entriesHeader();
    } else {
        return feedsHeader();
    }
}