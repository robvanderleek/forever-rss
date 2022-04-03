import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useState} from "react";
import {useHotkeys} from "react-hotkeys-hook";

export default function Feeds(props) {
    const {feeds} = props;
    const [selectedIndex, setSelectedIndex] = useState(0);

    useHotkeys('up', () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    }, [selectedIndex]);

    useHotkeys('down', () => {
        if (selectedIndex < feeds.length - 1) {
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
            {feeds.map((e, i) => getFeed(e, i))}
        </List>
    );
}