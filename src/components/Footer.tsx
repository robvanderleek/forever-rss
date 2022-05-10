import {Button, Divider, IconButton, Toolbar} from "@mui/material";
import {Add, RssFeed} from "@mui/icons-material";
import {Fragment, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import AddFeedDialog from "../dialogs/AddFeedDialog";

export default function Footer() {
    const [showAddFeedDialog, setShowAddFeedDialog] = useState(false);
    const {isAuthenticated, authenticate, logout} = useAuth();

    return (
        <Fragment>
            <AddFeedDialog open={showAddFeedDialog} onClose={() => setShowAddFeedDialog(false)}/>
            <Divider/>
            <Toolbar>
                <RssFeed fontSize="medium"/>
                {!isAuthenticated && <Button onClick={() => authenticate()}>Login</Button>}
                {isAuthenticated && <Button onClick={() => logout()}>Logout</Button>}
                <IconButton onClick={() => setShowAddFeedDialog(true)}><Add/></IconButton>
            </Toolbar>
        </Fragment>
    );
}