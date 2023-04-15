import './App.css';
import 'loaders.css';
import Controls from "./components/Controls";
import {CenteredArea, Main, Section} from "./styles";
import Content from "./components/Content";
import {ActiveSection, useAppMode} from "./contexts/AppModeContext";
import Loader from "react-loaders";
import {useAuth} from "./contexts/AuthContext";

export default function App() {
    const {activeSection, wideScreen} = useAppMode();
    const {isLoading} = useAuth();

    const getLoadingScreen = () => {
        return (
            <CenteredArea>
                <Loader type="line-scale-pulse-out" active/>
            </CenteredArea>
        );
    }

    const getControls = () => {
        if (isLoading) {
            return getLoadingScreen();
        } else {
            return (<Controls/>);
        }
    }

    const getWideScreenControls = () => {
        if (isLoading) {
            return getLoadingScreen();
        } else {
            return (<Controls/>);
        }
    }

    if (wideScreen) {
        return (
            <Main>
                <Section sx={{width: '30%'}} active={activeSection === ActiveSection.Controls}>
                    {getWideScreenControls()}
                </Section>
                <Section sx={{width: '70%'}} active={activeSection === ActiveSection.Content}>
                    <Content active={activeSection === 1}/>
                </Section>
            </Main>
        );
    } else {
        return (
            <Main>
                <Section sx={{width: '100%'}} active={true}>
                    {getControls()}
                </Section>
            </Main>
        );
    }
}