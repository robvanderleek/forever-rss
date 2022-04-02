import './App.css';
import {List, ListItem, ListItemText, styled} from "@mui/material";
import {useEffect, useState} from "react";
import htmlParse from 'html-react-parser';

const Content = styled('div')({
    display: 'flex',
    flexDirection: 'row'
})

function getEntry(entry) {
    return (
        <ListItem key={entry.id}>
            <ListItemText primary={entry.title} secondary={entry.updated}/>
        </ListItem>
    );
}

function getEntries(entries) {
    return (<List>
        {entries.map(e => getEntry(e))}
    </List>);
}

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
            </List>
            {getEntries(entries)}
            <div>
                {getEntryContent(entries)}
            </div>
        </Content>
    );
}

export default App;
