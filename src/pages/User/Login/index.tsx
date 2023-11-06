import Footer from '@/components/Footer';
import {currentUser, login} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {Alert, Button, message, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import {FormattedMessage, history, useModel} from 'umi';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState<boolean>(false);

  useEffect(() => {
    currentUser().then(r => {
      if (r.id !== 0) {
        const autoLoginFlag = localStorage.getItem("autoLogin")
        if (autoLoginFlag === "false") {
          setAutoLogin(true);
          message.info('自动登录成功，点击下方链接进入系统')
          return
        }

        message.info('自动登录成功，正在跳转')
        const {query} = history.location;
        const {redirect} = query as { redirect: string };
        setTimeout(() => {
          window.open(redirect || '/huaweicloud', '_self');
        }, 500)
      }
    })
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({...values});
      if (msg.id !== 0) {
        localStorage.removeItem('autoLogin')
        message.success('登录成功!');
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        const {redirect} = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      // 如果失败去设置用户错误信息
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content} style={{marginTop: '10vh'}}>
        <LoginForm
          logo={<img alt="logo" src="/images/logo-login.svg"/>}
          title="Provider Management System"
          subTitle=' '
          initialValues={{
            autoLogin: true,
          }}
          actions={autoLogin ? [
            <FormattedMessage
              key="loginWith"
              id="pages.login.loginWith"
              defaultMessage="本机已登录"
            />,
            <Button type={'link'} key={'loginBtn'}
                    onClick={() => {
                      localStorage.removeItem('autoLogin');
                      const {query} = history.location;
                      const {redirect} = query as { redirect: string };
                      history.push(redirect || '/');
                    }}
            >
              直接进入系统
            </Button>,
          ] : []}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={'account'}>
            <Tabs.TabPane
              key="account"
              tab={'登录系统'}
            />
          </Tabs>

          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon}/>,
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon}/>,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
          </>
          <div style={{marginBottom: 24}}>
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;
