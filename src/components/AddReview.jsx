import React, { useState, useContext } from 'react';
import { Typography, TextareaAutosize, Button, Paper, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const AddReview = ({ bookListId, onAddReview, userName, ownerId }) => {
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { apiURL, userId } = useContext(AuthContext);
    const jwtToken = localStorage.getItem('jwtToken')

    const handleReviewTextChange = (event) => {
        setReviewText(event.target.value);
    };

    const handleAddReview = async () => {
        if (!reviewText.trim()) {
            alert('评论不能为空。');
            return;
        }

        setIsSubmitting(true);
        try {
            // 这里替换成您的实际提交逻辑
            const response = await fetch(`${apiURL}/secure/book/booklist/addReview/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                    'Authorization': jwtToken,
                },
                body: JSON.stringify({
                    'blid': bookListId,
                    'content': reviewText,
                    'userName': userName,
                    'oid': 'leo1',
                    'uid': userId,
                })
            });

            // const data = await response.json();

            if (response.ok) {
                // onAddReview(data); // 假设这是服务器返回的评论数据
                setReviewText('');
            } else {
                throw new Error('添加评论失败');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const paperStyle = {
        padding: '16px',
        background: '#ffffff',
    };

    return (
        <Paper elevation={3} style={paperStyle}>
            <TextareaAutosize
                minRows={4}
                cols={50}
                value={reviewText}
                onChange={handleReviewTextChange}
                placeholder="在此输入您的评论"
                disabled={isSubmitting}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddReview}
                disabled={isSubmitting}
            >
                {isSubmitting ? <CircularProgress size={24} /> : '添加评论'}
            </Button>
        </Paper>
    );
};

export default AddReview;
