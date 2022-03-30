import './App.css';
import {List, ListItem, ListItemText, styled} from "@mui/material";
import {useEffect, useState} from "react";

const Content = styled('div')({
    display: 'flex',
    flexDirection: 'row'
})

function App() {
    const [xml, setXml] = useState(undefined);
    useEffect(() => {
        async function load() {
            const res = await fetch('/.netlify/functions/feed');
            if (res.ok) {
                setXml(await res.text());
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
            <div>
                {xml}
            </div>
        </Content>
    );
}

export default App;
