import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Modal } from 'antd';
import { useSelector } from 'react-redux';

function Favorite(props) {
    const user = useSelector(state => state.user)

    const movieId = props.movieId
    const userFrom = props.userFrom
    const movieTitle = props.movieInfo.title
    const moviePost = props.movieInfo.backdrop_path
    const movieRunTime = props.movieInfo.runtime

    const [FavoriteNumber, setFavoriteNumber] = useState(0)
    const [Favorited, setFavorited] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const variables = {
        movieId: movieId,
        userFrom: userFrom,
        movieTitle: movieTitle,
        moviePost: moviePost,
        movieRunTime: movieRunTime
    }

    const onClickFavorite = () => {
        if (user.userData && !user.userData.isAuth) {
            // Show modal if user is not authenticated
            setIsModalVisible(true);
            return;
        }

        if (Favorited) {
            // When already subscribed 
            axios.post('/api/favorite/removeFromFavorite', variables)
                .then(response => {
                    if (response.data.success) {
                        setFavoriteNumber(FavoriteNumber - 1)
                        setFavorited(!Favorited)
                    } else {
                        alert('Failed to Remove From Favorite')
                    }
                })
        } else {
            // When not subscribed yet
            axios.post('/api/favorite/addToFavorite', variables)
                .then(response => {
                    if (response.data.success) {
                        setFavoriteNumber(FavoriteNumber + 1)
                        setFavorited(!Favorited)
                    } else {
                        alert('Failed to Add To Favorite')
                    }
                })
        }
    }

    useEffect(() => {
        axios.post('/api/favorite/favoriteNumber', variables)
            .then(response => {
                if (response.data.success) {
                    setFavoriteNumber(response.data.subscribeNumber)
                } else {
                    alert('Failed to get Favorite Number')
                }
            })

        axios.post('/api/favorite/favorited', variables)
            .then(response => {
                if (response.data.success) {
                    setFavorited(response.data.subcribed)
                } else {
                    alert('Failed to get Favorite Information')
                }
            })
    }, [])

    const handleOk = () => {
        setIsModalVisible(false);
        // You can also add logic here for redirecting to the login page, if needed.
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            {/* Favorite Button */}
            <Button onClick={onClickFavorite} > {!Favorited ? "Add to Favorite" : "Not Favorite"} {FavoriteNumber}</Button>

            {/* Modal for login alert */}
            <Modal
                title="Please Log In"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={<a href="/login" style={{ textDecoration: 'none' }}>Go to Login</a>}
                cancelText="Cancel"
                centered
            >
                <p>You need to be logged in to add this movie to your favorites. Please log in first!</p>
            </Modal>
        </>
    )
}

export default Favorite
