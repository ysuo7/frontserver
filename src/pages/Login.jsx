import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { auth } from '../utils/firebase';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        }
    }
});

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Login() {
    // 使用 useContext 钩子获取 login 方法
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await login(data.get('email'), data.get('password'));
            // 登录成功后，导航到首页
            navigate('/');
        } catch (error) {
            // 登录失败时的处理逻辑
            console.error('登录失败:', error);
            // 这里可以添加一些用户提示，如显示一个错误消息
        }
    };

    const handleGoogleLogin = async (event) => {
        event.preventDefault();
        // const data = new FormData(event.currentTarget);
        try {
            await googleLogin();
            // 登录成功后，导航到首页
            navigate('/');
        } catch (error) {
            // 登录失败时的处理逻辑
            console.error('登录失败:', error);
            // 这里可以添加一些用户提示，如显示一个错误消息
        }
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline/>
            <Container component="main" maxWidth="xs">
            <Paper 
                    elevation={6} 
                    sx={{ margin: 2, padding: 2, backgroundColor: '#f5f5f5'
                    }}
                >
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 1, mb: 2 }}
                            onClick={handleGoogleLogin}>Sign in with Google</Button>

                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}