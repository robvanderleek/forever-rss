import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./FeedsContext";
import {useEffect, useRef} from "react";
import {Area} from "./styles";

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
            <ListItem key={index}>
                <ListItemButton selected={selectedFeed === index} onClick={() => setSelectedFeed(index)}>
                    <ListItemText primary={entry.title} secondary={entry.url}/>
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <Area tabIndex={-1} ref={refDiv}>
            <List>
                {allFeeds.map((e, i) => getFeed(e, i))}
            </List>
        </Area>
    );
}
