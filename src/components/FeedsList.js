import {
    Badge,
    IconButton,
    List,
    ListItem as MuiListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    styled
} from "@mui/material";
import {ItemAvatar} from "../styles";
import {Delete, RssFeed} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";

const ListItem = styled(MuiListItem)(props => ({
    color: props.active ? '#808ecd' : 'none'
}));

export default function FeedsList(props) {
    const {highlightedFeed, handleClick} = props;
    const {feeds, selectedFeed, deleteFeed} = useFeeds();

    const deleteAction = (uuid) => {
        return (
            <IconButton onClick={() => deleteFeed(uuid)}>
                <Delete/>
            </IconButton>
        )
    }

    function getFeed(feed, index) {
        return (
            <ListItem key={index} active={+(highlightedFeed === index)} secondaryAction={deleteAction(feed.uuid)}>
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
        <List dense={true}>
            {feeds.map((e, i) => getFeed(e, i))}
        </List>
    )
}