import { ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';

const ApiChangeView: React.FC<{
    productClass: string;
    serviceName: string;
    apiGroup: string;
    apiName: string;
    content: string;
    apiNameEn: string;
    affectStatus?: string;
    providers?: string;
    remark?: string;
}> = (props) => {
    const content = (props.content || '')
        .replace('normal;font-size: 16px;', 'normal;font-size: 14px;')
        .replace('<div class="content">', '<div class="diff-content">');

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
                <ProDescriptions.Item span={2} label="API 名称" valueType="text">
                    {props.apiName}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={2} label="状态" valueType="text">
                    {props.affectStatus}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={2} label="Provider" valueType="text">
                    {props.providers}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={4} label="备注" valueType="text">
                    {props.remark}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={16} label="在线调试" valueType="text">
                    <a
                        href={`https://console.huaweicloud.com/apiexplorer/#/openapi/${props.serviceName}/doc?api=${props.apiNameEn}`}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                    >
                        API Explorer
                    </a>
                </ProDescriptions.Item>
            </ProDescriptions>
            <Scrollbars>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </Scrollbars>
        </>
    );
};

export default ApiChangeView;
