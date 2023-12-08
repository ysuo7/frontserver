import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField'; // 这是新增的导入
import { AuthContext } from '../context/AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';



function createData(id, title, author, imgLinkSmall, price, currency) {
    // 如果 author 不存在或者为空字符串，将其设置为默认值
    const authorsArray = Array.isArray(author) ? author : (author ? [author] : ["Unknown"]);

    return {
        id,
        title,
        author: authorsArray.join(', '), // 现在 author 总是一个数组，并且处理了空值
        imgLinkSmall: imgLinkSmall || 'img/noimg.png', // 提供默认图片 URL
        price: parseFloat(price).toFixed(2),
        currency,
    };
}



function Row(props) {
    const { row, userId } = props;
    const [open, setOpen] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [isBookFetching, setIsBookFetching] = useState(false);
    const [isListFetching, setIsListFetching] = useState(false);
    const [bookDetails, setBookDetails] = useState(null);
    const [bookListDetails, setBookListDetails] = useState(null);
    const { apiURL, showNotification, isLoggedIn } = useContext(AuthContext);
    const jwtToken = localStorage.getItem('jwtToken');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedBook, setSelectedBook] = useState({});



    const handleAddToCart = () => {
        // 构建请求体
        const requestBody = {
            userId: userId,
            newBook: {
                bookId: row.title, // You might want to use a unique bookId instead of title
                bookPrice: row.price,
                quantity: 1,
            },
        };

        // 执行 POST 请求
        fetch(`${apiURL}/secure/cart/updateCart/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': jwtToken,
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => showNotification('Book added to cart:', 'success'))
            .catch(error => console.error('Error adding book to cart:', error));
    };

    const handleGetList = (bookDetail) => {
        setIsListFetching(true);
        fetch(`${apiURL}/secure/book/getAllbookList/${userId}`, { // 这里的 URL 应该替换为你的购物车 API 的实际 URL
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': jwtToken
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setSelectedBook({
                    "bookId": bookDetail.id,
                    "bookTitle": bookDetail.volumeInfo ? bookDetail.volumeInfo.title : bookDetail.title,
                    "bookAuthor": bookDetail.volumeInfo ? bookDetail.volumeInfo.authors[0] : bookDetail.author,
                    "pages": bookDetail.volumeInfo ? bookDetail.volumeInfo.pageCount : bookDetail.pageCount
                })
                delete data.data.index;
                setBookDetails(null)
                setBookListDetails(data.data)
                setOpenPopup(true)
            })
            .catch(error => {
                console.error('Error adding book to cart:', error);
            }).finally(() => {
                setIsListFetching(false);
            });
    };

    const handleView = (bookId) => {
        setIsBookFetching(true);
        fetch(`${apiURL}/open/book/getBook/${bookId}`, { // 这里的 URL 应该替换为你的购物车 API 的实际 URL
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setBookListDetails(null)
                setBookDetails(data.data);
                setOpenPopup(true)
            })
            .catch(error => {
                console.error('Error adding book to cart:', error);
            }).finally(() => {
                setIsBookFetching(false);
            });
    };

    const handleAddList = () => {
        // 构建请求体
        const requestBody = {
            action: "add", // 这里的 userId 应该是动态获取的，根据你的应用逻辑
            newBook: selectedBook
        };

        // 执行 POST 请求
        fetch(`${apiURL}/secure/book/bookList/${userId}/${selectedOption}`, { // 这里的 URL 应该替换为你的购物车 API 的实际 URL
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': jwtToken,
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {

                if (!response.ok) {
                    // If response is not ok, throw an error
                    return response.json().then(err => {
                        throw err
                    });
                }
                return response.json();
            })
            .then(data => {

                showNotification('Book added to book list', 'success')
                // 这里可以添加一些用户反馈，比如使用 Toast 组件显示成功消息
            })
            .catch(error => {
                showNotification(error.message, 'error')

            }).finally(() => {
                setSelectedBook({});
                setSelectedOption('');
                setBookDetails(null);
                setBookListDetails(null);
                setOpenPopup(false);
            });
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Grid item xs={12} sm={6} md={3} sx={{ width: '100%', height: '100%' }}>
                <Paper
                    elevation={6}
                    sx={{
                        margin: 2, padding: 2, transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1)', // Slightly scale up the Paper on hover
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' // Enhanced shadow effect on hover
                        },
                        backgroundColor: '#f5f5f5'
                    }}
                >
                    <Typography className="book-title" variant="h5" sx={{ width: '100%', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>{row.title}</Typography>
                    <Box sx={{ display: 'flex', marginTop: 5, alignItems: 'center' }}>
                        <img src={row.imgLinkSmall} alt={`Cover of the book "${row.title}"`} style={{ marginRight: 16, width: '100px', height: '150px' }} />
                        <Box sx={{ textAlign: 'left', marginBottom: 'auto' }}>
                            <Typography variant="h7">Publisher: {row.publisher}</Typography>
                            <br />
                            <Typography variant="h7">Date: {row.publishedDate}</Typography>
                            <br />
                            <Typography variant="h7">Author: {row.author[0]}</Typography>
                            <br />
                            <Typography variant="h7">Price: {`${row.price} ${row.currency}`}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Button variant="contained" color="primary" onClick={() => handleView(row.id)} sx={{ mt: 2 }}>
                            View
                        </Button>
                        <Button disabled={!isLoggedIn} variant="contained" color="primary" onClick={() => handleGetList(row)} sx={{ mt: 2 }}>
                            Add List
                        </Button>
                        <Button disabled={!isLoggedIn} variant="contained" color="primary" onClick={() => handleAddToCart(row.id)} sx={{ mt: 2 }}>
                            Add Cart
                        </Button>
                    </Box>
                </Paper>
            </Grid>
            <Dialog open={openPopup} onClose={() => { setOpenPopup(false); setBookListDetails(null); setBookListDetails(null) }} >
                {isBookFetching ? (
                    <div>Loading...</div>
                ) : bookDetails && (
                    <>
                        <DialogTitle >
                            <Typography style={{ fontSize: '45px', margin: 0, padding: 0 }} sx={{ textAlign: 'center', fontFamily: 'Caveat', fontWeight: 600 }}>Book Details</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ marginTop: 'auto', display: 'fix', justifyContent: 'space-between', width: '100%' }}>
                                <Grid item md={6} sx={{ height: '400px' }}>
                                    <Box sx={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={bookDetails.volumeInfo.imageLinks.medium} alt={`Cover of ${bookDetails.volumeInfo.title}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'fill' }} />
                                    </Box>
                                </Grid>
                                <Grid item md={6}>
                                    <Box>
                                        <Typography variant="h5" style={{ fontWeight: 'bold' }}>{row.title}</Typography>
                                        <Typography variant="subtitle1">{bookDetails.volumeInfo.subtitle}</Typography>
                                        <br />
                                        <Typography variant="body">by {bookDetails.volumeInfo.authors}</Typography>
                                        <br />
                                        <br />
                                        {bookDetails.volumeInfo.categories && bookDetails.volumeInfo.categories.length > 0 && (
                                            <div>
                                                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                                    Category:
                                                </Typography>
                                                <Typography variant="body2">{bookDetails.volumeInfo.categories.join(', ')}</Typography>
                                            </div>

                                        )}
                                        <br />
                                        <Typography variant="body2">Published by: {bookDetails.volumeInfo.publisher}</Typography>
                                        <Typography variant="body2">Published on: {bookDetails.volumeInfo.publishedDate}</Typography>
                                        <Typography variant="body2">Page: {bookDetails.volumeInfo.pageCount}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item md={12}>
                                    <Box>
                                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                            Public Description:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            dangerouslySetInnerHTML={{ __html: bookDetails.volumeInfo.description }}
                                            component="span" // Use span to keep it inline with the prefix
                                            sx={{ marginLeft: 1 }} // Adjust spacing as needed
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setOpenPopup(false); setBookListDetails(null); setBookListDetails(null) }}>Cancel</Button>
                            <Button disabled={!isLoggedIn} onClick={() => handleGetList(bookDetails)}>Add List</Button>
                            <Button disabled={!isLoggedIn} onClick={() => handleAddToCart(bookDetails.id)}>Add Cart</Button>
                        </DialogActions>
                    </>
                )}
                {isListFetching ? (
                    <div>Loading...</div>
                ) : bookListDetails && (
                    <Box sx={{ width: '100%', padding: 2 }}>
                        <Typography style={{ fontSize: '45px', margin: 0, padding: 0 }} sx={{ textAlign: 'center', fontFamily: 'Caveat', fontWeight: 600 }}>Select Book List to Add</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">BookList Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedOption}
                                label="Select the Book List you want to Add"
                                onChange={(event) => setSelectedOption(event.target.value)}
                            >
                                {Object.keys(bookListDetails).map(key => {
                                    return <MenuItem key={key} value={key}>{bookListDetails[key].bookListName}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <DialogActions>
                            <Button onClick={() => { handleAddList() }}>Add</Button>
                            <Button onClick={() => { setOpenPopup(false); setBookListDetails(null); setBookListDetails(null) }}>Cancel</Button>
                        </DialogActions>
                    </Box>
                )}
            </Dialog>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        author: (PropTypes.string).isRequired,
        imgLinkSmall: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
    }).isRequired,
    userId: PropTypes.string,
};


const SearchResultsPage = () => {
    const [books, setBooks] = useState([]);
    const [searchParams, setSearchParams] = useState({ title: '', author: '' }); // 初始搜索参数状态
    const location = useLocation();
    const { userId, apiURL } = useContext(AuthContext);

    useEffect(() => {
        // 当搜索参数变化时触发搜索
        const params = new URLSearchParams(location.search);
        if (params.toString()) {
            fetchSearchResults(params.toString());
        }
    }, [location.search]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleApplySearch = () => {
        const params = new URLSearchParams();

        // 只有当 title 和 author 字段非空时才添加到查询字符串
        if (searchParams.title) {
            params.append("title", searchParams.title);
        }
        if (searchParams.author) {
            params.append("author", searchParams.author);
        }

        // 生成查询字符串并进行搜索
        fetchSearchResults(params.toString());
    };

    const fetchSearchResults = (queryString) => {
        fetch(`${apiURL}/open/book/search?${queryString}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {

                const newRows = data.data.map(book =>
                    // 假设每本书都有一个id字段
                    createData(book.id, book.title, book.author, book.imgLinkSmall, book.price, book.currency, book.publisher, book.publishedDate, book.pageCount)
                );
                setBooks(newRows);
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Grid container spacing={2}>
            {books.map((row) => (
                <Row key={row.id} row={row} />
            ))}
        </Grid>
    );
};

export default SearchResultsPage;
