import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

function ForgotPasswordPage() {
    const [message, setMessage] = useState("");

    const onFinish = async (values) => {
        console.log('Form submitted with:', values);  // Debug log
        try {
            const response = await axios.post('/api/users/forgot_password', { email: values.email });
            console.log(response);  // Log response to ensure the API call is successful
            setMessage(response.data.message);
        } catch (error) {
            console.error(error);  // Log the error
            setMessage("An error occurred, please try again.");
        }
    };

    function handleClick () {
            setMessage("Reset link was sent to adamdakdouk2003@gmail.com")
    }
    
    return (
        <div className="app">
            <Title level={2}>Forgot Password</Title>
            <Form onFinish={onFinish} style={{ width: '350px' }}>
                {/* Add name to Form.Item for form value binding */}
                <Form.Item
                    name="email"  // This is necessary for form submission
                    rules={[{ required: true, message: 'Please input your email!' }]} // Validation rule
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleClick}>
                        Send Reset Link
                    </Button>
                </Form.Item>
                {message && <p>{message}</p>}
            </Form>
        </div>
    );
}

export default ForgotPasswordPage;
