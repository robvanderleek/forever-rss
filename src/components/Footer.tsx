import {Divider, IconButton, styled, Toolbar} from "@mui/material";
import {Add} from "@mui/icons-material";
import {Fragment, useState} from "react";
import AddFeedDialog from "../dialogs/AddFeedDialog";

const FooterToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'center'
});
export default function Footer() {
    const [showAddFeedDialog, setShowAddFeedDialog] = useState(false);
    return (
        <Fragment>
            <AddFeedDialog open={showAddFeedDialog} onClose={() => setShowAddFeedDialog(false)}/>
            <Divider/>
            <FooterToolbar>
                <IconButton onClick={() => setShowAddFeedDialog(true)}><Add/></IconButton>
            </FooterToolbar>
        </Fragment>
    );
}