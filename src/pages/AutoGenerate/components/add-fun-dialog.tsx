import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Tabs, Radio, Table } from 'antd';
import CodeEditor from "@/components/CodeEditor";
import { funData } from '../step1/fun-arrange';

const { TabPane } = Tabs;

type AddFunDialogProp = {
    handle?: (option: 'ok' | 'cancel', rows: {}) => any,
    isEdit?: boolean,
    isTable?: boolean,
    funcOrchData?: funData,
    backData?: funData,
};

const AddFunDialog: React.FC<AddFunDialogProp> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    let [funName, setFunName] = useState<string>();
    let [funType, setFunType] = useState<string>();
    let [funCode, setFunCode] = useState<string>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<funData[]>([]);
    const [defaultActiveKey, setDefaultActiveKey] = useState<string>('tab1');

    useEffect(() => {
        handleDefaultActiveKey();
    }, [props.isTable]);

    const showModal = () => {
        setIsModalOpen(true);
        if (props.backData) {
            setFunName(props.backData.funName);
            setFunType(props.backData.funType);
            setFunCode(props.backData.funCode);
        }
    };

    const handleOk = (option: 'ok' | 'cancel') => {
        return () => {
            setIsModalOpen(false);
            if (props.handle) {
                if (defaultActiveKey === 'tab2') {
                    const rows = { funName, funType, funCode };
                    props.handle(option, rows);
                } else {
                    const rows = selectedRows;
                    props.handle(option, rows);
                }
            }
        };
    };

    const valueMap = {
        callApi: 'Call API',
        fun: '自定义函数',
        code: '代码块'
    };

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
        }
    ];

    const onSelectChange = (newSelectedRowKeys: React.Key[], rows: funData[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(rows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const tabChange = (key: string) => {
        setDefaultActiveKey(key);
    }

    const handleDefaultActiveKey = () => {
        if (props.isTable) {
            setDefaultActiveKey('tab2');
        } else {
            setDefaultActiveKey('tab1');
        }
    }

    return (
        <>
            {
                props.isEdit ?
                    <a onClick={showModal}>编辑</a> :
                    <Button onClick={showModal} size={'small'} type={'primary'}>新增函数</Button>
            }

            <Modal title="新增函数"
                destroyOnClose
                transitionName={''}
                open={isModalOpen}
                onOk={handleOk('ok')}
                onCancel={handleOk('cancel')}
                width={'80%'}>

                <Tabs defaultActiveKey={defaultActiveKey} onChange={tabChange}>
                    {
                        !props.isTable ?
                            <TabPane tab="选择已有" key="tab1">
                                <Table
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={props.funcOrchData}
                                    rowKey={r => r.funName + '_' + r.funType}
                                />
                            </TabPane> :
                            <></>
                    }

                    <TabPane tab="新增自定义" key="tab2">
                        <Form
                            name="basic"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="类型"
                                name="funType"
                                initialValue={funType}
                                rules={[{ required: true, message: '请选择函数类型' }]}>

                                <Radio.Group onChange={(e) => setFunType(e.target.value)} value={funType}>
                                    <Radio value={'fun'}>函数</Radio>
                                    <Radio value={'code'}>代码块</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                label="名称"
                                name="funName"
                                initialValue={funName}
                                rules={[{ required: true, message: '请选择函数类型' }]}
                            >
                                <Input value={funName} maxLength={128} onChange={e => setFunName(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label="代码"
                                name="name"
                                initialValue={funCode}
                                rules={[{ required: true, message: '请输入函数名称' }]}
                            >
                                <div style={{ height: '60vh' }}>
                                    <CodeEditor language={'go'} height={'60vh'} value={funCode} onChange={e => setFunCode(e)} />
                                </div>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Modal>
        </>
    );
};

export default AddFunDialog;
