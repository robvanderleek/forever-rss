import {Mode} from "@/entities/Mode";
import {CenteredArea, ContentArea} from "@/styles";
import Loader from "react-loaders";
import FeedsList from "./FeedsList";
import EntriesList from "./EntriesList";
import {useFeeds} from "@/contexts/FeedsContext";
import Content from "./Content";
import {ActiveSection, useAppMode} from "@/contexts/AppModeContext";

interface ControlsContentProps {
    mode: Mode;
}

export default function ControlsContent(props: ControlsContentProps) {
    const {loading} = useFeeds();
    const {activeSection} = useAppMode();

    const getContentElement = () => {
        switch (props.mode) {
            default:
            case Mode.Feeds:
                return (<FeedsList/>);
            case Mode.Entries:
                return (<EntriesList/>);
            case Mode.Content:
                return (<Content active={false}/>);
        }
    }

    if (loading) {
        return (
            <CenteredArea active="true">
                <Loader type="line-scale-pulse-out" active/>
            </CenteredArea>
        );
    } else {
        return (
            <ContentArea active={activeSection === ActiveSection.Controls ? 'true' : 'false'}>
                {getContentElement()}
            </ContentArea>
        );
    }
}