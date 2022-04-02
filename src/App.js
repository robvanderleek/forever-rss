import './App.css';
import {List, ListItem, ListItemText, styled} from "@mui/material";
import {useEffect, useState} from "react";
import htmlParse from 'html-react-parser';
import RssEntries from "./RssEntries";

const Content = styled('div')({
    display: 'flex',
    flexDirection: 'row'
});

function getEntryContent(entries) {
    return (
        <div>
            {entries.length >= 1 && htmlParse(entries[0].content)}
        </div>
    );
}

function App() {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        async function load() {
            const res = await fetch('/.netlify/functions/feed');
            if (res.ok) {
                const json = await res.json();
                setEntries(json.message);
            }
        }

        load();
    }, []);
    return (
        <Content>
            <List>
                <ListItem>
                    <ListItemText primary="The Clean Code Blog" secondary="http://blog.cleancoder.com/atom.xml"/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="RWieruch" secondary="https://www.robinwieruch.de/index.xml"/>
                </ListItem>
            </List>
            <RssEntries entries={entries}/>
            <div>
                {getEntryContent(entries)}
            </div>
        </Content>
    );
}

export default App;
