import Controls from "../components/Controls";
import {DesktopContent, DesktopControls, LoadingArea, Main, MobileControls} from "@/styles";
import Content from "../components/Content";
import {useAppMode} from "@/contexts/AppModeContext";
import {useAuth} from "@/contexts/AuthContext";
import Head from "next/head";
import {Mode} from "@/entities/Mode";
import React from "react";
import {Bars} from "react-loader-spinner";

export default function App() {
    const {mode, wideScreen} = useAppMode();
    const {isLoading} = useAuth();

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
            <>
                <Head>
                    <title>Forever RSS</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <Main>
                    <DesktopControls>
                        {getWideScreenControls()}
                    </DesktopControls>
                    <DesktopContent>
                        <Content active={mode === Mode.Content}/>
                    </DesktopContent>
                </Main>
            </>
        );
    } else {
        return (
            <>
                <Head>
                    <title>Forever RSS</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <Main>
                    <MobileControls>
                        {getControls()}
                    </MobileControls>
                </Main>
            </>
        );
    }
}