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
import {useState, KeyboardEvent} from "react";

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
        const response = await saveFeed(url);
        if (response.ok) {
            onClose();
        }
    }

    const handleTypeChange = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            await handleClick();
        }
    }

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
                           onChange={e => setUrl(e.target.value)} onKeyDown={handleKeyDown}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleClick}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}