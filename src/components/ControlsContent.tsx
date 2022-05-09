import {Mode} from "../entities/Mode";
import {CenteredArea, ContentArea} from "../styles";
import Loader from "react-loaders";
import FeedsList from "./FeedsList";
import EntriesList from "./EntriesList";
import {useFeeds} from "../contexts/FeedsContext";
import Content from "./Content";

interface ControlsContentProps {
    mode: Mode;
    highlightedFeed: number;
    handleFeedsClick: (n: number) => void;
    highlightedEntry: number;
    handleEntriesClick: (n: number) => void;
}

export default function ControlsContent(props: ControlsContentProps) {
    const {loading} = useFeeds();

    if (loading) {
        return (<CenteredArea>
            <Loader type="line-scale-pulse-out" active/>
        </CenteredArea>);
    }
    switch (props.mode) {
        default:
        case Mode.Feeds:
            return (<ContentArea>
                <FeedsList highlightedFeed={props.highlightedFeed} handleClick={props.handleFeedsClick}/>
            </ContentArea>);
        case Mode.Entries:
            return (<ContentArea>
                <EntriesList highlightedEntry={props.highlightedEntry} handleClick={props.handleEntriesClick}/>
            </ContentArea>);
        case Mode.Content:
            return (<ContentArea>
                <Content active={false}/>
            </ContentArea>)
    }
}