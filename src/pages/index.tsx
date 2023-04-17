import 'loaders.css';
import Controls from "../components/Controls";
import {LoadingArea, Main, Section} from "@/styles";
import Content from "../components/Content";
import {useAppMode} from "@/contexts/AppModeContext";
import Loader from "react-loaders";
import {useAuth} from "@/contexts/AuthContext";
import Head from "next/head";
import {Mode} from "@/entities/Mode";

export default function App() {
    const {mode, wideScreen} = useAppMode();
    const {isLoading} = useAuth();

    const getLoadingScreen = () => {
        return (
            <LoadingArea>
                <Loader type="line-scale-pulse-out" active/>
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
                    <Section sx={{width: '30%'}} active="false">
                        {getWideScreenControls()}
                    </Section>
                    <Section sx={{width: '70%'}} active={mode === Mode.Content ? 'true' : 'false'}>
                        <Content active={mode === Mode.Content}/>
                    </Section>
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
                    <Section sx={{width: '100%'}} active="false">
                        {getControls()}
                    </Section>
                </Main>
            </>
        );
    }
}