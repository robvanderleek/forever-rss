import htmlParse from "html-react-parser";
import {useFeeds} from "../contexts/FeedsContext";
import {useEffect, useRef} from "react";
import {Area} from "../styles";
import {styled} from "@mui/material";

const ContentArea = styled(Area)({
    padding: '20px'
});

export default function Content(props) {
    const {active} = props;
    const {entries, selectedEntry} = useFeeds();
    const refDiv = useRef(null);

    useEffect(() => {
        if (active && refDiv.current) {
            refDiv.current.focus();
        }
    }, [active]);

    const entry = entries[selectedEntry];
    if (!entry) {
        return null;
    } else {
        return (
            <ContentArea tabIndex={-1} ref={refDiv}>
                <a href={entry.link}>
                    <h1>{entry.title}</h1>
                </a>
                {entry.heroImage && <img src={entry.heroImage} alt="Headline"/>}

                {entries.length >= 1 && htmlParse(entry.content)}
            </ContentArea>
        );
    }
}