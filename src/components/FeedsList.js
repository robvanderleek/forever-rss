import {
    Badge,
    List,
    ListItem as MuiListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    styled
} from "@mui/material";
import {ItemAvatar} from "../styles";
import {RssFeed} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";

const ListItem = styled(MuiListItem)(props => ({
    color: props.active ? '#808ecd' : 'none'
}));

export default function FeedsList(props) {
    const {highlightedFeed, handleClick} = props;
    const {feeds, selectedFeed} = useFeeds();

    function getFeed(entry, index) {
        return (
            <ListItem key={index} active={+(highlightedFeed === index)}>
                <ListItemButton selected={highlightedFeed === index} onClick={() => handleClick(index)}>
                    <ListItemAvatar>
                        <Badge badgeContent={1} color="secondary" variant="dot">
                            <ItemAvatar active={+(selectedFeed === index)}>
                                <RssFeed fontSize="inherit"/>
                            </ItemAvatar>
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={entry.title}/>
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