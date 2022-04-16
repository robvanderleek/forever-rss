import {
    Avatar as MuiAvatar,
    List,
    ListItem as MuiListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    styled
} from "@mui/material";
import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./FeedsContext";
import {useEffect, useRef} from "react";
import {Area} from "./styles";
import {RssFeed} from "@mui/icons-material";

const ListItem = styled(MuiListItem)(props => ({
    color: props.active ? '#ac93d4' : 'none'
}));

const Avatar = styled(MuiAvatar)(props => ({
    width: '24px',
    height: '24px',
    backgroundColor: props.active ? '#ac93d4' : 'none'
}));

export default function Feeds(props) {
    const {active} = props;
    const {allFeeds, selectedFeed, setSelectedFeed} = useFeeds();
    const refDiv = useRef(null);

    const refUp = useHotkeys('up', () => {
        if (selectedFeed > 0) {
            setSelectedFeed(selectedFeed - 1);
        }
    }, [selectedFeed]);

    const refDown = useHotkeys('down', () => {
        if (selectedFeed < allFeeds.length - 1) {
            setSelectedFeed(selectedFeed + 1);
        }
    }, [selectedFeed, allFeeds]);

    useEffect(() => {
        refUp.current = refDiv.current;
        refDown.current = refDiv.current;
        if (active) {
            refDiv.current.focus();
        }
    }, [active, refUp, refDown]);

    function getFeed(entry, index) {
        return (
            <ListItem key={index} active={+(selectedFeed === index)}>
                <ListItemButton selected={selectedFeed === index} onClick={() => setSelectedFeed(index)}>
                    <ListItemAvatar>
                        <Avatar active={+(selectedFeed === index)}>
                            <RssFeed fontSize="inherit"/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={entry.title}/>
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <Area tabIndex={-1} ref={refDiv}>
            <List dense={true}>
                {allFeeds.map((e, i) => getFeed(e, i))}
            </List>
        </Area>
    );
}
