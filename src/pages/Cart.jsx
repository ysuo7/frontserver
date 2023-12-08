import React, { useContext, useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// import { AuthContext } from './path-to/AuthContext'; // Update the path to AuthContext
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../css/main.css';

// 假设税率为10%（这应根据实际情况调整）
const TAX_RATE = 0.10;
// 假设运费固定为5.00（这应根据实际情况调整）
const SHIPPING_COST = 5.00;

const defaultTheme = createTheme();

const Cart = () => {
    const [isCheckoutAllowed, setIsCheckoutAllowed] = useState(false);
    const navigate = useNavigate();

    const { userId, apiURL, showNotification } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const jwtToken = localStorage.getItem('jwtToken');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    useEffect(() => {
        // 当购物车项目变化时，检查购物车是否为空
        setIsCheckoutAllowed(cartItems.length > 0);
    }, [cartItems]);

    const createOrder = async (orderDetails) => {
        try {
            const response = await fetch(`${apiURL}/secure/order/CreateOrder/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': jwtToken,
                },
                body: JSON.stringify(orderDetails)

            });


            const data = await response.json();
            if (response.ok) {
                // 订单创建成功后的处理

                // 可以在此处重定向到订单确认页面或显示订单信息
            } else {
                // 订单创建失败的处理
                console.error('Order creation failed', data);
            }
        } catch (error) {
            console.error('Error creating order', error);
        }
    };


    const fetchCartItems = async () => {
        try {

            const response = await fetch(`${apiURL}/secure/cart/getCart/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': jwtToken,
                },
            });

            if (response.ok) {
                const data = await response.json();

                // 将对象转换为数组
                const itemsArray = Object.values(data);
                setCartItems(Object.values(itemsArray[0]));
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };
    const updateQuantity = async (bookId, quantityChange) => {
        try {
            const response = await fetch(`${apiURL}/secure/cart/updateCart/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'authorization': jwtToken,
                },
                body: JSON.stringify({
                    userId,
                    newBook: {
                        bookId,
                        bookPrice: cartItems.find(item => item.bookId === bookId).bookPrice,
                        quantity: quantityChange
                    }
                })
            });

            if (response.ok) {
                // 更新成功后，重新获取购物车数据
                showNotification('Update cart successfully', 'success');
                fetchCartItems();
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const calculateTotalPrice = (book) => {
        return book.quantity * parseFloat(book.bookPrice);
    };

    // const calculateCartTotalPrice = () => {
    //     return cartItems.reduce((total, book) => total + calculateTotalPrice(book), 0);
    // };

    const calculateCartTotalPrice = () => {
        const subtotal = cartItems.reduce((total, book) => total + calculateTotalPrice(book), 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax + SHIPPING_COST;
        return { subtotal, tax, total };
    };

    // 用于格式化货币的函数
    const formatCurrency = (amount) => {
        return amount.toFixed(2);
    };

    // 获取计算后的总价
    const { subtotal, tax, total } = calculateCartTotalPrice();


    const handleChange = (e) => {
        setCardDetails({
            ...cardDetails,
            [e.target.name]: e.target.value
        });
    };

    const handlePayment = async () => {

        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add some products before checkout.");
            return;
        }
        try {
            const response = await fetch(`${apiURL}/secure/order/process-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': jwtToken,
                },
                body: JSON.stringify({
                    ...cardDetails,
                    uid: userId
                })
            }).finally(() => {
                setOpenPopup(false);
            });;
            const data = await response.json();
            if (data.data === 'success') {
                // Handle success, such as showing a confirmation message
                // and/or redirecting to a success page

                const books = cartItems.reduce((details, item, index) => {
                    const bookKey = `book${index + 1}`;
                    details[bookKey] = {
                        title: item.bookId,
                        author: item.author,
                        prive: item.bookPrice,
                        quantity: item.quantity.toString()
                    };
                    return details;
                }, {});

                const orderDetails = {
                    orderDetail: {
                        ...books, // 扩展书籍详情
                        total: subtotal.toFixed(2),
                        shipment: SHIPPING_COST.toFixed(2),
                        tax: tax.toFixed(2),
                        final: total.toFixed(2)
                    }
                };

                await createOrder(orderDetails);
                showNotification('Paid successfully', 'success')
                navigate('/orderhistory');
            } else {
                // Handle failure, such as showing an error message

                showNotification('Check your payment information again', 'error');
            }
        } catch (error) {
            console.error('Payment error:', error);
        }


    };

    const handleCheckout = () => {
        // 显示结账表单
        setOpenPopup(true);
    };



    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h2" sx={{ display: 'block', width: '100%', textAlign: 'center', fontFamily: 'Caveat', fontWeight: 600, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '10px' }}>
                        Cart
                    </Typography>
                    <TableContainer sx={{ mt: 3 }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="cart table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Book Name</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.bookId}>
                                        <TableCell component="th" scope="row">
                                            {item.bookId}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => updateQuantity(item.bookId, -1)}>
                                                <RemoveIcon />
                                            </IconButton>
                                            {item.quantity}
                                            <IconButton onClick={() => updateQuantity(item.bookId, 1)}>
                                                <AddIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="right">${item.bookPrice}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {isCheckoutAllowed && (
                        <Paper
                            elevation={6}
                            sx={{ backgroundColor: '#f5f5f5' }}>
                            <Box sx={{ m: 4 }}>
                                <Typography variant="h6" component="div">
                                    Subtotal: ${formatCurrency(subtotal)}
                                </Typography>
                                <Typography variant="h6" component="div">
                                    Shipping: ${formatCurrency(SHIPPING_COST)}
                                </Typography>
                                <Typography variant="h6" component="div">
                                    Tax: ${formatCurrency(tax)}
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    Total: ${formatCurrency(total)}
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    <Dialog open={openPopup} onClose={() => setOpenPopup(false)} >
                        <DialogTitle >
                            <Typography style={{ fontSize: '45px', margin: 0, padding: 0 }} sx={{ textAlign: 'center', fontFamily: 'Caveat', fontWeight: 600 }}>Process Payment</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box component="form" sx={{ mt: 1, width: '100%' }}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="cardNumber"
                                    label="Card Number"
                                    name="cardNumber"
                                    // autoComplete="cc-number"
                                    autoFocus
                                    onChange={handleChange}
                                    value={cardDetails.cardNumber}
                                    inputProps={{
                                        pattern: "\\d{16}", // 正则表达式，要求输入16位数字
                                        title: "Please enter a 16-digit card number",
                                    }}
                                    error={!!cardDetails.cardNumber && !/^\d{16}$/.test(cardDetails.cardNumber)}
                                    helperText={cardDetails.cardNumber && !/^\d{16}$/.test(cardDetails.cardNumber) ? "Please enter a valid 16-digit card number" : ""}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="expiryDate"
                                    label="Expiry Date"
                                    type="text"
                                    id="expiryDate"
                                    // autoComplete="cc-exp"
                                    onChange={handleChange}
                                    value={cardDetails.expiryDate}
                                    inputProps={{
                                        pattern: "(0[1-9]|1[0-2])/(\\d{2})", // 正则表达式，要求输入格式为MM/YY
                                        title: "Please enter a valid expiry date in MM/YY format",
                                    }}
                                    error={!!cardDetails.expiryDate && !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardDetails.expiryDate)}
                                    helperText={cardDetails.expiryDate && !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardDetails.expiryDate) ? "Please enter a valid expiry date in MM/YY format" : ""}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="cvv"
                                    label="CVV"
                                    type="text"
                                    id="cvv"
                                    // autoComplete="cc-csc"
                                    onChange={handleChange}
                                    value={cardDetails.cvv}
                                    inputProps={{
                                        pattern: "\\d{3,4}", // 正则表达式，要求输入为3或4位数字
                                        title: "Please enter a valid CVV (3 or 4 digits)",
                                    }}
                                    error={!!cardDetails.cvv && !/^\d{3,4}$/.test(cardDetails.cvv)}
                                    helperText={cardDetails.cvv && !/^\d{3,4}$/.test(cardDetails.cvv) ? "Please enter a valid CVV (3 or 4 digits)" : ""}
                                />

                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={handlePayment}
                                >
                                    Pay Now
                                </Button>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenPopup(false)}>Cancel</Button>
                        </DialogActions>
                    </Dialog>

                    {isCheckoutAllowed && (
                        <Button variant="contained" color="primary" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
};


export default Cart;