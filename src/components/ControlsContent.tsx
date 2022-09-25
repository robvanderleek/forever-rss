import {Mode} from "../entities/Mode";
import {CenteredArea, ContentArea} from "../styles";
import Loader from "react-loaders";
import FeedsList from "./FeedsList";
import EntriesList from "./EntriesList";
import {useFeeds} from "../contexts/FeedsContext";
import Content from "./Content";

interface ControlsContentProps {
    mode: Mode;
}

export default function ControlsContent(props: ControlsContentProps) {
    const {loading} = useFeeds();

    if (loading) {
        return (
            <CenteredArea>
                <Loader type="line-scale-pulse-out" active/>
            </CenteredArea>
        );
    }
    switch (props.mode) {
        default:
        case Mode.Feeds:
            return (<ContentArea>
                <FeedsList/>
            </ContentArea>);
        case Mode.Entries:
            return (<ContentArea>
                <EntriesList/>
            </ContentArea>);
        case Mode.Content:
            return (<ContentArea>
                <Content active={false}/>
            </ContentArea>)
    }
}