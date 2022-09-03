import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
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

    const handleClick = async () => {
        await saveFeed(url);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add feed</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Feed URL
                </DialogContentText>
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