import React, { useState, useContext, useEffect } from 'react';
import { Box, TextField, Button, Switch, FormControlLabel, Paper, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

export default function BookListPage() {
    const { userId, apiURL, showNotification } = useContext(AuthContext);
    const [booklists, setBooklists] = useState([]);
    const [openBooklistId, setOpenBooklistId] = useState(null);
    const jwtToken = localStorage.getItem('jwtToken');

    const [newBooklist, setNewBooklist] = useState({
        name: '',
        isPrivate: false,
        description: ''
    });

    useEffect(() => {
        if (userId) { fetchBooklists(); }
    }, [userId, apiURL, jwtToken]);

    const fetchBooklists = () => {
        const url = `${apiURL}/secure/book/getAllBookList/${userId}`;
        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken,
            },
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                if (data.data.hasOwnProperty("index")) {
                    delete data.data.index;
                }

                const booklistsData = Object.entries(data.data).map(([key, value]) => ({
                    id: key,
                    bookListName: value.bookListName,
                    description: value.description,
                    lastEdit: value.lastEdit,
                    numOfBooks: value.numOfBooks,
                    owner: value.owner,
                    isPublic: value.public === "true", // Convert the string 'true'/'false' to boolean
                    totalPages: value.totalPages,
                }));

                setBooklists(booklistsData);
            })
            .catch(error => {
                console.error('Error fetching booklists:', error);
                showNotification('加载书单失败', 'error');
            });
    };

    const handleToggleCollapse = (booklistId) => {
        setOpenBooklistId(openBooklistId === booklistId ? null : booklistId);
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setNewBooklist({
            ...newBooklist,
            [name]: name === 'isPrivate' ? checked : value
        });
    };

    const handleAddBooklist = () => {
        const url = `${apiURL}/secure/book/bookList/${userId}`;
        const requestBody = {
            newBookList: {
                owner: "name",
                bookListName: newBooklist.name,
                totalPages: 0,
                numOfBooks: 0,
                public: newBooklist.isPrivate ? "false" : "true",
                description: newBooklist.description
            }
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken,
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setBooklists([...booklists, data.newBookList]);
                setNewBooklist({ name: '', isPrivate: false, description: '' });
                showNotification('新书单已创建', 'success');
            })
            .catch(error => {
                console.error('Error adding new booklist:', error);
                showNotification('创建书单失败', 'error');
            });
    };

    return (
        <Box sx={{ padding: 2 }}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>书单名称</TableCell>
                            <TableCell align="right">公开/私有</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {booklists.map((booklist) => (
                            <React.Fragment key={booklist.id}>
                                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => handleToggleCollapse(booklist.id)}>
                                            {openBooklistId === booklist.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {booklist.bookListName}
                                    </TableCell>
                                    <TableCell align="right">
                                        {booklist.isPublic ? '公开' : '私有'}
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* Implement edit/delete or other actions */}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={openBooklistId === booklist.id} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    {booklist.bookListName} Details
                                                </Typography>
                                                <Typography variant="body1">
                                                    Description: {booklist.description}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Last Edit: {booklist.lastEdit}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Number of Books: {booklist.numOfBooks}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Owner: {booklist.owner}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Total Pages: {booklist.totalPages}
                                                </Typography>
                                                {/* Add other details here */}
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>

                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="书单名称"
                        name="name"
                        value={newBooklist.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="描述"
                        name="description"
                        multiline
                        rows={4}
                        value={newBooklist.description}
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newBooklist.isPrivate}
                                onChange={handleChange}
                                name="isPrivate"
                            />
                        }
                        label={newBooklist.isPrivate ? '私有' : '公开'}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddBooklist}>
                        创建书单
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
