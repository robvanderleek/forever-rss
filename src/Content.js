import htmlParse from "html-react-parser";
import {useFeeds} from "./FeedsContext";
import {useEffect, useRef} from "react";

export default function Content(props) {
    const {active} = props;
    const {entries} = useFeeds();
    const refDiv = useRef(null);

    useEffect(() => {
        if (active) {
            refDiv.current.focus();
        }
    }, [refDiv.current, active]);

    return (
        <div tabIndex={-1} ref={refDiv}>
            {entries.length >= 1 && htmlParse(entries[0].content)}
        </div>
    );
}