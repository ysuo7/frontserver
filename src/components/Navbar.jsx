import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '@mui/material/Button';
import { Link as RouterLink } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function PrimarySearchAppBar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const { isLoggedIn, logout, username, isAdmin } = useContext(AuthContext);

    const [searchInput, setSearchInput] = useState(''); // 添加一个状态来控制搜索输入

    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchQuery = formData.get('searchQuery');

        if (searchQuery.trim()) {
            // 如果搜索框有内容，则构建查询字符串并进行搜索
            const queryString = new URLSearchParams(formData).toString();
            navigate(`/searchresult?${queryString}`); // 导航到搜索结果页面
            setSearchInput(''); // 清空搜索输入框
        } else {
            // 如果搜索框没有内容，则直接跳转到搜索结果页面
            navigate('/searchresult');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // 注销后重定向到登录页面
        } catch (error) {
            console.error('注销失败:', error);
            // 可选：处理错误，如显示通知
        }
    };

    // const handleProfileMenuOpen = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {/* 添加 Home 按钮 */}
            <MenuItem component={RouterLink} to="/">
                Home
            </MenuItem>

            {/* 如果未登录，显示 Login 和 Register 按钮 */}
            {!isLoggedIn && (

                <MenuItem component={RouterLink} to="/login">
                    Login
                </MenuItem>


            )}
            {!isLoggedIn && (
                <MenuItem component={RouterLink} to="/register">
                    Register
                </MenuItem>
            )}

            {isAdmin && (
                <MenuItem component={RouterLink} to="/adminpage">
                    admin
                </MenuItem>
            )}

            {/* 显示 Cart 和 Checkout 按钮 */}
            <MenuItem component={RouterLink} to="/cart">
                Cart
            </MenuItem>
            <MenuItem component={RouterLink} to="/booklist">
                SelfList
            </MenuItem>
            <MenuItem component={RouterLink} to="/orderhistory">
                OrderHistory
            </MenuItem>

            {/* 如果已登录，显示 Logout 按钮 */}
            {isLoggedIn && (
                <MenuItem onClick={handleLogout}>
                    Logout
                </MenuItem>
            )}



            {/* 如果已登录，显示用户名 */}
            {isLoggedIn && (
                <MenuItem>
                    {username}
                </MenuItem>
            )}


        </Menu>
    );


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        MyStore
                    </Typography>
                    {/* <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search> */}
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <form onSubmit={handleSearch} id="searchForm">
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                name="searchQuery"
                                value={searchInput} // 控制组件的值
                                onChange={e => setSearchInput(e.target.value)} // 更新状态以反映输入
                            />
                        </form>
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }} component={RouterLink} to="/">
                            Home
                        </Button>
                        {/* 如果未登录，显示 Login 和 Register 按钮 */}
                        {!isLoggedIn && (
                            <>
                                <Button sx={{ my: 2, color: 'white', display: 'block' }} component={RouterLink} to="/login">
                                    Login
                                </Button>
                                <Button sx={{ my: 2, color: 'white', display: 'block' }} component={RouterLink} to="/register">
                                    Register
                                </Button>
                            </>
                        )}
                        {isAdmin && (
                            <>
                                <Button sx={{ my: 2, color: 'white', display: 'block' }} component={RouterLink} to="/adminpage">
                                    Admin
                                </Button>
                            </>
                        )}

                        <Button sx={{ my: 2, color: 'white', display: 'block' }} component={RouterLink} to="/cart">
                            Cart
                        </Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }} component={RouterLink} to="/booklist">
                            SelfList
                        </Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }} component={RouterLink} to="/orderhistory">
                            OrderHistory
                        </Button>

                        {/* 如果已登录，显示 Logout 按钮 */}
                        {isLoggedIn && (
                            <Button
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        )}
                        {isLoggedIn && (
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {username}
                            </Typography>
                        )}

                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}