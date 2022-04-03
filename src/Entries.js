import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useState} from "react";

export default function Entries(props) {
    const {entries} = props;
    const [selectedIndex, setSelectedIndex] = useState(-1);

    function getEntry(entry, index) {
        return (
            <ListItem key={index}>
                <ListItemButton selected={selectedIndex === index} onClick={() => setSelectedIndex(index)}>
                    <ListItemText primary={entry.title} secondary={entry.updated}/>
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <List>
            {entries.map((e, i) => getEntry(e, i))}
        </List>
    );
}