import htmlParse from "html-react-parser";
import {useFeeds} from "@/contexts/FeedsContext";
import React, {useEffect, useRef} from "react";
import {ContentArea, ContentFrame, DefaultContentArea} from "@/components/Content.style";
import Hyperlink from "@/components/Hyperlink";


interface ContentProps {
    active: boolean;
}

export default function Content(props: ContentProps) {
    const {active} = props;
    const {entries, selectedEntry} = useFeeds();
    const refDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (active && refDiv.current) {
            refDiv.current.focus();
        }
    }, [active]);

    const entry = entries[selectedEntry];
    if (!entry) {
        return (<DefaultContentArea>Forever RSS</DefaultContentArea>);
    } else {
        return (
            <ContentArea tabIndex={-1} ref={refDiv}>
                <h1><Hyperlink href={entry.link}>{entry.title}</Hyperlink></h1>
                {entry.heroImage && <img src={entry.heroImage} alt="Headline"/>}
                {entries.length >= 1 && htmlParse(entry.content)}
                <ContentFrame src={entry.link}></ContentFrame>
            </ContentArea>
        );
    }
}