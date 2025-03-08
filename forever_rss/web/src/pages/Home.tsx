import {useAppMode} from "../contexts/AppModeContext";
import {useEffect} from "react";
import {DesktopContent, DesktopControls, LoadingArea, Main, MobileControls} from "../styles";
import {Bars} from "react-loader-spinner";
import Controls from "../components/Controls";
import Content from "../components/Content";
import {Mode} from "../entities/Mode";

export default function Home() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const {mode, wideScreen} = useAppMode();
    const isLoading = false;

    useEffect(() => {
        const handleAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
            } else if (code) {
                const res = await fetch(`http://localhost:3000/api/v1/oauth/redirect?code=${code}`);
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    localStorage.setItem("token", `${data.tokenType} ${data.token}`);
                }
            }
        }
        handleAuth();
    }, [code]);

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