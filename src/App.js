import './App.css';
import 'loaders.css';
import Controls from "./components/Controls";
import {CenteredArea, Main, Section} from "./styles";
import Content from "./components/Content";
import {useAppMode} from "./contexts/AppModeContext";
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
            return (<Controls active={true}/>);
        }
    }

    const getWideScreenControls = () => {
        if (isLoading) {
            return getLoadingScreen();
        } else {
            return (<Controls active={activeSection === 0}/>);
        }
    }

    if (wideScreen) {
        return (
            <Main>
                <Section sx={{width: '30%'}} active={+(activeSection === 0)}>
                    {getWideScreenControls()}
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
                    {getControls()}
                </Section>
            </Main>
        );
    }
}