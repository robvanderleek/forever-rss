import './App.css';
import {styled} from "@mui/material";
import {useState} from "react";
import Entries from "./Entries";
import Feeds from "./Feeds";
import {useHotkeys} from "react-hotkeys-hook";
import Content from "./Content";

const Main = styled('div')({
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    outline: 'none'
});

const Section = styled('div')((props) => ({
    borderStyle: props.active ? 'solid' : 'none',
    borderWidth: '1px',
    padding: props.active ? '0px' : '1px',
    overflow: 'auto'
}));

const FeedsSection = styled(Section)({
    width: '20%'
});

const EntriesSection = styled(Section)({
    width: '25%'
});

const ContentSection = styled(Section)({
    width: '55%'
});

function App() {
    const [activeSection, setActiveSection] = useState(0);

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

    return (
        <Main>
            <FeedsSection active={+(activeSection === 0)}>
                <Feeds active={activeSection === 0}/>
            </FeedsSection>
            <EntriesSection active={+(activeSection === 1)}>
                <Entries active={activeSection === 1}/>
            </EntriesSection>
            <ContentSection active={+(activeSection === 2)}>
                <Content active={activeSection === 2}/>
            </ContentSection>
        </Main>
    );
}

export default App;
