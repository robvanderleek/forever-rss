import htmlParse from "html-react-parser";
import {useFeeds} from "@/contexts/FeedsContext";
import React, {useEffect, useRef} from "react";
import {ContentArea, DefaultContentArea} from "@/components/Content.style";
import Hyperlink from "@/components/Hyperlink";
import {Container, styled} from "@mui/material";
import TurndownService from "turndown";
import {marked} from "marked";


interface ContentProps {
    active: boolean;
}

const Title = styled('h1')`
  font-size: 42px;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
`;

const Text = styled('span')`
  font-size: 20px;
  font-family: source-serif-pro, Georgia, Cambria, "Times New Roman", Times, serif;
  font-weight: 400;
  word-break: break-word;
`

export default function Content(props: ContentProps) {
    const {active} = props;
    const {entries, selectedEntry} = useFeeds();
    const refDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (active && refDiv.current) {
            refDiv.current.focus();
        }
    }, [active]);

    useEffect(() => {
        if (refDiv.current) {
            refDiv.current.scrollTo(0, 0);
        }
    }, [selectedEntry]);

    const entry = entries[selectedEntry];

    const renderer = {
        code() {
            return '';
        },
        image() {
            return '';
        }
    };

    marked.use({
        renderer,
        mangle: false,
        headerIds: false
    });

    if (!entry) {
        return (<DefaultContentArea active={active ? 'true' : 'false'}>Forever RSS</DefaultContentArea>);
    } else {
        const markdown = new TurndownService().turndown(entry.content);
        return (
            <ContentArea active={active ? 'true' : 'false'} tabIndex={-1} ref={refDiv}>
                <Container maxWidth="md">
                    <>
                        <Title><Hyperlink href={entry.link}>{entry.title}</Hyperlink></Title>
                        {entry.heroImage && <img src={entry.heroImage} alt="Headline"/>}
                        {entries.length >= 1 && <Text>{htmlParse(marked.parse(markdown))}</Text>}
                    </>
                </Container>
            </ContentArea>
        );
    }
}