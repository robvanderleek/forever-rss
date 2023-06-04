import React from "react";
import {HeroArea, HeroImage, SubSubTitle, SubTitle, Text, Title} from "@/components/Content.style";
import {Container} from "@mui/material";
import {version} from '@/version'

export default function TitleScreenContent() {
    return (
        <Container maxWidth="md">
            <Title>Forever RSS</Title>
            <HeroArea>
                <figure>
                    <HeroImage src="/hero-image.jpg" alt="Logo"/>
                    <figcaption>Photo by <a
                        href="https://unsplash.com/@leonardo_64?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Johannes
                        Mändle</a> on <a
                        href="https://unsplash.com/photos/Y7pijhr5oqU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                    </figcaption>
                </figure>
            </HeroArea>
            <Text>
                <b>Tip:</b> Use the arrow keys ←, →, ↑, ↓, and <code>enter</code> to navigate this site.
            </Text>
            <SubTitle>Your Internet inbox</SubTitle>
            <Text>

                <p>
                    RSS readers reverse the flow of information on the Internet from a single-source push-model to a multi-source pull model.
                </p>
                <SubSubTitle>Hello</SubSubTitle>
                <p>
                    Release: {version.revision}, date: {version.date}
                </p>
            </Text>
        </Container>
    );
}