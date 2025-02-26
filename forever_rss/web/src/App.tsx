import Content from "./components/Content";
import {DesktopContent, DesktopControls, LoadingArea, Main, MobileControls} from "./styles";
import Controls from "./components/Controls";
import {useAppMode} from "./contexts/AppModeContext";
import {Bars} from "react-loader-spinner";
import {Mode} from "./entities/Mode";

export default function App() {
    const {mode, wideScreen} = useAppMode();
    const isLoading = false;

    const getLoadingScreen = () => {
        return (
            <LoadingArea>
                <Bars height="50" width="60" color="#e6772b" ariaLabel="bars-loading"/>
            </LoadingArea>
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
                {/*<h1>Hello world this is a test of how wide the box is at this point in thel</h1>*/}
                <DesktopControls>
                    {getWideScreenControls()}
                </DesktopControls>
                <DesktopContent>
                    <Content active={mode === Mode.Content}/>
                </DesktopContent>
            </Main>
        );
    } else {
        return (
            <Main>
                <MobileControls>
                    {getControls()}
                </MobileControls>
            </Main>
        );
    }
}