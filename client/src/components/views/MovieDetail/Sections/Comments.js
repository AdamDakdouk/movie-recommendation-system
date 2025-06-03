import React, { useState } from 'react';
import { Button, Input, Typography, Modal } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link for routing
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
const { TextArea } = Input;
const { Title } = Typography;

function Comments(props) {
    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const handleChange = (e) => {
        setComment(e.currentTarget.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (user.userData && !user.userData.isAuth) {
            // Show modal if user is not logged in
            setIsModalVisible(true);
            return;
        }

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId,
        };

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setComment("");
                    props.refreshFunction(response.data.result);
                } else {
                    alert('Failed to save Comment');
                }
            });
    };

    const handleOk = () => {
        setIsModalVisible(false); // Close modal after OK is clicked
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close modal if Cancel is clicked
    };

    return (
        <div>
            <br />
            <Title level={3}> Share your opinions about {props.movieTitle} </Title>
            <hr />
            {/* Comment Lists */}
            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={comment._id}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            {props.CommentLists && props.CommentLists.length === 0 &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    Be the first one who shares your thought about this movie
                </div>
            }

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="write some comments"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>

            {/* Modal for login alert */}
            <Modal
                title="Please Log In"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={<Link to="/login" style={{ textDecoration: 'none' }}>Go to Login</Link>} // Add Link to redirect to login
                cancelText="Cancel"
                centered
            >
                <p>You need to be logged in to comment. Please log in first!</p>
            </Modal>
        </div>
    );
}

export default Comments;
