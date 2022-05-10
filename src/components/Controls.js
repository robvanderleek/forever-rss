import {useFeeds} from "../contexts/FeedsContext";
import {Area} from "../styles";
import ControlsContent from "./ControlsContent";
import {useSwipeable} from "react-swipeable";
import Header from "./Header";
import {useAppMode} from "../contexts/AppModeContext";
import Footer from "./Footer";

export default function Controls() {
    const {highlightedFeed, highlightedEntry} = useFeeds();
    const {mode, handleBack, handleClick} = useAppMode();

    const handlers = useSwipeable({onSwipedRight: handleBack});

    const refPassthrough = (el) => {
        handlers.ref(el);
    }

    return (<Area tabIndex={-1} ref={refPassthrough}>
        <Header mode={mode} handleBack={handleBack}/>
        <ControlsContent mode={mode} highlightedFeed={highlightedFeed} handleFeedsClick={handleClick}
                         highlightedEntry={highlightedEntry} handleEntriesClick={handleClick}/>
        <Footer/>
    </Area>);
}
