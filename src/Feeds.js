import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useState} from "react";

export default function Feeds(props) {
    const {feeds} = props;
    const [selectedIndex, setSelectedIndex] = useState(-1);

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