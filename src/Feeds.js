import {
    Avatar as MuiAvatar,
    List,
    ListItem as MuiListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    styled
} from "@mui/material";
import {useHotkeys} from "react-hotkeys-hook";
import {useFeeds} from "./FeedsContext";
import {useEffect, useRef} from "react";
import {Area} from "./styles";

// #ac93d4
const ListItem = styled(MuiListItem)({
    filter: 'invert(78%) sepia(31%) saturate(2282%) hue-rotate(201deg) brightness(89%) contrast(85%)',
    // filter: 'grayscale(100%)',
    '&:hover': {
        filter: 'none'
    }
});

const Avatar = styled(MuiAvatar)({
    width: '24px',
    height: '24px',
});

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
                {/*<Tooltip title={entry.url} enterDelay={1000}>*/}
                <ListItemButton selected={selectedFeed === index} onClick={() => setSelectedFeed(index)}>
                    <ListItemAvatar>
                        <Avatar src={entry.favicon}/>
                    </ListItemAvatar>
                    <ListItemText primary={entry.title}/>
                </ListItemButton>
                {/*</Tooltip>*/}
            </ListItem>
        );
    }

    return (
        <Area tabIndex={-1} ref={refDiv}>
            <List dense={true}>
                {allFeeds.map((e, i) => getFeed(e, i))}
            </List>
        </Area>
    );
}
