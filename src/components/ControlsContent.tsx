import {Mode} from "@/entities/Mode";
import {LoadingArea, ContentArea} from "@/styles";
import Loader from "react-loaders";
import FeedsList from "./FeedsList";
import EntriesList from "./EntriesList";
import {useFeeds} from "@/contexts/FeedsContext";
import Content from "./Content";
import {useAppMode} from "@/contexts/AppModeContext";

interface ControlsContentProps {
    mode: Mode;
}

export default function ControlsContent(props: ControlsContentProps) {
    const {loading} = useFeeds();
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
                    return (<EntriesList/>);
                } else {
                    return (<Content active={false}/>);
                }
        }
    }

    if (loading) {
        return (
            <LoadingArea>
                <Loader type="line-scale-pulse-out" active/>
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