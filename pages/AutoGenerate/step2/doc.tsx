import {Col, Form, Input, Row, Space, Table} from 'antd';
import React, {useState} from 'react';
import CodeEditor from "@/components/CodeEditor";
import AddExampleDialog from '../components/add-example-dialog';

const {TextArea} = Input;

export type exampleData = {
    id: number;
    title: string;
    script: string;
};

const Doc: React.FC<{ setData: (data: any) => any, docDataPar: any }> = ({setData, docDataPar}) => {

    const [category, setCategory] = useState<string>(docDataPar?.category);
    const [overview, setOverview] = useState<string>(docDataPar?.overview);
    const [imports, setImports] = useState<string>(docDataPar?.imports);
    const [exampleData, setExampleData] = useState<exampleData[]>(docDataPar?.examples || []);

    const columns = [
        {
            title: 'title',
            dataIndex: 'title',
            align: 'left',
            width: 500,
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
            render: (_, record: exampleData) => {
                const isEdit = true;
                return <Space size="middle" style={{width: '90px', alignItems: 'center'}}>
                    <span>
                        <AddExampleDialog
                            handle={(option: 'ok' | 'cancel', row: exampleData) => {
                                if (option === 'ok') {
                                    if (!row.id) {
                                        row.id = new Date() * 1;
                                    }
                                    onEdit(record, row);
                                }
                            }}
                            isEdit={isEdit}
                            backData={{...record}}>
                        </AddExampleDialog>
                    </span>
                    <a onClick={onDelete(record)}>移除</a>
                </Space>
            },
        }
    ];

    const onAdd = (row: exampleData) => {
        const data = [];
        data.push(row);
        setExampleData([...exampleData, ...data]);
        setData({
            category: category ?? null,
            overview: overview ?? null,
            imports: imports ?? null,
            examples: [...exampleData, ...data]
        })
    }

    const onDelete = (record: exampleData) => {
        return () => {
            const newData = exampleData.filter(item =>
                item.id !== record.id
            );
            setExampleData(newData);
            setData({
                category: category ?? null,
                overview: overview ?? null,
                imports: imports ?? null,
                examples: [...newData]
            })
        };

    }

    const onEdit = (record: exampleData, row: exampleData) => {
        const index = exampleData.findIndex(item => item.title === record.title && item.script === record.script);
        if (index !== -1) {
            exampleData.splice(index, 1, row);
        }
        setExampleData([...exampleData]);
        setData({
            category: category ?? null,
            overview: overview ?? null,
            imports: imports ?? null,
            examples: [...exampleData]
        })
    }

    return <>
        <Space direction={"vertical"} size={20} style={{width: '100%'}}>
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
                                            examples: exampleData,
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
                                            examples: exampleData,
                                        })
                                    }} placeholder='请输入overview'/>
                                </Form.Item>

                                <div>
                                    <div><span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>Example:</div>
                                    <div style={{paddingLeft: '110px'}}>
                                        <AddExampleDialog
                                            handle={(option: 'ok' | 'cancel', row: exampleData) => {
                                                if (option === 'ok') {
                                                    row.id = new Date() * 1;
                                                    onAdd(row);
                                                }
                                            }}
                                        >
                                        </AddExampleDialog>
                                        <Table
                                            style={{marginTop: '20px'}}
                                            columns={columns}
                                            dataSource={exampleData}
                                            size={'small'}
                                            pagination={false}
                                            rowKey={(r: exampleData) => r.title + '_' + r.script}
                                        />
                                    </div>

                                </div>

                                <Form.Item
                                    label="Imports"
                                    name="imports"
                                >
                                    <div style={{height: '30vh', marginTop: '25px'}}>
                                        <CodeEditor language={'markdown'} height={'30vh'} value={imports}
                                                    onChange={e => {
                                                        setImports(e);
                                                        setData({
                                                            category: category ?? null,
                                                            overview: overview ?? null,
                                                            imports: e ?? null,
                                                            examples: exampleData,
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
