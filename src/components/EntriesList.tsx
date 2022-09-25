import moment from "moment";
import {List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {EntryItem, ItemAvatar} from "../styles";
import {Article} from "@mui/icons-material";
import {useFeeds} from "../contexts/FeedsContext";
import {useAppMode} from "../contexts/AppModeContext";
import {Entry} from "../entities/Entry";

export function formatDate(dateString: string): string {
    const date = moment(dateString);
    return date.format('MMM Do YYYY');
}

export default function EntriesList() {
    const {handleClick} = useAppMode();
    const {highlightedEntry} = useFeeds();
    const {entries, selectedEntry} = useFeeds();

    function getEntry(entry: Entry, index: number) {
        return (
            <EntryItem key={index} active={+(selectedEntry === index)}>
                <ListItemButton selected={highlightedEntry === index} onClick={() => handleClick(index)}
                                autoFocus={highlightedEntry === index}>
                    <ListItemAvatar>
                        <ItemAvatar active={+(selectedEntry === index)}>
                            <Article fontSize="inherit"/>
                        </ItemAvatar>
                    </ListItemAvatar>
                    <ListItemText primary={entry.title} secondary={formatDate(entry.updated)}/>
                </ListItemButton>
            </EntryItem>
        );
    }

    return (
        <List dense={true}>
            {entries.map((e, i) => getEntry(e, i))}
        </List>
    );
}