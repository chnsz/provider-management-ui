import type { InputRef } from 'antd';
import { Breadcrumb, Form, Input, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../settings.less';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface DataType {
    key: React.Key;
    productGroup: string;
    productName: string;
    name: string;
    grading: string;
    api: number;
    user: string;
    state: string;
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
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.error('Save failed:', errInfo);
        }
    };

    let childNode;

    if (editable) {
        if (editing) {
            childNode = (
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
            );
        } else {
            childNode = (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
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

const ServiceConfig: React.FC = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: '0',
            productGroup: '计算产品部',
            productName: 'ECS',
            name: '弹性云服务器',
            grading: '核心服务',
            api: 100,
            user: '时长阔',
            state: '活动',
        },
        {
            key: '1',
            productGroup: '计算产品部',
            productName: 'ECS',
            name: '弹性云服务器',
            grading: '核心服务',
            api: 100,
            user: '时长阔',
            state: '活动',
        },
    ]);

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '产品部',
            dataIndex: 'productGroup',
            width: '30%',
        },
        {
            title: '服务简称',
            dataIndex: 'productName',
        },
        {
            title: '服务名称',
            dataIndex: 'name',
        },
        {
            title: '服务分级',
            dataIndex: 'grading',
            editable: true,
        },
        {
            title: 'API数量',
            dataIndex: 'api',
        },
        {
            title: '田主',
            dataIndex: 'user',
            editable: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            editable: true,
        },
    ];

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
        <div>
            <div>
                <Breadcrumb
                    style={{ marginTop: '20px' }}
                    items={[
                        {
                            title: '首页',
                        },
                        {
                            title: <a href="">服务配置</a>,
                        },
                    ]}
                />
            </div>
            <div className={'serve-card'}>
                <h1>服务列表</h1>
                <Table
                    pagination={false}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns as ColumnTypes}
                />
            </div>
        </div>
    );
};

export default ServiceConfig;
