import {ProDescriptions} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import {Button, Input, message, Space} from "antd";
import {modifyApiChangeStatus} from "@/services/api/api";
import AddFeaturePlanningDialog from "@/pages/ProviderPlanning/components/creation-dialog/add-feature-planning-dialog";
import {openApiExplorer} from "@/pages/Portal";

const ApiChangeView: React.FC<{
    id: number;
    productClass: string;
    serviceName: string;
    apiGroup: string;
    apiName: string;
    uri: string;
    content: string;
    apiNameEn: string;
    affectStatus?: string;
    providers?: string;
    remark?: string;
}> = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [remark, setRemark] = useState<string>(props.remark || '');
    const [affectStatus, setAffectStatus] = useState<string>(props.affectStatus || '');

    const content = (props.content || '')
        .replace('normal;font-size: 16px;', 'normal;font-size: 14px;')
        .replace('<div class="content">', '<div class="diff-content">');

    let providers = JSON.parse(props.providers || "[]");

    const onChangeStatus = (status: string, remark: string | undefined) => {
        modifyApiChangeStatus(props.id, status, remark || '').then(() => {
            setAffectStatus('closed');
            messageApi.info('保存成功');
        })
    }

    const onChangeRemark = () => {
        modifyApiChangeStatus(props.id, props.affectStatus || '', remark).then(() => {
            messageApi.info('保存成功');
        })
    }

    useEffect(() => {
        setRemark(props.remark || '');
        setAffectStatus(props.affectStatus || '');
    }, [props.remark, props.affectStatus])

    return (
        <>
            <ProDescriptions column={16} title="API 变更详情">
                <ProDescriptions.Item span={2} label="分类" valueType="text">
                    {props.productClass}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={2} label="服务" valueType="text">
                    {props.serviceName}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={2} label="API 分组" valueType="text">
                    {props.apiGroup}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={5} label="API 名称" valueType="text">
                    {props.apiName} / {props.apiNameEn}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={5} label="在线调试" valueType="text">
                    {openApiExplorer(props.serviceName, props.apiNameEn, props.uri)}
                </ProDescriptions.Item>

                <ProDescriptions.Item span={6} label="Provider" valueType="text">
                    {(providers || []).join(', ')}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={2} label="状态" valueType="text">
                    <Space>
                        {affectStatus}
                        <Button size={'small'} type={'primary'}
                                onClick={() => onChangeStatus('closed', props.remark)}>
                            直接关闭
                        </Button>
                    </Space>
                </ProDescriptions.Item>
                <ProDescriptions.Item span={6} label="备注" valueType="text">
                    <Space.Compact style={{width: '100%'}} size={'small'}>
                        <Input value={remark} size={'small'} onChange={(input) => setRemark(input.target.value)}/>
                        <Button type="primary" onClick={onChangeRemark} size={'small'}>提交</Button>
                    </Space.Compact>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <AddFeaturePlanningDialog productName={props.serviceName || ''}
                                              onClosed={() => {
                                              }}/>
                </ProDescriptions.Item>
            </ProDescriptions>
            <div style={{height: 'calc(100% - 100px)'}}>
                <Scrollbars>
                    <div dangerouslySetInnerHTML={{__html: content}}/>
                </Scrollbars>
            </div>
            {contextHolder}
        </>
    );
};

export default ApiChangeView;
