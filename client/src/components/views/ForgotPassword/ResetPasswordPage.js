import React, { useState } from "react";
import { withRouter } from "react-router-dom"; // Import `withRouter`
import { Form, Input, Button, Typography } from "antd";
import axios from "axios";
import BackToLogin from "../../BackToLogin/BackToLogin";

const { Title } = Typography;

function ResetPasswordPage(props) {
    const { token, history } = props;  // `history` comes from `withRouter` HOC

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(`/api/users/reset_password/${token}`, { password, confirmPassword });
            setMessage(response.data.message);
            if (response.data.success) {
                setTimeout(() => history.push("/login"), 3000); // Use `history.push` for navigation
            }
        } catch (error) {
            setMessage("An error occurred, please try again.");
        }
    };

    function handleClick() {
        setMessage("successfull")
    }
    return (
        <div className="app">
            <Title level={2}>Reset Password</Title>
            <Form onFinish={handleSubmit} style={{ width: '350px' }}>
                <Form.Item>
                    <Input.Password
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Input.Password
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleClick}>
                        Reset Password
                    </Button>
                </Form.Item>
                {message && <div><BackToLogin /></div>}
            </Form>
        </div>
    );
}

// Wrap the component with `withRouter` to inject `history` prop
export default withRouter(ResetPasswordPage);
