import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useEffect, useRef} from "react";
import {useFeeds} from "./FeedsContext";
import {useHotkeys} from "react-hotkeys-hook";
import {Area, CenteredArea} from "./styles";
import Loader from "react-loaders";

export default function Entries(props) {
    const {active} = props;
    const {entries, entriesLoading, selectedEntry, setSelectedEntry} = useFeeds();
    const refDiv = useRef(null);

    const refUp = useHotkeys('up', () => {
        if (selectedEntry > 0) {
            setSelectedEntry(selectedEntry - 1);
        }
    }, [selectedEntry]);

    const refDown = useHotkeys('down', () => {
        if (selectedEntry < entries.length - 1) {
            setSelectedEntry(selectedEntry + 1);
        }
    }, [selectedEntry, entries]);

    useEffect(() => {
        refUp.current = refDiv.current;
        refDown.current = refDiv.current;
        if (active) {
            refDiv.current.focus();
        }
    }, [active, refUp, refDown]);

    function getEntry(entry, index) {
        return (
            <ListItem key={index}>
                <ListItemButton selected={selectedEntry === index} onClick={() => setSelectedEntry(index)}>
                    <ListItemText primary={entry.title} secondary={entry.updated}/>
                </ListItemButton>
            </ListItem>
        );
    }

    if (entriesLoading) {
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
                <List>
                    {entries.map((e, i) => getEntry(e, i))}
                </List>
            </Area>
        );
    }
}