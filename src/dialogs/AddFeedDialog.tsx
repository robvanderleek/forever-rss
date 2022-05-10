import {Dialog, DialogTitle} from "@mui/material";

interface AddFeedDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function AddFeedDialog(props: AddFeedDialogProps) {
    const {open, onClose} = props;
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add feed</DialogTitle>
        </Dialog>
    )
}