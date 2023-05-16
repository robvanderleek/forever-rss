import {styled} from "@mui/material";

interface ActiveProps {
    active: 'true' | 'false'
}

export const ContentArea = styled('div')((props: ActiveProps) => ({
    height: '100vh',
    overflow: 'auto',
    padding: '80px',
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

export const DefaultContentArea = styled(ContentArea)`
  align-items: center;
  justify-content: center;
`;