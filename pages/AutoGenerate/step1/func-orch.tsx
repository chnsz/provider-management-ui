import React, { useState } from 'react';
import { Space, Table } from "antd";
import { funData } from "./fun-arrange";
import AddFunDialog from '../components/add-fun-dialog';
import { valueMap } from '@/services/auto-generate/constants';

const FuncOrch: React.FC<{ setData: (data: funData[]) => any, funcOrchDataPar: funData[] }> = ({ setData, funcOrchDataPar }) => {
    let [funcOrchData, setFuncOrchData] = useState<funData[]>([]);
    funcOrchData = funcOrchDataPar;
    const isTable = true;
    const columns = [
        {
            title: '类型',
            dataIndex: 'funType',
            align: 'left',
            width: 150,
            render: (text: string) => {
                return valueMap[text];
            }
        },
        {
            title: '名称',
            dataIndex: 'funName',
            align: 'left',
        },
        {
            title: '操作',
            key: 'action',
            align: 'left',
            with: 150,
            render: (_, record: funData) => {
                const isEdit = true;
                return <Space size="middle">
                    <span>
                        <AddFunDialog
                            handle={(option: 'ok' | 'cancel', rows: funData) => {
                                if (option === 'ok') {
                                    onEdit(record, rows);
                                }
                            }}
                            isEdit={isEdit}
                            isTable={isTable}
                            backData={{ ...record }}>
                        </AddFunDialog>
                    </span>
                    <a onClick={onDelete(record)}>移除</a>
                </Space>
            },
        }
    ];

    const onDelete = (record: funData) => {
        return () => {
            const newOrchData = funcOrchData.filter(item =>
                item.funName !== record.funName || item.funType !== record.funType
            );
            setFuncOrchData(newOrchData);
            setData(newOrchData);

        };
    };

    const onAdd = (contextId: string, rows: funData) => {
        const newOrchData = [];

        newOrchData.push(rows);
        setFuncOrchData([...funcOrchData, ...newOrchData]);
        setData([...funcOrchData, ...newOrchData]);
    };

    const onEdit = (record: funData, rows: funData) => {
        const index = funcOrchData.findIndex(item => item.funName === record.funName && item.funType === record.funType && item.funCode === record.funCode);
        if (index !== -1) {
            funcOrchData.splice(index, 1, rows);
        }
        setFuncOrchData([...funcOrchData]);
        setData([...funcOrchData])
    };

    const isEdit = false;

    return <>
        <div className={'choose-box'}>
            <Space size={15}>
                <AddFunDialog
                    handle={(option: 'ok' | 'cancel', rows: funData) => {
                        if (option === 'ok') {
                            rows.funName = "";
                            onAdd('', rows);
                        }
                    }}
                    isEdit={isEdit}
                    isTable={isTable}>
                </AddFunDialog>
            </Space>
        </div>
        <Table
            style={{ marginTop: '20px' }}
            columns={columns}
            dataSource={funcOrchData}
            size={'small'}
            pagination={false}
            rowKey={r => r.funName + '_' + r.funType}
        />
    </>
}

export default FuncOrch;
