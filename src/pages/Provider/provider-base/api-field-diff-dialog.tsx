import React from "react";
import {ColumnsType} from "antd/es/table/interface";
import Provider from "@/pages/Provider";
import {Table} from "antd";
import './api-field-diff-dialog.less'
import TextArea from "antd/es/input/TextArea";

const ApiFieldDiffDialog: React.FC<{ providerBase: Provider.ProviderBase }> = ({providerBase}) => {
    const data: Provider.ApiFieldChange[] = []
    if (!providerBase.changeEvent) {
        return <></>;
    }
    data.push(providerBase.changeEvent);

    const columns: ColumnsType<Provider.ApiFieldChange> = [
        {
            title: '',
            dataIndex: 'serialNo',
            align: 'center',
            width: 80,
            render: (v, row) => row.fieldName ? 'API 字段' : '',
        },
        {
            title: <>字段位置</>,
            dataIndex: 'fieldIn',
            width: 120,
            align: 'center',
        },
        {
            title: <>字段名称</>,
            dataIndex: 'fieldName',
            width: '15%',
            ellipsis: true,
        },
        {
            title: <>字段类型</>,
            dataIndex: 'fieldType',
            width: 150,
            align: 'center',
        },
        {
            title: <>字段描述</>,
            dataIndex: 'fieldDesc',
            render: (v: any) => {
                return <TextArea defaultValue={v} autoSize bordered={false}/>
            },
        },
        {
            title: <>Schema 名称</>,
            width: 200,
            dataIndex: 'schemaName',
        },
        {
            title: <>备注</>,
            width: 200,
            dataIndex: 'remark',
            render: (v, row) => {
                let text = '';
                switch (row.changeEvent) {
                    case 'Deprecated':
                        text = '字段已废弃'
                        break;
                    case 'DescChange':
                        text = '描述变更'
                        break;
                    case 'TypeChange':
                        text = '类型述变更'
                        break;
                    case 'TypeAndDescChange':
                        text = '类型和描述变更'
                        break;
                }
                return <span style={{color: '#ff4d4f'}}>{text}</span>
            }
        },
        {
            title: '',
            width: 170,
            align: 'center',
            dataIndex: 'remark',
        },
    ];

    return <>
        <Table
            className={'diff-view'}
            columns={columns}
            dataSource={data}
            size={'small'}
            showHeader={false}
            pagination={false}
            rowKey={r => r.paramType + '_' + r.fieldName + '_' + r.fieldIn + '_' + r.id}
        />
    </>
}

export default ApiFieldDiffDialog;
