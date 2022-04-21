import moment from "moment";
import {List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {ItemAvatar} from "../styles";
import {Article} from "@mui/icons-material";
import {useFeeds} from "../FeedsContext";

export function formatDate(dateString) {
    const date = moment(dateString);
    return date.format('MMM Do YYYY');
}

export default function EntriesList(props) {
    const {handleClick} = props;
    const {entries, selectedEntry} = useFeeds();

    function getEntry(entry, index) {
        return (<ListItem key={index}>
            <ListItemButton selected={selectedEntry === index} onClick={() => handleClick(index)}>
                <ListItemAvatar>
                    <ItemAvatar active={+(selectedEntry === index)}>
                        <Article fontSize="inherit"/>
                    </ItemAvatar>
                </ListItemAvatar>
                <ListItemText primary={entry.title} secondary={formatDate(entry.updated)}/>
            </ListItemButton>
        </ListItem>);
    }

    return (<List dense={true}>
        {entries.map((e, i) => getEntry(e, i))}
    </List>);
}