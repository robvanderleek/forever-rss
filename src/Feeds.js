import {
    Badge,
    List,
    ListItem as MuiListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    styled
} from "@mui/material";
import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./FeedsContext";
import {useEffect, useRef, useState} from "react";
import {Area, CenteredArea, ItemAvatar} from "./styles";
import {RssFeed} from "@mui/icons-material";
import Loader from "react-loaders";
import Entries from "./Entries";

const ListItem = styled(MuiListItem)(props => ({
    color: props.active ? '#808ecd' : 'none'
}));

export default function Feeds(props) {
    const {active} = props;
    const {feedsLoading, allFeeds, selectedFeed, setSelectedFeed} = useFeeds();
    const [highlightedFeed, setHighlightedFeed] = useState(0);
    const refDiv = useRef(null);

    const refUp = useHotkeys('up', () => {
        if (highlightedFeed > 0) {
            setHighlightedFeed(highlightedFeed - 1);
        }
    }, [highlightedFeed]);

    const refDown = useHotkeys('down', () => {
        if (highlightedFeed < allFeeds.length - 1) {
            setHighlightedFeed(highlightedFeed + 1);
        }
    }, [highlightedFeed, allFeeds]);

    const refLeft = useHotkeys('left', () => {
        setSelectedFeed(-1);
    }, []);

    useEffect(() => {
        refUp.current = refDiv.current;
        refDown.current = refDiv.current;
        refLeft.current = refDiv.current;
        if (active) {
            refDiv.current.focus();
        }
    }, [active, refUp, refDown, refLeft]);

    function handleClick(index) {
        setSelectedFeed(index);
        setHighlightedFeed(index);
        refDiv.current.focus();
    }

    function getFeed(entry, index) {
        return (
            <ListItem key={index} active={+(highlightedFeed === index)}>
                <ListItemButton selected={highlightedFeed === index} onClick={() => handleClick(index)}>
                    <ListItemAvatar>
                        <Badge badgeContent={0} color="primary">
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

    if (feedsLoading) {
        return (
            <Area tabIndex={-1} ref={refDiv}>
                <CenteredArea>
                    <Loader type="line-scale-pulse-out" active/>
                </CenteredArea>
            </Area>
        )
    } else if (selectedFeed >= 0) {
        return (
            <Entries active={true}/>
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
