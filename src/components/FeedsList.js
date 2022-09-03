import {
    Badge,
    IconButton,
    List,
    ListItem as MuiListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    styled
} from "@mui/material";
import {ItemAvatar} from "../styles";
import {MoreVert, RssFeed} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";
import React, {useState} from "react";

const ListItem = styled(MuiListItem)(props => ({
    color: props.active ? '#808ecd' : 'none'
}));

export default function FeedsList(props) {
    const {highlightedFeed, handleClick} = props;
    const {feeds, selectedFeed, deleteFeed} = useFeeds();
    const [editMenuAnchor, setEditMenuAnchor] = useState(undefined);
    const open = Boolean(editMenuAnchor);

    const feedContextMenu = (uuid) => {
        const handleClose = () => {
            setEditMenuAnchor(null);
        }

        const handleClickDelete = () => {
            handleClose();
            deleteFeed(uuid);
        }

        return (
            <div>
                <IconButton onClick={(e) => setEditMenuAnchor(e.currentTarget)}>
                    <MoreVert/>
                </IconButton>
                <Menu anchorEl={editMenuAnchor} open={open} onClose={handleClose}>
                    <MenuItem onClick={handleClickDelete}>
                        Delete
                    </MenuItem>
                </Menu>
            </div>
        )
    }

    function getFeed(feed, index) {
        return (
            <ListItem key={index} active={+(highlightedFeed === index)} secondaryAction={feedContextMenu(feed.uuid)} disablePadding>
                <ListItemButton selected={highlightedFeed === index} onClick={() => handleClick(index)}
                                autoFocus={highlightedFeed === index}>
                    <ListItemAvatar>
                        <Badge badgeContent={1} color="secondary" variant="dot">
                            <ItemAvatar active={+(selectedFeed === index)}>
                                <RssFeed fontSize="inherit"/>
                            </ItemAvatar>
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={feed.title}/>
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <List dense={false}>
            {feeds.map((e, i) => getFeed(e, i))}
        </List>
    )
}