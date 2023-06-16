import type { InputRef } from 'antd';
import { Button, Form, Input, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../api-baseline.less';

const { Option } = Select;

type EntryText = {
    apiID: number | any;
    providerType: string;
    providerName: string;
};

const Entry: React.FC<EntryText> = () => {
    const EditableContext = React.createContext<FormInstance<any> | null>(null);

    interface Item {
        key: string;
        name: string;
        age: string;
        address: string;
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
        id: number;
        fieldName: string;
        fieldIn: string;
        fieldType: string;
        fieldDesc: string;
        useStatus: string;
        operation: string;
    }

    type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: '0',
            id: 1,
            fieldName: 'vpc.cidr',
            fieldIn: 'body',
            fieldType: 'String',
            fieldDesc: '功能说明： 虚拟私有云下可用子网的范围',
            useStatus: '已使用',
            operation: '',
        },
        {
            key: '1',
            id: 2,
            fieldName: 'vpc.name',
            fieldIn: 'body',
            fieldType: 'String',
            fieldDesc: '功能说明： 虚拟私有云名称',
            useStatus: '未使用',
            operation: '',
        },
        {
            key: '2',
            id: 3,
            fieldName: 'vpc.description',
            fieldIn: 'body',
            fieldType: 'String',
            fieldDesc: '功能说明： 虚拟私有云的描述',
            useStatus: '已使用',
            operation: '',
        },
        {
            key: '3',
            id: 4,
            fieldName: 'vpc.enterprise_project_id',
            fieldIn: 'body',
            fieldType: 'String',
            fieldDesc: '功能说明： 企业项目ID。创建私虚拟私有云时，给虚拟私有云绑定企业项目ID',
            useStatus: '已使用',
            operation: '',
        },
        {
            key: '4',
            id: 5,
            fieldName: 'vpc.tags',
            fieldIn: 'body',
            fieldType: 'Array',
            fieldDesc: '功能说明： 虚拟私有云资源标签。创建虚拟私有云时，给虚拟私有云添加资源标签',
            useStatus: '未使用',
            operation: '',
        },
    ]);

    const [count, setCount] = useState(2);

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '序号',
            dataIndex: 'id',
        },
        {
            title: '参数名称',
            dataIndex: 'fieldName',
            width: '30%',
        },
        {
            title: '参数位置',
            dataIndex: 'fieldIn',
        },
        {
            title: '参数类型',
            dataIndex: 'fieldType',
            render: () => (
                <Form.Item
                    style={{ margin: 0 }}
                    name="fieldType"
                    rules={[{ required: true, message: '请选择参数类型' }]}
                >
                    <Select>
                        <Option value="String">String</Option>
                        <Option value="Boolean">Boolean</Option>
                        <Option value="Number">Number</Option>
                        <Option value="Integer">Integer</Option>
                        <Option value="Array">Array</Option>
                        <Option value="Map">Map</Option>
                        <Option value="Object">Object</Option>
                    </Select>
                </Form.Item>
            ),
        },
        {
            title: '描述',
            dataIndex: 'fieldDesc',
        },
        {
            title: '状态',
            dataIndex: 'useStatus',
            align: 'center',
        },
        {
            title: '手工录入',
            dataIndex: 'useStatus',
            align: 'center',
        },
        {
            title: 'schema 名称',
            dataIndex: 'schemaName',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: () => {
                return (
                    <div>
                        <Button type="primary" size={'small'}>
                            未使用
                        </Button>
                        &ensp;&ensp;
                        <Button type="primary" size={'small'}>
                            已使用
                        </Button>
                    </div>
                );
            },
        },
    ];

    const handleAdd = () => {
        const newData: DataType = {
            key: count,
            id: count + 1,
            fieldName: '',
            fieldIn: '',
            fieldType: '',
            fieldDesc: '',
            useStatus: '',
            operation: '',
        };
        setCount(count + 1);
        setDataSource([...dataSource, newData]);
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

    const Supplement = () => {
        return (
            <div className={'supplement'}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>
                    手动补录:
                </div>
                <Form className={'supplement-text'}>
                    <Form.Item label="参数名称">
                        <Input className={'supplement-box'} placeholder="请输入" />
                    </Form.Item>
                </Form>
                <Form className={'supplement-text'}>
                    <Form.Item label="参数位置">
                        <Select className={'supplement-box'} placeholder="请选择" allowClear>
                            <Option>body</Option>
                            <Option>query</Option>
                            <Option>path</Option>
                            <Option>header</Option>
                        </Select>
                    </Form.Item>
                </Form>
                <Form className={'supplement-text'}>
                    <Form.Item label="参数类型">
                        <Select className={'supplement-box'} placeholder="请选择" allowClear>
                            <Option>String</Option>
                            <Option>Boolean</Option>
                            <Option>Number</Option>
                            <Option>Integer</Option>
                            <Option>Array</Option>
                            <Option>Map</Option>
                            <Option>Object</Option>
                        </Select>
                    </Form.Item>
                </Form>
                <Button className={'supplement-text'} type="primary" onClick={handleAdd}>
                    新增
                </Button>
            </div>
        );
    };

    return (
        <div style={{ background: '#ffffff' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>查询结果</div>
            <div className={'api-baseline-card title'}>
                <div className={'title'}>入参列表:</div>
                <Table
                    className={'baseline-list'}
                    size={'middle'}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns as ColumnTypes}
                    pagination={false}
                />
                {Supplement()}
            </div>
        </div>
    );
};
export default Entry;
