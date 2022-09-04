import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import {useFeeds} from "../contexts/FeedsContext";
import {useState} from "react";

interface AddFeedDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function AddFeedDialog(props: AddFeedDialogProps) {
    const {open, onClose} = props;
    const {saveFeed} = useFeeds();
    const [url, setUrl] = useState('');
    const [type, setType] = useState('url');

    const handleClick = async () => {
        await saveFeed(url);
        onClose();
    }

    const handleTypeChange = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Add feed</DialogTitle>
            <DialogContent>
                <div style={{marginTop: '8px', marginBottom: '16px'}}>
                    <FormControl fullWidth>
                        <InputLabel id="select-label">Type</InputLabel>
                        <Select value={type} label="Age" labelId="select-label" onChange={handleTypeChange}>
                            <MenuItem value="url">URL</MenuItem>
                            <MenuItem value="opml">OPML file</MenuItem>
                            <MenuItem value="twitter">Twitter</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <TextField autoFocus id="feedUrl" label="Feed URL" fullWidth variant="standard" value={url}
                           onChange={e => setUrl(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleClick}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}