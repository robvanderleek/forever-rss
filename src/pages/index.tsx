import 'loaders.css';
import Controls from "../components/Controls";
import {CenteredArea, Main, Section} from "@/styles";
import Content from "../components/Content";
import {ActiveSection, useAppMode} from "@/contexts/AppModeContext";
import Loader from "react-loaders";
import {useAuth} from "@/contexts/AuthContext";
import Head from "next/head";

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
                    <Section sx={{width: '70%'}} active={activeSection === ActiveSection.Content ? 'true' : 'false'}>
                        <Content active={activeSection === 1}/>
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
                    <Section sx={{width: '100%'}} active="true">
                        {getControls()}
                    </Section>
                </Main>
            </>
        );
    }
}