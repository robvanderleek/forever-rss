import {Mode} from "./entities/Mode";
import {CenteredArea, ContentArea} from "./styles";
import Loader from "react-loaders";
import FeedsList from "./components/FeedsList";
import EntriesList from "./components/EntriesList";
import {useFeeds} from "./contexts/FeedsContext";
import Content from "./Content";

interface ContentProps {
    mode: Mode;
    highlightedFeed: number;
    handleFeedsClick: (n: number) => void;
    highlightedEntry: number;
    handleEntriesClick: (n: number) => void;
}

export default function ControlsContent(props: ContentProps) {
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