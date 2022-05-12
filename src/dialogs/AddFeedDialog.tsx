import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";

interface AddFeedDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function AddFeedDialog(props: AddFeedDialogProps) {
    const {open, onClose} = props;
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
                <Button>Add</Button>
            </DialogActions>
        </Dialog>
    )
}