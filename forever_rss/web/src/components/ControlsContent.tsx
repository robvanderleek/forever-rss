import {Mode} from "../entities/Mode";
import {ContentArea, LoadingArea} from "../styles";
import FeedsList from "./FeedsList";
import EntriesList from "./EntriesList";
import Content from "./Content";
import {useAppMode} from "../contexts/AppModeContext";
import {Bars} from "react-loader-spinner";
import {useFeeds} from "../contexts/FeedsContext";

interface ControlsContentProps {
    mode: Mode;
}

export default function ControlsContent(props: ControlsContentProps) {
    const {loading, selectedFeed} = useFeeds();
    const {mode, wideScreen} = useAppMode();

    const getContentElement = () => {
        switch (props.mode) {
            default:
            case Mode.Feeds:
                return (<FeedsList/>);
            case Mode.Entries:
                return (<EntriesList/>);
            case Mode.Content:
                if (wideScreen) {
                    if (selectedFeed >= 0) {
                        return (<EntriesList/>);
                    } else {
                        return (<FeedsList/>);
                    }
                } else {
                    return (<Content active={false}/>);
                }
        }
    }

    if (loading) {
        return (
            <LoadingArea>
                <Bars height="50" width="60" color="#e6772b" ariaLabel="bars-loading"/>
            </LoadingArea>
        );
    } else {
        const active = !wideScreen || (mode === Mode.Feeds || mode === Mode.Entries);
        return (
            <ContentArea active={active ? 'true' : 'false'}>
                {getContentElement()}
            </ContentArea>
        );
    }
}