import {List, ListItem as MuiListItem, ListItemAvatar, ListItemButton, ListItemText, styled} from "@mui/material";
import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./FeedsContext";
import {useEffect, useRef} from "react";
import {Area, CenteredArea, ItemAvatar} from "./styles";
import {RssFeed} from "@mui/icons-material";
import Loader from "react-loaders";

const ListItem = styled(MuiListItem)(props => ({
    color: props.active ? '#808ecd' : 'none'
}));

export default function Feeds(props) {
    const {active} = props;
    const {feedsLoading, allFeeds, selectedFeed, setSelectedFeed} = useFeeds();
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

    function handleClick(index) {
        setSelectedFeed(index);
        refDiv.current.focus();
    }

    function getFeed(entry, index) {
        return (
            <ListItem key={index} active={+(selectedFeed === index)}>
                <ListItemButton selected={selectedFeed === index} onClick={() => handleClick(index)}>
                    <ListItemAvatar>
                        <ItemAvatar active={+(selectedFeed === index)}>
                            <RssFeed fontSize="inherit"/>
                        </ItemAvatar>
                    </ListItemAvatar>
                    <ListItemText primary={entry.title}/>
                </ListItemButton>
            </ListItem>
        );
    }

    if (feedsLoading) {
        return (
            <Area tabIndex={-1} ref={refDiv}>
                <CenteredArea>
                    <Loader type="line-scale-pulse-out"  active/>
                </CenteredArea>
            </Area>
        )
    } else {
        return (
            <Area tabIndex={-1} ref={refDiv}>
                <List dense={true}>
                    {allFeeds.map((e, i) => getFeed(e, i))}
                </List>
            </Area>
        );
    }
}
