import './App.css';
import 'loaders.css';
import {styled} from "@mui/material";
import {useState} from "react";
import Feeds from "./Feeds";
import {useHotkeys} from "react-hotkeys-hook";
import Content from "./Content";
import {Main, Section} from "./styles";

const FeedsSection = styled(Section)({
    width: '25%'
});

const ContentSection = styled(Section)({
    width: '75%'
});

function App() {
    const [activeSection, setActiveSection] = useState(0);

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

    return (
        <Main>
            <FeedsSection active={+(activeSection === 0)}>
                <Feeds active={activeSection === 0}/>
            </FeedsSection>
            <ContentSection active={+(activeSection === 1)}>
                <Content active={activeSection === 1}/>
            </ContentSection>
        </Main>
    );
}

export default App;
