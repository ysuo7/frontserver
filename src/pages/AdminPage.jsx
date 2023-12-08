import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, CssBaseline, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Switch } from '@mui/material';

const AdminPage = () => {
    const { apiURL, userId } = useContext(AuthContext); // 获取当前登录用户的ID
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': jwtToken,
        };

        fetch(`${apiURL}/secure/admin/getUsers`, {
            method: 'GET',
            headers: headers,
        })
            .then(response => response.json())
            .then(data => {

                setUsers(data.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            });
    }, [apiURL]);

    const handleSwitchChange = (userId, status) => {
        setIsUpdating(true);

        fetch(`${apiURL}/secure/admin/userActivation/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken,
            },
        })
            .then(response => response.json())
            .then(data => {


                const updatedUsers = users.map(user => {
                    if (user.uid === userId) {
                        user.status = !status;
                    }
                    return user;
                });
                setUsers(updatedUsers);
            })
            .catch(error => {
                console.error('Error updating user status:', error);
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    const handleAdminSwitchChange = (userId, isAdmin) => {
        setIsUpdating(true);

        fetch(`${apiURL}/secure/admin/userPermission/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken,
            },
        })
            .then(response => response.json())
            .then(data => {

                const updatedUsers = users.map(user => {
                    if (user.uid === userId) {
                        user.isAdmin = !isAdmin;
                    }
                    return user;
                });
                setUsers(updatedUsers);
            })
            .catch(error => {
                console.error('Error updating user status:', error);
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ backgroundColor: '#ffffff' }}>
            <CssBaseline />
            <h1>Admin Page</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>
                                    Is Admin

                                </TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                // 检查当前用户的ID是否与登录用户的ID相匹配，如果相匹配，则不渲染该用户的行
                                user.uid !== userId && (
                                    <TableRow key={user.uid}>
                                        <TableCell>{user.uid}</TableCell>
                                        <TableCell>{user.displayName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={user.isAdmin}
                                                onChange={() => handleAdminSwitchChange(user.uid, user.isAdmin)}
                                                color="primary"
                                                name="isAdminStatus"
                                                inputProps={{ 'aria-label': 'admin status' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={user.status}
                                                onChange={() => handleSwitchChange(user.uid, user.status)}
                                                color="primary"
                                                name="userStatus"
                                                inputProps={{ 'aria-label': 'user status' }}
                                            />
                                        </TableCell>

                                    </TableRow>
                                )
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AdminPage;
