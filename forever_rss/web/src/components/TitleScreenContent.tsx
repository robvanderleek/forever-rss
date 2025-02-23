import {HeroArea, HeroImage, SubTitle, Text, Title} from "../components/Content.style";
import {Container} from "@mui/material";

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
                <SubTitle>Your Internet inbox</SubTitle>
                <p>
                    RSS reverses the flow of information on the Internet from a single-source push model to a
                    multi-source pull model. Users of RSS are their own algorithm for selecting what to read from where.
                    The technology is old but not obsolete, it just needs the right tools.
                </p>
                <SubTitle>Why Forever RSS?</SubTitle>
                <ul>
                    <li>Responsive design, one app for desktop and mobile</li>
                    <li>Keyboard navigation on desktop, swipe navigation on mobile</li>
                    <li>Minimalistic and clean design</li>
                    <li>Modern technology stack, open for collaborative development</li>
                </ul>
                <SubTitle>Looking for feedback</SubTitle>
                Find this app interesting but missing a feature? Found a bug? Have a suggestion?<br/>
                <a href="https://github.com/robvanderleek/forever-rss">Let me know by opening an issue!</a>
                <p>
                    Release: SOME_VERSION, date: SOME_DATE
                </p>
            </Text>
        </Container>
    );
}