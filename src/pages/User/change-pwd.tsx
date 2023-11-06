import type {ProFormInstance} from '@ant-design/pro-components';
import {
    ProForm,
    ProFormText,
} from '@ant-design/pro-components';
import {message} from 'antd';
import {useRef} from 'react';
import {changePwd} from "@/services/portal/api";

const UserSetting = () => {
    const formRef = useRef<
        ProFormInstance<{
            password: string;
            newPwd?: string;
            confirmPwd: string;
        }>
    >();
    return (
        <ProForm<{
            password: string;
            newPwd?: string;
            confirmPwd: string;
        }>
            onFinish={async (values) => {
                if (values.confirmPwd != values.newPwd) {
                    message.error("新密码两次输入不一致，请重新输入")
                    return;
                }
                changePwd(values.password, values.newPwd).then((d) => {
                    message.success('修改成功');
                }).catch(() => {
                })
            }}
            formRef={formRef}
            formKey="change-pwd"
            autoFocusFirstInput
        >
            <ProForm.Group>
                <ProFormText.Password name="password" label="原密码" width="500px" required ty/>
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText.Password name="newPwd" label="新密码" width="500px" required/>
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText.Password name="confirmPwd" label="确认密码" width="500px" required/>
            </ProForm.Group>
        </ProForm>
    );
};

export default UserSetting;
