import {styled, Toolbar} from "@mui/material";
import Image from "next/image";

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

export const LogoImg = styled(Image)`
  margin-left: 16px;
  margin-right: 16px;
`;