import React from 'react';
// import Box from '@mui/material/Box';
import { Alert } from '@mui/material';

const Toast = ({ message, severity, onClose }) => {
    if (!message) return null;

    return (
        <Alert severity={severity}
            sx={{
                position: 'fixed', // 或 'absolute'
                top: '60px', // 调整以适应 Navbar 的高度
                left: '50%',
                transform: 'translateX(-50%)',
                // bgcolor: 'background.paper',
                // boxShadow: 1,
                // borderRadius: 2,
                // width: '1000px',
                p: 2,
                zIndex: 'tooltip', // 或您选择的其他合适的 z-index 值
            }}
        >
            {message}
            {/* <button onClick={onClose}>Close</button> */}
        </Alert>
    );
};

export default Toast;
