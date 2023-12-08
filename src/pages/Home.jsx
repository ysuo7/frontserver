import React from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ListOfBooks from "../components/ListOfBooks";
import '../css/main.css'; 



const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        }
    }
});

const Home = () => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h2" sx={{display: 'block', width: '100%', textAlign: 'center', fontFamily: 'Caveat', fontWeight: 600, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '10px' }}> Online Book Shopping </Typography>               
                    <ListOfBooks sx={{mt: 3}}/>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Home;
