import {useFeeds} from "@/contexts/FeedsContext";
import React, {useEffect, useRef} from "react";
import {ContentArea, DefaultContentArea, HeroArea, HeroImage} from "@/components/Content.style";
import Hyperlink from "@/components/Hyperlink";
import {Container, styled} from "@mui/material";
import TurndownService from "turndown";
import {marked} from "marked";
import htmlParse from 'html-react-parser';
import {unescapeMarkdown} from "@/utils";


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
            refDiv.current.focus();
            refDiv.current.scrollTo(0, 0);
        }
    }, [selectedEntry]);

    const entry = entries[selectedEntry];

    const renderer = {
        code(code: string) {
            return `<pre style="border: 1px solid #e5e5e5; background: #f9f9f9; font-size: 14px; overflow-x: auto;">${code}</pre>`;
        },

        image(href: string, title: string) {
            return `<div style="display: flex; justify-content: center;"><img src=${href} style="max-width: 75%;" alt="${title}"/></div>`;
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
        const turndownService = new TurndownService({codeBlockStyle: "fenced"});
        turndownService.addRule('fenceAllPreformattedText', {
            filter: ['pre'],
            replacement: function (content, _, options) {
                return (
                    '\n\n' + options.fence + '\n' +
                    unescapeMarkdown(content) +
                    '\n' + options.fence + '\n\n'
                )
            },
        });
        const markdown = turndownService.turndown(entry.content);
        const html = marked.parse(markdown);
        return (
            <ContentArea active={active ? 'true' : 'false'} tabIndex={-1} ref={refDiv}>
                <Container maxWidth="md">
                    <>
                        <Title><Hyperlink href={entry.link}>{entry.title}</Hyperlink></Title>
                        {entry.heroImage &&
                            <HeroArea>
                                <HeroImage src={entry.heroImage} alt="Headline"/>
                            </HeroArea>
                        }
                        {entries.length >= 1 && <Text>{htmlParse(html)}</Text>}
                    </>
                </Container>
            </ContentArea>
        );
    }
}