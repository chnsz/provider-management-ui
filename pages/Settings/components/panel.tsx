import type {InputRef} from 'antd';
import {Breadcrumb, Button, Form, Input, Popconfirm, Table} from 'antd';
import type {FormInstance} from 'antd/es/form';
import React, {useContext, useEffect, useRef, useState} from 'react';
import '../settings.less';
import CustomBreadcrumb from "@/components/Breadcrumb";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface DataType {
    key: React.Key;
    projectId: number;
    columnId: number;
    defaultColor: string;
    label: string;
    founderId: number;
    endpoint: string;
    defaultLane: string;
}

const EditableRow: React.FC = (props) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof DataType;
    record: DataType;
    handleSave: (record: DataType) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                       title,
                                                       editable,
                                                       children,
                                                       dataIndex,
                                                       record,
                                                       handleSave,
                                                       ...restProps
                                                   }) => {
    const [editing, setEditing] = useState<boolean>(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({[dataIndex]: record[dataIndex]});
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.error('Save failed:', errInfo);
        }
    };

    let childNode;

    if (editable) {
        if (editing) {
            childNode = (
                <Form.Item
                    style={{margin: 0}}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
                </Form.Item>
            );
        } else {
            childNode = (
                <div
                    className="editable-cell-value-wrap"
                    style={{paddingRight: 24}}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
    } else {
        childNode = children;
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const Panel: React.FC = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: '0',
            projectId: 4,
            columnId: 18,
            defaultColor: 'green',
            label: 'PMS.ABC ',
            founderId: 13,
            endpoint: 'http://pms-test.huaweicloud.plus',
            defaultLane: '',
        },
        {
            key: '1',
            projectId: 4,
            columnId: 18,
            defaultColor: 'green',
            label: 'PMS.ABC ',
            founderId: 13,
            endpoint: 'http://pms-test.huaweicloud.plus',
            defaultLane: '',
        },
    ]);

    const [count, setCount] = useState<number>(2);

    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const getDelete = (_: any, record: { key?: React.Key }) =>
        dataSource.length >= 1 ? (
            <Popconfirm
                title="Sure to delete?"
                onConfirm={() => record.key && handleDelete(record.key)}
            >
                <a>删除</a>
            </Popconfirm>
        ) : null;

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '项目ID',
            dataIndex: 'projectId',
            editable: true,
        },
        {
            title: '栏目ID',
            dataIndex: 'columnId',
            editable: true,
        },
        {
            title: '默认颜色',
            dataIndex: 'defaultColor',
            editable: true,
        },
        {
            title: '标签',
            dataIndex: 'Label',
            editable: true,
        },
        {
            title: '创建人ID',
            dataIndex: 'founderId',
            editable: true,
        },
        {
            title: 'Endpoint',
            dataIndex: 'Endpoint',
        },
        {
            title: '默认泳道',
            dataIndex: 'defaultLane',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: getDelete,
        },
    ];

    const handleAdd = () => {
        const newData: DataType = {
            key: count,
            projectId: 4,
            columnId: 18,
            defaultColor: 'green',
            label: 'PMS.ABC ',
            founderId: 13,
            endpoint: 'http://pms-test.huaweicloud.plus',
            defaultLane: '',
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row: DataType) => {
        const newData = dataSource.map((t) => {
            if (t.key === row.key) {
                return row;
            }
            return t;
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <>
            <div>
                <CustomBreadcrumb
                    items={[
                        {
                            title: '首页',
                        },
                        {
                            title: <a href="">看板配置</a>,
                        },
                    ]}
                />
            </div>
            <div className={'serve-card'}>
                <h1>看板配置</h1>
                <Button
                    className={'serve-button'}
                    size={'small'}
                    onClick={handleAdd}
                    type="primary"
                    style={{marginBottom: 16}}
                >
                    添加
                </Button>
                <Table
                    pagination={false}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns as ColumnTypes}
                />
            </div>
        </>
    );
};

export default Panel;
