import React from "react";
// import * as React from 'react';

import Link from '@mui/material/Link';

import Typography from '@mui/material/Typography';
import MyTable from "./CartSummary";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                9065 Project
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Footer = () => {
    return (
        <div>
            <Copyright/>
            {/* <MyTable /> */}
        </div>

    )
}

export default Footer