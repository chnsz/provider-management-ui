import { Collapse, Space, Table } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import '../api-config.less';
import { ApiDetail } from './api-config';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMoveImmutable } from "@ant-design/pro-components";
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import AddFunDialog from '../components/add-fun-dialog';

const { Panel } = Collapse;

export type funData = {
    funTitle: string,
    funType: string,
    funName: string,
    index?: number;
    funCode?: string;
};

export type allFunData = {
    id: string,
    contextValue: funData[]
};

const FunArrange: React.FC<{
    setData: (data: allFunData[]) => any,
    handleFunOrchData: (data: funData[]) => any,
    apiData: ApiDetail[],
    allFunDataPar: allFunData[],
    funcOrchData: funData[]
}> = ({
    setData, handleFunOrchData, apiData, funcOrchData, allFunDataPar
}) => {
        let [activeKey, setActiveKey] = useState<number[]>([]);
        let [allContext, setAllContext] = useState<allFunData[]>([]);
        allContext = allFunDataPar;
        const tableRef = useRef<HTMLDivElement>(null);
        let newApiData: ApiDetail[] = [];
        const filterData = apiData.filter(item => item.schemaType);
        if (filterData.length > 0) {
            activeKey = [filterData[0].id];
        }

        newApiData = filterData;
        useEffect(() => {
            handleContext();
        }, [apiData]);

        const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
        const valueMap = {
            callApi: 'Call API',
            fun: '自定义函数',
            code: '代码块'
        };

        const columns = [
            {
                title: 'Sort',
                dataIndex: 'sort',
                width: 30,
                align: 'left',
                className: 'drag-visible',
                render: () => <DragHandle />,
            },
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
                    switch (record.funType) {
                        case 'callApi':
                            return <Space size="middle"><a style={{ color: '#adb0b8' }}>移除</a></Space>
                    }
                    return <Space size="middle">
                        <a onClick={onDelete(record)}>移除</a>
                    </Space>
                },
            }
        ];

        const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
            <tr {...props} />
        ));
        const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
            <tbody {...props} />
        ));

        const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
            const tableId = tableRef?.current?.childNodes[0]?.childNodes[0]?.childNodes[0].id;
            if (oldIndex !== newIndex) {
                const newAllContext = allContext.map(context => {
                    if (context.id === tableId) {
                        return {
                            id: context.id,
                            contextValue: arrayMoveImmutable(context.contextValue.slice(), oldIndex, newIndex).filter(
                                (el: funData) => !!el,
                            )
                        }
                    }

                    return context;
                });

                setAllContext(newAllContext);
                setData(newAllContext);
            }
        };

        const DraggableContainer = (props: SortableContainerProps) => (
            <SortableBody
                useDragHandle
                disableAutoscroll
                helperClass="row-dragging"
                onSortEnd={onSortEnd}
                {...props}
            />
        );

        const DraggableBodyRow: React.FC<any> = ({ className, style, id, ...restProps }) => {
            const dataSource = allContext.find(item => item.id === restProps.children[0]?.props?.record?.funTitle)?.contextValue || [];
            const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
            return <SortableItem index={index} {...restProps} />;
        };

        const onDelete = (record: funData) => {
            return () => {
                const funTitle = record.funTitle;
                const newAllContext = allContext.map(context => {
                    if (context.id === funTitle) {
                        context.contextValue = context.contextValue.filter(item =>
                            item.funName !== record.funName || item.funType !== record.funType
                        );
                    }

                    return context;
                });
                newAllContext.forEach(item => {
                    item.contextValue.forEach((context, index) => {
                        context.index = index;
                    })
                });
                setAllContext(newAllContext);
                setData(newAllContext);
            };
        };

        const onAdd = (contextId: string, rows: funData) => {
            const newAllContext = allContext.map(context => {
                if (context.id === contextId) {
                    const processRows = rows;
                    let contextValue: funData[] = [];
                    if (Array.isArray(processRows)) {
                        contextValue = [...context.contextValue, ...processRows];
                    } else {
                        contextValue = [...context.contextValue, processRows];
                        funcOrchData.push(processRows);
                        handleFunOrchData([...funcOrchData]);
                    }

                    return {
                        id: context.id,
                        contextValue: contextValue
                    }
                }

                return context;
            });

            for (let i = 0; i < newAllContext.length; i++) {
                if (newAllContext[i].id === contextId) {
                    const contextValue = JSON.parse(JSON.stringify(newAllContext[i].contextValue))
                    for (let j = 0; j < contextValue.length; j++) {
                        contextValue[j].funTitle = contextId;
                        contextValue[j].index = j;
                    }
                    newAllContext[i].contextValue = contextValue;
                    break;
                }
            }

            setAllContext(newAllContext);
            setData(newAllContext);
        };

        const handleContext = () => {
            const createData: any = [];
            const readData: any = [];
            const updateData: any = [];
            const deleteData: any = [];

            allContext.forEach(item => {
                item.contextValue.forEach((i, index) => {
                    if (i.funType === 'callApi') {
                        const result = newApiData.some(api => api.apiNameEn === i.funName);
                        if (!result) {
                            item.contextValue.splice(index, 1);
                        }
                    }
                })
            });

            let createContext = allContext.find(item => item.id === 'createContext')?.contextValue || [];
            createContext = createContext.map(({ funType, funName, funTitle, funCode }) => ({ funType, funName, funTitle, funCode }));

            let readContext = allContext.find(item => item.id === 'readContext')?.contextValue || [];
            readContext = readContext.map(({ funType, funName, funTitle, funCode }) => ({ funType, funName, funTitle, funCode }));

            let updateContext = allContext.find(item => item.id === 'updateContext')?.contextValue || [];
            updateContext = updateContext.map(({ funType, funName, funTitle, funCode }) => ({ funType, funName, funTitle, funCode }));

            let deleteContext = allContext.find(item => item.id === 'deleteContext')?.contextValue || [];
            deleteContext = deleteContext.map(({ funType, funName, funTitle, funCode }) => ({ funType, funName, funTitle, funCode }));

            newApiData.forEach(item => {
                const funItem = {
                    funType: 'callApi',
                    funName: item.apiNameEn,
                    funTitle: handleFunTitle(item.schemaType)
                };
                if (item.schemaType === 'argument') {
                    if (!(createContext.some(v => JSON.stringify(v) === JSON.stringify(funItem)))) {
                        createData.push(funItem);
                    }
                }

                if (item.schemaType === 'attribute') {
                    if (!(readContext.some(v => JSON.stringify(v) === JSON.stringify(funItem)))) {
                        readData.push(funItem);
                    }
                }

                if (item.schemaType === 'update') {
                    if (!(updateContext.some(v => JSON.stringify(v) === JSON.stringify(funItem)))) {
                        updateData.push(funItem);
                    }
                }

                if (item.schemaType === 'delete') {
                    if (!(deleteContext.some(v => JSON.stringify(v) === JSON.stringify(funItem)))) {
                        deleteData.push(funItem);
                    }
                }
            });
            if (createData.length) {
                readContext = readContext.filter(i => !createData.some(j => j.funType === i.funType && j.funName === i.funName));
                updateContext = updateContext.filter(i => !createData.some(j => j.funType === i.funType && j.funName === i.funName));
                deleteContext = deleteContext.filter(i => !createData.some(j => j.funType === i.funType && j.funName === i.funName));
            }

            if (readData.length) {
                createContext = createContext.filter(i => !readData.some(j => j.funType === i.funType && j.funName === i.funName));
                updateContext = updateContext.filter(i => !readData.some(j => j.funType === i.funType && j.funName === i.funName));
                deleteContext = deleteContext.filter(i => !readData.some(j => j.funType === i.funType && j.funName === i.funName));
            }

            if (updateData.length) {
                createContext = createContext.filter(i => !updateData.some(j => j.funType === i.funType && j.funName === i.funName));
                readContext = readContext.filter(i => !updateData.some(j => j.funType === i.funType && j.funName === i.funName));
                deleteContext = deleteContext.filter(i => !updateData.some(j => j.funType === i.funType && j.funName === i.funName));
            }

            if (deleteData.length) {
                createContext = createContext.filter(i => !deleteData.some(j => j.funType === i.funType && j.funName === i.funName));
                readContext = readContext.filter(i => !deleteData.some(j => j.funType === i.funType && j.funName === i.funName));
                updateContext = updateContext.filter(i => !deleteData.some(j => j.funType === i.funType && j.funName === i.funName));
            }


            const res: allFunData[] = [
                {
                    id: 'createContext',
                    contextValue: [...createData, ...createContext]
                },
                {
                    id: 'readContext',
                    contextValue: [...readData, ...readContext]
                },
                {
                    id: 'updateContext',
                    contextValue: [...updateData, ...updateContext]
                },
                {
                    id: 'deleteContext',
                    contextValue: [...deleteData, ...deleteContext]
                }
            ];
            res.forEach(item => {
                item.contextValue.forEach((context, index) => {
                    context.index = index;
                })
            });

            setAllContext([...res]);
            setData([...res]);
        }

        const handleFunTitle = (schemaType: string) => {
            switch (schemaType) {
                case 'argument':
                    return 'createContext';
                case 'attribute':
                    return 'readContext';
                case 'update':
                    return 'updateContext';
                case 'delete':
                    return 'deleteContext';
            }
            return ''
        }

        const isTable = false;
        const isEdit = false;


        return <>
            {
                newApiData.length > 0 ?
                    <Collapse defaultActiveKey={['1']}>
                        {
                            allContext.map((context, index) => {
                                return <Panel header={context.id} key={index + 1}>
                                    <div className={'choose-box'}>
                                        <Space size={15}>
                                            <AddFunDialog
                                                handle={(option: 'ok' | 'cancel', rows: funData) => {
                                                    if (option === 'ok') {
                                                        onAdd(context.id, rows);
                                                    }
                                                }}
                                                isEdit={isEdit}
                                                isTable={isTable}
                                                funcOrchData={funcOrchData}>
                                            </AddFunDialog>
                                        </Space>
                                    </div>
                                    <Table
                                        style={{ marginTop: '20px' }}
                                        id={context.id}
                                        ref={tableRef}
                                        columns={columns}
                                        dataSource={context.contextValue}
                                        size={'small'}
                                        pagination={false}
                                        // rowKey={r => r.funName + '_' + r.funType}
                                        rowKey="index"
                                        components={{
                                            body: {
                                                wrapper: DraggableContainer,
                                                row: DraggableBodyRow,
                                            },
                                        }}
                                    />
                                </Panel>

                            })
                        }
                    </Collapse> :
                    <div className={'no-data'}>暂无编排函数</div>
            }

        </>;
    }

export default FunArrange;
