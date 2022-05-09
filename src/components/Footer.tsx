import {Button, Divider, Toolbar} from "@mui/material";
import {RssFeed} from "@mui/icons-material";
import {Fragment} from "react";
import {useAuth} from "../contexts/AuthContext";

export default function Footer() {
    const {isAuthenticated, authenticate, logout} = useAuth();

    return (
        <Fragment>
            <Divider/>
            <Toolbar>
                <RssFeed fontSize="medium"/>
                {!isAuthenticated && <Button onClick={() => authenticate()}>Login</Button>}
                {isAuthenticated && <Button onClick={() => logout()}>Logout</Button>}
            </Toolbar>
        </Fragment>
    );
}