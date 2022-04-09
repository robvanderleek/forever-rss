import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useFeeds} from "./FeedsContext";
import {useHotkeys} from "react-hotkeys-hook";

export default function Entries(props) {
    const {active} = props;
    const {entries} = useFeeds();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const refDiv = useRef(null);

    const refUp = useHotkeys('up', (e) => {
    }, []);

    const refDown = useHotkeys('down', (e) => {
    }, []);

    useEffect(() => {
        refUp.current = refDiv.current;
        refDown.current = refDiv.current;
        if (active) {
            refDiv.current.focus();
        }
    }, [refDiv.current, active]);

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
        <div tabIndex={-1} ref={refDiv}>
            <List>
                {entries.map((e, i) => getEntry(e, i))}
            </List>
        </div>
    );
}