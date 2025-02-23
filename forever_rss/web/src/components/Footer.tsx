import {Divider, IconButton, styled, Toolbar} from "@mui/material";
import {Add} from "@mui/icons-material";
import {Fragment, useState} from "react";
import AddFeedDialog from "../dialogs/AddFeedDialog";
import {useAuth} from "../contexts/AuthContext";

const FooterToolbar = styled(Toolbar)`
  display: flex;
  justify-content: flex-end;
`;

const PlusButton = styled(IconButton)`
  margin-right: 16px;
`;

export default function Footer() {
    const [showAddFeedDialog, setShowAddFeedDialog] = useState(false);
    const {isAuthenticated} = useAuth();
    return (
        <Fragment>
            <AddFeedDialog open={showAddFeedDialog} onClose={() => setShowAddFeedDialog(false)}/>
            <Divider/>
            <FooterToolbar disableGutters>
                {isAuthenticated && <PlusButton onClick={() => setShowAddFeedDialog(true)}><Add/></PlusButton>}
            </FooterToolbar>
        </Fragment>
    );
}