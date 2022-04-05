import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useState} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./FeedsContext";

export default function Feeds(props) {
    const {allFeeds} = useFeeds();
    const [selectedIndex, setSelectedIndex] = useState(0);

    useHotkeys('up', () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    }, [selectedIndex]);

    useHotkeys('down', () => {
        if (selectedIndex < allFeeds.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    }, [selectedIndex]);

    function getFeed(entry, index) {
        return (
            <ListItem key={index}>
                <ListItemButton selected={selectedIndex === index} onClick={() => setSelectedIndex(index)}>
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