import React, { useEffect, useState } from 'react';
import { Tooltip, Icon, Modal } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';  // Import Link for routing

function LikeDislikes(props) {
    const user = useSelector(state => state.user);

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    let variable = {};

    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId };
    } else {
        variable = { commentId: props.commentId, userId: props.userId };
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                if (response.data.success) {
                    setLikes(response.data.likes.length);
                    response.data.likes.forEach(like => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked');
                        }
                    });
                } else {
                    alert('Failed to get likes');
                }
            });

        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                if (response.data.success) {
                    setDislikes(response.data.dislikes.length);
                    response.data.dislikes.forEach(dislike => {
                        if (dislike.userId === props.userId) {
                            setDislikeAction('disliked');
                        }
                    });
                } else {
                    alert('Failed to get dislikes');
                }
            });
    }, [props.userId, variable]);

    const onLike = () => {
        if (user.userData && !user.userData.isAuth) {
            // Show modal if the user is not logged in
            setIsModalVisible(true);
            return;
        }

        if (LikeAction === null) {
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes + 1);
                        setLikeAction('liked');
                        if (DislikeAction !== null) {
                            setDislikeAction(null);
                            setDislikes(Dislikes - 1);
                        }
                    } else {
                        alert('Failed to increase the like');
                    }
                });
        } else {
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes - 1);
                        setLikeAction(null);
                    } else {
                        alert('Failed to decrease the like');
                    }
                });
        }
    };

    const onDisLike = () => {
        if (user.userData && !user.userData.isAuth) {
            // Show modal if the user is not logged in
            setIsModalVisible(true);
            return;
        }

        if (DislikeAction !== null) {
            Axios.post('/api/like/unDisLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes - 1);
                        setDislikeAction(null);
                    } else {
                        alert('Failed to decrease dislike');
                    }
                });
        } else {
            Axios.post('/api/like/upDisLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes + 1);
                        setDislikeAction('disliked');
                        if (LikeAction !== null) {
                            setLikeAction(null);
                            setLikes(Likes - 1);
                        }
                    } else {
                        alert('Failed to increase dislike');
                    }
                });
        }
    };

    const handleOk = () => {
        setIsModalVisible(false); // Close modal after OK is clicked
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close modal if Cancel is clicked
    };

    return (
        <React.Fragment>
            {/* Like Button */}
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon
                        type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>&nbsp;&nbsp;&nbsp;&nbsp;

            {/* Dislike Button */}
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>

            {/* Modal for login alert */}
            <Modal
                title="Please Log In"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={<a href="/login" style={{ textDecoration: 'none' }}>Go to Login</a>} // Add Link to redirect to login
                cancelText="Cancel"
                centered
            >
                <p>You need to be logged in to like or dislike this content. Please log in first!</p>
            </Modal>
        </React.Fragment>
    );
}

export default LikeDislikes;
