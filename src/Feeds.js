import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./FeedsContext";

export default function Feeds() {
    const {allFeeds, selectedFeed, setSelectedFeed} = useFeeds();

    useHotkeys('up', () => {
        if (selectedFeed > 0) {
            setSelectedFeed(selectedFeed - 1);
        }
    }, [selectedFeed]);

    useHotkeys('down', () => {
        if (selectedFeed < allFeeds.length - 1) {
            setSelectedFeed(selectedFeed + 1);
        }
    }, [selectedFeed, allFeeds]);

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
        <List>
            {allFeeds.map((e, i) => getFeed(e, i))}
        </List>
    );
}