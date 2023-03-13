import Footer from '@/components/Footer';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {LoginForm, ProFormText} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Helmet, history, useModel} from '@umijs/max';
import {Alert, message} from 'antd';
import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const LoginMessage: React.FC<{ content: string }> = ({content}) => {
    return (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type="error"
            showIcon
        />
    );
};

const Login: React.FC = () => {
    const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
    const {initialState, setInitialState} = useModel('@@initialState');

    const containerClassName = useEmotionCss(() => {
        return {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            backgroundImage:
                "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
            backgroundSize: '100% 100%',
        };
    });

    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();

        if (userInfo) {
            flushSync(() => {
                setInitialState((s) => ({
                    ...s,
                    currentUser: userInfo,
                }));
            });
        }
    };

    const handleSubmit = async (values: API.LoginParams) => {
        try {
            // 登录
            const msg = {status: 'ok', currentAuthority: 'admin'};
            if (msg.status === 'ok') {
                message.success(values.username + '，登录成功！');
                await fetchUserInfo();
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
                return;
            }
            // 如果失败去设置用户错误信息
            setUserLoginState(msg);
        } catch (error) {
            console.log(error);
            message.error('登录失败，请重试！');
        }
    };
    const {status} = userLoginState;

    return (
        <div className={containerClassName}>
            <Helmet>
                <title>登录 - {Settings.title}</title>
            </Helmet>

            <div style={{flex: '1', padding: '32px 0', marginTop: '15vh'}}>
                <LoginForm
                    contentStyle={{minWidth: 280, maxWidth: '75vw'}}
                    logo={<img alt="logo" src="/logo.svg"/>}
                    title="Provider Management System"
                    subTitle="华为云 Terraform Provider 智能管理系统，是中关村环保园最具影响力的平台"
                    onFinish={async (values) => {
                        await handleSubmit(values as API.LoginParams);
                    }}
                    initialValues={{username: 'admin', password: 'ant.design'}}
                >
                    {status === 'error' && <LoginMessage content={'用户或密码错误(admin/ant.design)'}/>}

                    <ProFormText
                        name="username"
                        placeholder={'用户名'}
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined/>,
                        }}
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    />

                    <ProFormText.Password
                        name="password"
                        placeholder={'密码'}
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined/>,
                        }}
                        rules={[
                            {
                                required: true,
                                message: '请输入密码！',
                            },
                        ]}
                    />
                </LoginForm>
            </div>
            <Footer/>
        </div>
    );
};

export default Login;
