import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { AuthContext } from '../context/AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { Tune } from '@mui/icons-material';
import '../css/main.css';
// import Toast from '../utils/Toast';
// import Image from '@mui/material/Image'; // 添加这个导入来显示图片


function createData(id, title, author, imgLinkSmall, price, currency, publisher, publishedDate, pageCount) {
    return {
        id,
        title,
        author: author[0], // Assuming author is an array of strings
        imgLinkSmall,
        price: parseFloat(price).toFixed(2), // Ensure price is a string with 2 decimal places
        currency,
        publisher,
        publishedDate,
        pageCount
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [isBookFetching, setIsBookFetching] = useState(false);
    const [isListFetching, setIsListFetching] = useState(false);
    const [bookDetails, setBookDetails] = useState(null);
    const [bookListDetails, setBookListDetails] = useState(null);
    const { userId, apiURL, showNotification, isLoggedIn } = useContext(AuthContext);
    const jwtToken = localStorage.getItem('jwtToken');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedBook, setSelectedBook] = useState({});

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


    const handleAddToCart = () => {
        // 构建请求体
        const requestBody = {
            userId: userId, // 这里的 userId 应该是动态获取的，根据你的应用逻辑
            newBook: {
                bookId: row.title, // 假设 row 对象有一个 id 属性
                bookPrice: row.price,
                quantity: 1 // 假设每次添加到购物车数量为 1
            }
        };

        // 执行 POST 请求
        fetch(`${apiURL}/secure/cart/updateCart/${userId}`, { // 这里的 URL 应该替换为你的购物车 API 的实际 URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': jwtToken,
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {

                if (response.ok) {
                    return response.json();

                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {

                showNotification('Book added to book list', 'success')
                // 这里可以添加一些用户反馈，比如使用 Toast 组件显示成功消息
            })
            .catch(error => {
                console.error('Error adding book to book list:', error);
                // 这里可以添加错误处理，比如显示一个错误消息
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
            <Grid item xs={12} sm={6} md={4} sx={{ width: '100%', height: '100%' }}>
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
                                        <img src={bookDetails.volumeInfo.imageLinks.medium} alt={`Cover of ${bookDetails.volumeInfo.title}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
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
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        imgLinkSmall: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
    }).isRequired,
};

export default function ListOfBooks() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const { apiURL } = useContext(AuthContext);


    function fetchData() {
        fetch(`${apiURL}/open/book/random`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const newRows = data.data.map((book, index) => {
                    // 确保你的书籍对象中有一个id字段
                    return createData(book.id, book.title, book.author, book.imgLinkSmall, book.price, book.currency, book.publisher, book.publishedDate, book.pageCount);
                });
                setBooks(newRows);

            })
            .catch(error => console.error('Error fetching data:', error));
    }

    return (
        <Grid container spacing={2}>
            {books.map((row) => (
                <Row key={row.id} row={row} />
            ))}
        </Grid>
    );
}
