import React, { createContext, useState, useEffect } from 'react';
import Toast from '../utils/Toast';
import { auth, db } from '../utils/firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useResolvedPath } from 'react-router-dom';

export const AuthContext = createContext({
    // username: null,
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // 新增的状态
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    // const [jwtToken, setJwtToken] = useState(null);
    const apiURL = 'http://100.24.8.95:3001';


    useEffect(() => {
        setIsLoading(true);

        const jwtToken = localStorage.getItem('jwtToken');

        if (jwtToken) {
            fetch(`${apiURL}/secure/user/verifyToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': jwtToken,
                },
                body: JSON.stringify({ idToken: jwtToken }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.isTokenValid) {
                        setIsLoggedIn(true);
                        setUsername(data.uemail);
                        setUserId(data.uid);

                        // 如果用户已经登录，查询 Firebase 数据库以获取用户详细信息
                        const userDocRef = doc(db, "users", data.uid);
                        getDoc(userDocRef)
                            .then(docSnapshot => {
                                if (docSnapshot.exists()) {
                                    const userData = docSnapshot.data();
                                    if (userData.status === false) {
                                        throw new Error('Account is deactivated, please contact the bookstore admin: admin@bookstore.ca');
                                    } else {
                                        setIsAdmin(userData.isAdmin === true);
                                    }
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching user data from Firestore:', error);
                                setIsAdmin(false); // 设置为非管理员以防出错
                            });
                    } else {
                        localStorage.removeItem('jwtToken');
                        setIsLoggedIn(false);
                    }
                })
                .catch(error => {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('jwtToken');
                    setIsLoggedIn(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoggedIn(false);
            setIsLoading(false);
        }
    }, []);

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();
            const uid = user.uid;
            // localStorage.setItem(uid, uid);

            await getDoc(doc(db, "users", user.uid)).then((docSnapshot) => {
                if (!docSnapshot.exists()) {
                    setDoc(doc(db, "users", user.uid), {
                        email: user.email,
                        displayName: user.displayName,
                        isAdmin: false,
                        status: true,
                        createdAt: new Date() // Or use Firebase server timestamp
                    });
                } else {
                    const userData = docSnapshot.data();
                    if (userData.status === false) {
                        throw new Error('Account is deactivate, please contact the bookstore admin: admin@bookstore.ca');
                    } else {
                        if (userData.isAdmin === true) {
                            setIsAdmin(true);
                        } else {
                            setIsAdmin(false)
                        }
                    }

                }
            });
            setUsername(user.email); // Updated this line
            setUserId(uid);
            localStorage.setItem('jwtToken', idToken); // Store the token in local storage
            setIsLoggedIn(true);
            showNotification('Login successfully', 'success');
            // Additional logic here (e.g., store user info, navigate)
        } catch (error) {
            console.error('Error during Google sign in:', error);
            const errorMessage = error.message || 'Account is deactivate, please contact the bookstore admin: admin@bookstore.ca'
            showNotification(errorMessage, 'error');
            throw new Error(errorMessage);
        }
    };


    const login = async (username, password) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(username, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            const uid = user.uid;

            // 访问 Firestore 数据库，获取用户文档
            const userDocRef = doc(db, "users", uid);
            const docSnapshot = await getDoc(userDocRef);

            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                // 检查用户的 status 状态
                if (userData.status === false) {
                    throw new Error('Account is deactivate, please contact the bookstore admin: admin@bookstore.ca');
                } else {
                    if (userData.isAdmin === true) {
                        setIsAdmin(true)
                    } else {
                        setIsAdmin(false)
                    }
                }
            } else {
                // 如果用户文档不存在，可以选择抛出错误或创建新的用户文档
                // 这里我们选择抛出错误
                throw new Error('Please register');
            }



            // 更新状态和本地存储
            localStorage.setItem('jwtToken', idToken);
            setUsername(username);
            setUserId(uid);
            setIsLoggedIn(true);
            showNotification('登录成功', 'success');
        } catch (error) {
            // 捕获并处理错误
            console.error('登录失败:', error);
            const errorMessage = error.message || '登录错误';
            showNotification(errorMessage, 'error');
            throw new Error(errorMessage);
        }
    };




    const logout = async () => {
        try {
            // 使用 Firebase 注销用户
            await auth.signOut();

            // 清除本地存储中的 JWT 令牌
            localStorage.removeItem('jwtToken');

            setUserId(null);

            // 更新状态表明用户已注销
            setIsLoggedIn(false);

            setIsAdmin(false);

            // 显示注销成功的通知
            showNotification('成功注销', 'success');

            // 这里可以添加其他的清理逻辑，比如清除用户数据等

        } catch (error) {
            console.error('注销失败:', error);
            // 显示注销失败的通知
            showNotification('注销失败', 'error');
        }
    };


    const [toastMessage, setToastMessage] = useState('');

    const showNotification = (message, severity = 'info') => {
        setToastMessage({ message, severity });
        // 设置自动关闭通知的逻辑（可选）
        setTimeout(() => setToastMessage(''), 5000);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, apiURL, username, setUsername, isLoggedIn, isLoading, login, logout, showNotification, googleLogin, userId }}>
            {children}
            <Toast message={toastMessage.message}
                severity={toastMessage.severity} onClose={() => setToastMessage('')} />
        </AuthContext.Provider>
    );
};