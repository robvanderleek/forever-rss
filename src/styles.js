import {styled} from "@mui/material";

export const Main = styled('div')({
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    outline: 'none'
});

export const Section = styled('div')((props) => ({
    borderStyle: props.active ? 'solid' : 'none',
    borderWidth: '1px',
    padding: props.active ? '0px' : '1px',
    overflow: 'auto'
}));

export const Area = styled('div')({
    height: '100%',
    outline: 'none'
});

export const CenteredArea = styled('div')({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none'
});