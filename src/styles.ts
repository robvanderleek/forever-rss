import {Avatar, ListItem as MuiListItem, styled} from "@mui/material";

export const Main = styled('div')({
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    outline: 'none'
});

interface SectionProps {
    active: boolean
}

export const Section = styled('div')((props: SectionProps) => ({
    borderStyle: props.active ? 'solid' : 'none',
    borderWidth: '2px',
    padding: props.active ? '0px' : '2px',
    overflow: 'auto'
}));

export const Area = styled('div')({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    outline: 'none'
});

export const CenteredArea = styled('div')({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none'
});

export const ContentArea = styled('div')({
    height: '100%',
    overflow: 'auto'
});


interface ActiveProps {
    active: number
}

export const FeedItem = styled(MuiListItem)((props: ActiveProps) => ({
    color: props.active ? '#e6772b' : 'none'
}));

export const EntryItem = styled(MuiListItem)((props: ActiveProps) => ({
    color: props.active ? '#e6772b' : 'none'
}));

export const ItemAvatar = styled(Avatar)((props: ActiveProps) => ({
    width: '24px',
    height: '24px',
    backgroundColor: props.active ? '#faf9fc' : 'none'
}));