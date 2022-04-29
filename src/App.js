import './App.css';
import 'loaders.css';
import {useMediaQuery} from "@mui/material";
import {useState} from "react";
import Controls from "./Controls";
import {useHotkeys} from "react-hotkeys-hook";
import Content from "./Content";
import {Main, Section} from "./styles";

function App() {
    const [activeSection, setActiveSection] = useState(0);
    const wideScreen = useMediaQuery('(min-width:900px)');

    useHotkeys('left', () => {
        if (activeSection > 0) {
            setActiveSection(activeSection - 1);
        }
    }, [activeSection]);

    useHotkeys('right', () => {
        if (activeSection < 1) {
            setActiveSection(activeSection + 1);
        }
    }, [activeSection]);

    if (wideScreen) {
        return (
            <Main>
                <Section sx={{width: '30%'}} active={+(activeSection === 0)}>
                    <Controls active={activeSection === 0}/>
                </Section>
                <Section sx={{width: '70%'}} active={+(activeSection === 1)}>
                    <Content active={activeSection === 1}/>
                </Section>
            </Main>
        );
    } else {
        return (
            <Main>
                <Section sx={{width: '100%'}} active={1}>
                    <Controls active={true}/>
                </Section>
            </Main>
        );
    }
}

export default App;
