import './App.css';
import {styled} from "@mui/material";
import {useEffect, useState} from "react";
import htmlParse from 'html-react-parser';
import Entries from "./Entries";
import Feeds from "./Feeds";
import {useHotkeys} from "react-hotkeys-hook";

const Main = styled('div')({
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    outline: 'none'
});

const Section = styled('div')((props) => ({
    borderStyle: props.active ? 'solid' : 'none',
    borderWidth: '1px',
    padding: props.active ? '0px' : '1px'
}));

const FeedsSection = styled(Section)({
    width: '20%',
});

const EntriesSection = styled(Section)({
    width: '25%',
});

const ContentSection = styled(Section)({
    width: '55%'
});

function getEntryContent(entries) {
    return (
        <div>
            {entries.length >= 1 && htmlParse(entries[0].content)}
        </div>
    );
}


function App() {
    const [activeSection, setActiveSection] = useState(0);
    const [entries, setEntries] = useState([]);

    useHotkeys('left', () => {
        if (activeSection > 0) {
            setActiveSection(activeSection - 1);
        }
    }, [activeSection]);

    useHotkeys('right', () => {
        if (activeSection < 2) {
            setActiveSection(activeSection + 1);
        }
    }, [activeSection]);

    useEffect(() => {
        async function load() {
            const res = await fetch('/.netlify/functions/feed?url=' + encodeURIComponent('http://blog.cleancoder.com/atom.xml'));
            if (res.ok) {
                const json = await res.json();
                setEntries(json.message);
            }
        }

        load();
    }, []);
    return (
        <Main>
            <FeedsSection active={+(activeSection === 0)}>
                <Feeds/>
            </FeedsSection>
            <EntriesSection active={+(activeSection === 1)}>
                <Entries/>
            </EntriesSection>
            <ContentSection active={+(activeSection === 2)}>
                {getEntryContent(entries)}
            </ContentSection>
        </Main>
    );
}

export default App;
