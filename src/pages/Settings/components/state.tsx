import type { InputRef } from 'antd';
import { Breadcrumb, Button, Form, Input, Popconfirm, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../settings.less';

const { Option } = Select;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    panelStatus: string;
    systemStatus: string;
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
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
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
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
    key: React.Key;
    panelStatus: string;
    systemStatus: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const State: React.FC = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: '0',
            panelStatus: '未启动',
            systemStatus: 'new',
        },
        {
            key: '1',
            panelStatus: '未启动',
            systemStatus: 'new',
        },
    ]);

    const [count, setCount] = useState(2);

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
            title: '看板状态',
            dataIndex: 'panelStatus',
            render: () => {
                return (
                    <Form.Item name="gender" rules={[{ required: true }]}>
                        <Select>
                            <Option value="male">完成</Option>
                            <Option value="female">关闭</Option>
                        </Select>
                    </Form.Item>
                );
            },
        },
        {
            title: '系统状态',
            dataIndex: 'systemStatus',
            editable: true,
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
            panelStatus: '未启动',
            systemStatus: 'new',
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
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
                <Breadcrumb
                    style={{ marginTop: '20px' }}
                    items={[
                        {
                            title: '首页',
                        },
                        {
                            title: <a href="">状态映射</a>,
                        },
                    ]}
                />
            </div>
            <div className={'serve-card'}>
                <h1>状态列表</h1>
                <Button
                    className={'serve-button'}
                    size={'small'}
                    onClick={handleAdd}
                    type="primary"
                    style={{ marginBottom: 16 }}
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

export default State;
