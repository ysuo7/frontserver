import React, { useContext, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthContext } from "../context/AuthContext";

const defaultTheme = createTheme();

// ...rest of your imports

const OrderHistory = () => {
    const { apiURL, userId } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const jwtToken = localStorage.getItem('jwtToken');
    // const userId = localStorage.getItem('uid');

    useEffect(() => {
        if (userId !== null) { fetchOrderHistory(); }
    }, [userId]);

    const fetchOrderHistory = async () => {
        try {

            const response = await fetch(`${apiURL}/secure/order/getAllOrders/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': jwtToken,
                },
            });
            // console.log('3');
            // console.log(userId);
            if (response.ok) {
                const fetchedData = await response.json();
                const fetchedOrders = fetchedData.data; // Access the 'data' property
                setOrders(Object.entries(fetchedOrders).map(([orderId, orderDetails]) => ({
                    orderId,
                    ...orderDetails,
                    books: Object.entries(orderDetails).filter(([key]) => key.startsWith('book')),
                })));
            } else {
                console.error('Failed to fetch order history');
            }
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h2" sx={{display: 'block', width: '100%', textAlign: 'center', fontFamily: 'Caveat', fontWeight: 600, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '10px' }}> Order History </Typography>
                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="order history table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell align="right">Books</TableCell>
                                    <TableCell align="right">Date/Time</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="right">Shipment</TableCell>
                                    <TableCell align="right">Tax</TableCell>
                                    <TableCell align="right">Final</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.orderId}>
                                        <TableCell component="th" scope="row">
                                            {order.orderId}
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.books.map(([bookId, bookDetails], index) => (
                                                <Box key={bookId}>
                                                    {`Book ${bookDetails.title}: ${bookDetails.quantity} x $${bookDetails.prive}`}
                                                </Box>
                                            ))}
                                        </TableCell>
                                        <TableCell align="right">{order.datetime}</TableCell>
                                        <TableCell align="right">${order.total}</TableCell>
                                        <TableCell align="right">${order.shipment}</TableCell>
                                        <TableCell align="right">${order.tax}</TableCell>
                                        <TableCell align="right">${order.final}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default OrderHistory;
