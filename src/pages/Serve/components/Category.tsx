import type { InputRef } from 'antd';
import { Breadcrumb, Button, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../serve.less';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    Category: string;
    abbreviation: string;
    operation: string;
}

interface EditableRowProps {
    index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
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
    Category: string;
    abbreviation: string;
    operation: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const Category: React.FC = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: '0',
            Category: 'API Gateway(Shared APIG)',
            abbreviation: 'APIG',
            operation: '',
        },
        {
            key: '1',
            Category: 'API Gateway(Shared APIG)',
            abbreviation: 'APIG',
            operation: '',
        },
    ]);

    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const getDelete = (_: any, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                <a>删除</a>
            </Popconfirm>
        ) : null;

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'Category',
            dataIndex: 'Category',
            editable: true,
        },
        {
            title: '服务简称',
            dataIndex: 'abbreviation',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            // @ts-ignore
            render: getDelete,
        },
    ];

    const handleAdd = () => {
        const newData: DataType = {
            key: count,
            Category: `API Gateway(Shared APIG)`,
            abbreviation: 'APIG',
            operation: ``,
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
                            title: <a href="">Category 与服务关系</a>,
                        },
                    ]}
                />
            </div>
            <div className={'serve-card'}>
                <h1>Category列表</h1>
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
                    // className={'serve-table'}
                    size={'middle'}
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

export default Category;
