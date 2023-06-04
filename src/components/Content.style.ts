import {styled} from "@mui/material";

interface ActiveProps {
    active: 'true' | 'false'
}

export const ContentArea = styled('div')((props: ActiveProps) => ({
    height: '100vh',
    overflow: 'auto',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: props.active === 'true' ? '#e6772b' : 'transparent',
    outline: 0
}));

export const HeroArea = styled('div')`
  display: flex;
  justify-Content: center;
`;

export const HeroImage = styled('img')`
  width: 75%;
`;

export const Title = styled('h1')`
  font-size: 42px;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
`;

export const SubTitle = styled('h2')`
  font-size: 30px;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
`;

export const SubSubTitle = styled('h3')`
  font-size: 24px;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
`;

export const Text = styled('span')`
  font-size: 20px;
  font-family: source-serif-pro, Georgia, Cambria, "Times New Roman", Times, serif;
  font-weight: 400;
  word-break: break-word;
`;