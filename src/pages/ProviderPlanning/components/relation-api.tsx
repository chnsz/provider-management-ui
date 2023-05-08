import ApiListDialog from '@/pages/ProviderPlanning/components/api-list-dialog';
import {getApiDetailList} from '@/services/api/api';
import {bindProviderPlanningApi, unbindProviderPlanningApi,} from '@/services/provider-planning/api';
import {DeleteOutlined} from '@ant-design/icons';
import {Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';

interface DataType {
    key: string;
    productName: string;
    name: string;
    nameEn: string;
    method: string;
    uri: string;
}

type RelationApiProps = {
    planningId: number;
    idList: number[];
    onChange: (data: DataType[]) => any;
};

const RelationApi: React.FC<RelationApiProps> = ({idList, planningId, onChange}) => {
    const [data, setData] = useState<DataType[]>([]);

    const onDelete = (row: DataType) => {
        return () => {
            unbindProviderPlanningApi(planningId, [parseInt(row.key)]).then(() => {
                const arr = data.filter((t) => t.key !== row.key);
                setData(arr);
            });
        };
    };

    const onAdd = (idList: number[], rows: Api.Detail[]) => {
        const exitsData = data.map((t) => t.key);
        const apiIdList = idList.filter((t) => !exitsData.includes(t.toString()));

        bindProviderPlanningApi(planningId, apiIdList).then(() => {
            const arr = [...data];
            rows.forEach((a) => {
                if (apiIdList.indexOf(parseInt(a.id.toString())) === -1) {
                    return;
                }

                arr.push({
                    key: a.id.toString(),
                    productName: a.productName,
                    name: a.apiName,
                    nameEn: a.apiNameEn,
                    method: a.method,
                    uri: a.uri,
                });
            });
            setData(arr);
            onChange(arr);
        });
    };

    useEffect(() => {
        if (idList.length === 0) {
            setData([]);
            onChange([]);
            return;
        }

        getApiDetailList({id: idList}, 1000, 1).then((rsp) => {
            const arr = rsp.items.map((d: Api.Detail) => {
                return {
                    key: '' + d.id,
                    productName: d.productName,
                    name: d.apiName,
                    nameEn: d.apiNameEn,
                    method: d.method,
                    uri: d.uri,
                };
            });
            setData(arr);
            onChange(arr);
        });
    }, [idList]);

    const columns: ColumnsType<DataType> = [
        {
            title: '服务',
            dataIndex: 'productName',
            key: 'productName',
            width: 90,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (v, row) => {
                const title = row.name + '/' + row.nameEn + '（点击跳转 API Explorer）';
                const href = `https://apiexplorer.developer.huaweicloud.com/apiexplorer/doc?product=${row.productName}&api=${row.nameEn}`;
                return (
                    <a title={title} href={href} target={'_blank'} rel="noreferrer">
                        {row.name}/{row.nameEn}
                    </a>
                );
            },
        },
        {
            title: '方法/URI',
            dataIndex: 'method',
            key: 'method',
            width: 120,
            ellipsis: true,
            render: (v, row) => {
                return (
                    <span title={row.method + ' ' + row.uri}>
                        {row.method} {row.uri}
                    </span>
                );
            },
        },
        {
            key: 'action',
            width: 50,
            align: 'center',
            render: (v, row) => (
                <Space size="middle">
                    <a onClick={onDelete(row)}>
                        <DeleteOutlined/>
                    </a>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={data} pagination={false} scroll={{y: 400}}/>
            <div style={{padding: '12px', textAlign: 'center'}}>
                {/*<Button size={'small'} onClick={() => setIsDialogOpen(true)}>+ 新增绑定</Button>*/}
                <ApiListDialog
                    handle={(option: 'ok' | 'cancel', rows: Api.Detail[], idList: number[]) => {
                        if (option === 'ok') {
                            onAdd(idList, rows);
                        }
                    }}
                />
            </div>
        </>
    );
};

export default RelationApi;
