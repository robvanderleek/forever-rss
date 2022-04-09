import htmlParse from "html-react-parser";
import {useFeeds} from "./FeedsContext";
import {useEffect, useRef} from "react";
import {Area} from "./styles";

export default function Content(props) {
    const {active} = props;
    const {entries, selectedEntry} = useFeeds();
    const refDiv = useRef(null);

    useEffect(() => {
        if (active) {
            refDiv.current.focus();
        }
    }, [active]);

    return (
        <Area tabIndex={-1} ref={refDiv}>
            {entries.length >= 1 && htmlParse(entries[selectedEntry].content)}
        </Area>
    );
}