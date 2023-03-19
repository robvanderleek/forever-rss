import {
    Badge,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem
} from "@mui/material";
import {FeedItem, ItemAvatar} from "../styles";
import {MoreVert, RssFeed} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";
import React, {Fragment, useState} from "react";
import {useAppMode} from "../contexts/AppModeContext";


export default function FeedsList() {
    const {feeds, highlightedFeed, deleteFeed} = useFeeds();
    const {handleClick} = useAppMode();
    const [editMenuAnchor, setEditMenuAnchor] = useState(undefined);
    const feedContextMenuOpen = Boolean(editMenuAnchor);
    const [contextMenuFeed, setContextMenuFeed] = useState(undefined);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const handleConfirmationDialogCancel = () => setConfirmationDialogOpen(false);

    const handleConfirmationDialogOK = () => {
        setConfirmationDialogOpen(false);
        deleteFeed(contextMenuFeed.uuid);
    }

    const feedContextMenu = (feed) => {

        const handleClose = () => {
            setEditMenuAnchor(null);
        }

        const handleClickDelete = () => {
            handleClose();
            setConfirmationDialogOpen(true);
        }

        return (
            <div>
                <IconButton onClick={(e) => {
                    setEditMenuAnchor(e.currentTarget);
                    setContextMenuFeed(feed);
                }}>
                    <MoreVert/>
                </IconButton>
                <Menu anchorEl={editMenuAnchor} open={feedContextMenuOpen} onClose={handleClose}>
                    <MenuItem onClick={handleClickDelete}>
                        Delete
                    </MenuItem>
                </Menu>
            </div>
        )
    }

    function getFeed(feed, index) {
        return (
            <FeedItem key={index} active={+(highlightedFeed === index)} secondaryAction={feedContextMenu(feed)}
                      disablePadding>
                <ListItemButton selected={highlightedFeed === index} onClick={() => handleClick(index)}
                                autoFocus={highlightedFeed === index}>
                    <ListItemAvatar>
                        <Badge badgeContent={1} color="primary" variant="dot">
                            <ItemAvatar active={+(highlightedFeed === index)}>
                                <RssFeed fontSize="inherit"/>
                            </ItemAvatar>
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={feed.title}/>
                </ListItemButton>
            </FeedItem>
        );
    }

    return (
        <Fragment>
            <List dense={false}>
                {feeds.map((e, i) => getFeed(e, i))}
            </List>
            <Dialog open={confirmationDialogOpen} onClose={handleConfirmationDialogCancel}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Delete feed {contextMenuFeed?.title}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationDialogCancel} autoFocus>Cancel</Button>
                    <Button onClick={handleConfirmationDialogOK}>OK</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}