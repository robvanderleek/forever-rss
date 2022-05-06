import './App.css';
import 'loaders.css';
import Controls from "./Controls";
import {Main, Section} from "./styles";
import Content from "./Content";
import {useAppMode} from "./contexts/AppModeContext";

export default function App() {
    const {activeSection, wideScreen} = useAppMode();

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