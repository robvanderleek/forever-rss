import {Avatar, ListItem as MuiListItem, styled} from "@mui/material";

export const Main = styled('div')`
    height: 100%;
    display: flex;
    flex-direction: row;
    outline: none;
`;

export const DesktopControls = styled('div')`
    width: 30%;
`;

export const DesktopContent = styled('div')`
    width: 70%;
`;

export const MobileControls = styled('div')`
    width: 100%;
`;

interface ActiveProps {
    active: 'true' | 'false'
}

export const ContentArea = styled('div')((props: ActiveProps) => ({
    height: '100%',
    overflow: 'auto',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: props.active === 'true' ? '#e6772b' : 'transparent',
    // borderStyle: props.active === 'true' ? 'solid' : 'none',
}));

export const LoadingArea = styled('div')`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    border-style: solid;
    border-width: 1px;
    border-color: #faf9fc;
`;

export const Area = styled('div')({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    outline: 'none'
});

export const FeedItem = styled(MuiListItem)((props: ActiveProps) => ({
    color: props.active === 'true' ? '#e6772b' : 'none'
}));

export const EntryItem = styled(MuiListItem)((props: ActiveProps) => ({
    color: props.active === 'true' ? '#e6772b' : 'none'
}));

export const ItemAvatar = styled(Avatar)((props: ActiveProps) => ({
    width: '24px',
    height: '24px',
    backgroundColor: props.active === 'true' ? '#e6772b' : 'none'
}));