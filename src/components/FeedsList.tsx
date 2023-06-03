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
import {FeedItem, ItemAvatar} from "@/styles";
import {MoreVert, RssFeed} from "@mui/icons-material";
import {useFeeds} from "@/contexts/FeedsContext";
import React, {useState} from "react";
import {useAppMode} from "@/contexts/AppModeContext";
import {useAuth} from "@/contexts/AuthContext";
import {Feed} from "@/entities/Feed";


export default function FeedsList() {
    const {feeds, highlightedFeed, deleteFeed} = useFeeds();
    const {handleClick} = useAppMode();
    const [editMenuAnchor, setEditMenuAnchor] = useState<Element | undefined>(undefined);
    const feedContextMenuOpen = Boolean(editMenuAnchor);
    const [contextMenuFeed, setContextMenuFeed] = useState<Feed | undefined>(undefined);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const {isAuthenticated} = useAuth();


    const handleConfirmationDialogCancel = () => setConfirmationDialogOpen(false);

    const handleConfirmationDialogOK = async () => {
        setConfirmationDialogOpen(false);
        if (contextMenuFeed) {
            await deleteFeed(contextMenuFeed.id);
        }
    }

    const feedContextMenu = (feed: Feed) => {

        const handleClose = () => {
            setEditMenuAnchor(undefined);
        }

        const handleClickDelete = () => {
            handleClose();
            setConfirmationDialogOpen(true);
        }

        if (isAuthenticated) {
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
            );
        } else {
            return null;
        }
    }

    const renderFeed = (feed: Feed, index: number) => {
        const badgeCount = getBadgeCount(feed);
        return (
            <FeedItem key={index} active={highlightedFeed === index ? 'true' : 'false'} secondaryAction={feedContextMenu(feed)}
                      disablePadding>
                <ListItemButton selected={highlightedFeed === index} onClick={() => handleClick(index)}
                                autoFocus={highlightedFeed === index}>
                    <ListItemAvatar>
                        <Badge badgeContent={badgeCount} color="primary" variant="dot">
                            <ItemAvatar variant="square" active={highlightedFeed === index ? 'true' : 'false'}>
                                <RssFeed fontSize="inherit"/>
                            </ItemAvatar>
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={feed.title}/>
                </ListItemButton>
            </FeedItem>
        );
    }

    const getBadgeCount = (feed: Feed) => {
        if (feed.latestUpdate) {
            if (feed.userAccessTime) {
                return feed.userAccessTime.getTime() > feed.latestUpdate.getTime() ? 0 : 1;
            } else {
                return 1;
            }
        } else if (feed.userAccessTime) {
            return 0;
        }
        return 1;
    }

    return (
        <>
            <List dense={false}>
                {feeds.map((e, i) => renderFeed(e, i))}
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
        </>
    )
}