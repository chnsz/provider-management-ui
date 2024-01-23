import { Col, Form, Input, Row, Space, Table } from 'antd';
import React, { useState } from 'react';
import CodeEditor from "@/components/CodeEditor";
import AddExampleDialog from '../components/add-example-dialog';

const { TextArea } = Input;

export type exampleDate = {
    title: string;
    script: string;
};

const Doc: React.FC<{ setData: (data: any) => any, docDataPar: any }> = ({ setData, docDataPar }) => {

    const [category, setCategory] = useState<string>(docDataPar?.category || '');
    const [overview, setOverview] = useState<string>(docDataPar?.overview || '');
    const [imports, setImports] = useState<string>(docDataPar?.imports || '');
    const [exampleDate, setExampleData] = useState<exampleDate[]>(docDataPar?.exampleDate || []);

    const columns = [
        {
            title: 'title',
            dataIndex: 'title',
            align: 'left',
            width: 200,
        },
        {
            title: 'script',
            dataIndex: 'script',
            align: 'left',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            with: 90,
            render: (_, record: exampleDate) => {
                const isEdit = true;
                return <Space size="middle" style={{width: '90px', alignItems: 'center'}}>
                    <span>
                        <AddExampleDialog
                            handle={(option: 'ok' | 'cancel', row: exampleDate) => {
                                if (option === 'ok') {
                                    onEdit(record, row);
                                }
                            }}
                            isEdit={isEdit}
                            backData={{ ...record }}>
                        </AddExampleDialog>
                    </span>
                    <a onClick={onDelete(record)}>移除</a>
                </Space>
            },
        }
    ];

    const onAdd = (row: exampleDate) => {
        const data = [];
        data.push(row);
        setExampleData([...exampleDate, ...data]);
        setData({
            category,
            overview,
            imports,
            exampleDate: [...exampleDate, ...data]
        })
    }

    const onDelete = (record: exampleDate) => {
        return () => {
            const newData = exampleDate.filter(item =>
                item.title !== record.title
            );
            setExampleData(newData);
            setData({
                category,
                overview,
                imports,
                exampleDate: [...newData]
            })
        };

    }

    const onEdit = (record: exampleDate, row: exampleDate) => {
        const index = exampleDate.findIndex(item => item.title === record.title && item.script === record.script);
        if (index !== -1) {
            exampleDate.splice(index, 1, row);
        }
        setExampleData([...exampleDate]);
        setData({
            category,
            overview,
            imports,
            exampleDate: [...exampleDate]
        })
    }

    return <>
        <Space direction={"vertical"} size={20} style={{ width: '100%' }}>
            <Row>
                <Col flex="100%">
                    <div className={'portal-card'}>
                        <div className={'header'}>文档描述</div>
                        <div className={'container'}>
                            <Form
                                name="basic"
                                labelCol={{flex: '110px'}}
                                labelAlign="left"
                                wrapperCol={{span: 20}}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Category"
                                    name="category"
                                    initialValue={category}
                                    rules={[{required: true, message: '请输入category'}]}
                                >
                                    <Input placeholder='请输入category' value={category} onChange={e => {
                                        setCategory(e.target.value);
                                        setData({
                                            category: e.target.value,
                                            overview,
                                            imports,
                                            exampleDate
                                        })
                                    }
                                    }/>
                                </Form.Item>

                                <Form.Item
                                    label="Overview"
                                    name="overview"
                                    initialValue={overview}
                                    rules={[{required: true, message: '请输入overview'}]}
                                >
                                    <TextArea rows={3} value={overview} onChange={e => {
                                        setOverview(e.target.value);
                                        setData({
                                            category,
                                            overview: e.target.value,
                                            imports,
                                            exampleDate
                                        })
                                    }} placeholder='请输入overview'/>
                                </Form.Item>

                                <div>
                                    <div><span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>Example:</div>
                                    <div style={{paddingLeft: '110px'}}>
                                        <AddExampleDialog
                                            handle={(option: 'ok' | 'cancel', row: exampleDate) => {
                                                if (option === 'ok') {
                                                    onAdd(row);
                                                }
                                            }}
                                        >
                                        </AddExampleDialog>
                                        <Table
                                            style={{marginTop: '20px'}}
                                            columns={columns}
                                            dataSource={exampleDate}
                                            size={'small'}
                                            pagination={false}
                                            rowKey={(r: exampleDate) => r.title + '_' + r.script}
                                        />
                                    </div>

                                </div>

                                <Form.Item
                                    label="Imports"
                                    name="imports"
                                >
                                    <div style={{height: '30vh', marginTop: '25px'}}>
                                        <CodeEditor language={'go'} height={'30vh'} value={imports} onChange={e => {
                                            setImports(e);
                                            setData({
                                                category,
                                                overview,
                                                imports: e,
                                                exampleDate
                                            })
                                        }}/>
                                    </div>
                                </Form.Item>

                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Space>
    </>
}

export default Doc;
