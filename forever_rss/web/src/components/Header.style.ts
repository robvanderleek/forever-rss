import {styled, Toolbar} from "@mui/material";

export const Title = styled('span')({
    marginLeft: '12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontFamily: 'Roboto, sans-serif'
});

export const HeaderToolbar = styled(Toolbar)`
    display: flex;
    justify-content: space-between;
`;

export const LogoImg = styled('img')`
    margin-left: 16px;
    margin-right: 16px;
`;