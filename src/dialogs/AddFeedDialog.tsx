import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {useFeeds} from "../contexts/FeedsContext";

interface AddFeedDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function AddFeedDialog(props: AddFeedDialogProps) {
    const {open, onClose} = props;
    const {saveFeed} = useFeeds();
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add feed</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Feed URL
                </DialogContentText>
                <TextField autoFocus id="feedUrl" label="Feed URL" fullWidth variant="standard"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => saveFeed('hello world')}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}