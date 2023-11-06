import type {ProFormInstance} from '@ant-design/pro-components';
import {
    ProForm,
    ProFormCascader,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormDigit,
    ProFormList,
    ProFormMoney,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import {TreeSelect, message, Divider} from 'antd';
import moment from 'dayjs';
import {useRef} from 'react';
import {changeUserSettings} from "@/services/portal/api";
import {useModel} from "@@/plugin-model/useModel";

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const UserSetting = () => {
    const {initialState} = useModel('@@initialState');

    console.log(initialState.currentUser)
    const formRef = useRef<
        ProFormInstance<{
            username: string;
            realName: string;
            email: string;
            githubAccount: string;
            clientIp: string;
        }>
    >();
    return (
        <ProForm<{
            username: string;
            realName: string;
            email: string;
            githubAccount: string;
            clientIp: string;
        }>
            onFinish={async (values) => {
                await formRef.current?.validateFields();
                await formRef.current?.validateFieldsReturnFormatValue?.();
                changeUserSettings(values);
            }}
            formRef={formRef}
            params={{email: '100'}}
            formKey="base-form-use-demo"
            autoFocusFirstInput
            request={async () => {
                return {
                    username: initialState?.currentUser.username,
                    realName: initialState?.currentUser.realName,
                    email: initialState?.currentUser.email,
                    githubAccount: initialState?.currentUser.githubAccount,
                    clientIp: initialState?.currentUser.clientIp
                };
            }}
        >
            <ProForm.Group>
                <ProFormText name="username" label="账号" width="500px" disabled/>
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText name="realName" label="姓名" width="500px" disabled/>
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText name="email" label="邮箱" width="500px" required/>
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText name="githubAccount" label="GitHub账号" width="500px" required/>
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText name="clientIp" label="开发机IP" width="500px" required
                             placeholder="在 windows 下执行 ipconfig 查看"/>
            </ProForm.Group>
        </ProForm>
    );
};

export default UserSetting;
