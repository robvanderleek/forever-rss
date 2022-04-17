import {Avatar, styled} from "@mui/material";

export const Main = styled('div')({
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    outline: 'none'
});

export const Section = styled('div')((props) => ({
    borderStyle: props.active ? 'solid' : 'none',
    borderWidth: '2px',
    borderImage: 'linear-gradient(to bottom, #c25096, #808ecd) 1',
    padding: props.active ? '0px' : '2px',
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

export const ItemAvatar = styled(Avatar)(props => ({
    width: '24px',
    height: '24px',
    backgroundColor: props.active ? '#808ecd' : 'none'
}));