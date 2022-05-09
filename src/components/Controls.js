import {useFeeds} from "../contexts/FeedsContext";
import {Area} from "../styles";
import ControlsContent from "./ControlsContent";
import {useSwipeable} from "react-swipeable";
import Header from "./Header";
import {Mode} from "../entities/Mode";
import {useAppMode} from "../contexts/AppModeContext";
import Footer from "./Footer";

export default function Controls() {
    const {
        setSelectedFeed, setSelectedEntry, highlightedFeed, setHighlightedFeed, highlightedEntry, setHighlightedEntry
    } = useFeeds();
    const {mode, setMode, wideScreen, handleBack} = useAppMode();

    const handlers = useSwipeable({onSwipedRight: handleBack});

    const refPassthrough = (el) => {
        handlers.ref(el);
    }

    function handleFeedsClick(index) {
        setSelectedFeed(index);
        setHighlightedFeed(index);
        setMode(Mode.Entries);
    }

    function handleEntriesClick(index) {
        setSelectedEntry(index);
        setHighlightedEntry(index)
        if (!wideScreen) {
            setMode(Mode.Content);
        }
    }

    return (<Area tabIndex={-1} ref={refPassthrough}>
        <Header mode={mode} handleBack={handleBack}/>
        <ControlsContent mode={mode} highlightedFeed={highlightedFeed} handleFeedsClick={handleFeedsClick}
                         highlightedEntry={highlightedEntry} handleEntriesClick={handleEntriesClick}/>
        <Footer/>
    </Area>);
}
