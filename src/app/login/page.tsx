'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message, Spin } from 'antd';
import useAuth from '@/hooks/useAuth';

const { Title } = Typography;

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signin } = useAuth();
    const router = useRouter();
    const [isAntdLoaded, setIsAntdLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/project');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const checkAntStyles = () => {
            const antStyles = document.querySelector('link[href*="antd.min.css"]');
            if (antStyles) {
                antStyles.addEventListener('load', () => setIsAntdLoaded(true));
            } else {
                // Backup check if 'onload' doesn't trigger, assuming styles load within 1 second
                setTimeout(() => setIsAntdLoaded(true), 1000);
            }
        };

        checkAntStyles();
    }, []);

    const handleLogin = async () => {
        try {
            const success = await signin(email, password);
            if (success) {
                message.success('Login successful!');
                router.push('/project');
            } else {
                message.error('Incorrect password, please try again.');
            }
        } catch (error) {
            message.error('An error occurred during login.');
        }
    };

    const handleRegister = () => {
        router.push('/register');
    };

    if (!isAntdLoaded || isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '300px' }}>
                <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
                <Form onFinish={handleLogin}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" onClick={handleRegister} block>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
