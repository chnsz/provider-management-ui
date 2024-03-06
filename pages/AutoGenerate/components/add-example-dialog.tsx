import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal} from 'antd';
import CodeEditor from "@/components/CodeEditor";
import {exampleData} from '../step2/doc';


type AddFunDialogProp = {
    handle?: (option: 'ok' | 'cancel', rows: {}) => any,
    isEdit?: boolean,
    backData?: exampleData,
};

const AddExampleDialog: React.FC<AddFunDialogProp> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState<string>('Example Usage');
    const [script, setScript] = useState<string>();


    const showModal = () => {
        setIsModalOpen(true);
        if (props.backData) {
            setTitle(props.backData.title);
            setScript(props.backData.script);
        }
    };

    const handleOk = (option: 'ok' | 'cancel') => {
        return () => {
            setIsModalOpen(false);
            if (props.handle) {
                const row = {title, script};
                props.handle(option, row);
            }
        };
    };


    return (
        <>
            {
                props.isEdit ?
                    <a onClick={showModal}>编辑</a> :
                    <Button onClick={showModal} size={'small'} type={'primary'}>新增Example</Button>
            }
            <Modal title="新增 / 维护 Example"
                   destroyOnClose
                   transitionName={''}
                   open={isModalOpen}
                   onOk={handleOk('ok')}
                   onCancel={handleOk('cancel')}
                   width={'80%'}>
                <Form
                    name="basic"
                    labelCol={{span: 2}}
                    wrapperCol={{span: 20}}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        initialValue={title}
                        rules={[{required: true, message: '请输入title'}]}>

                        <Input placeholder='请输入title' value={title} onChange={e => setTitle(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="Script"
                        name="script"
                        initialValue={script}
                    >
                        <div style={{height: '40vh'}}>
                            <CodeEditor language={'go'} height={'40vh'} value={script} onChange={e => setScript(e)}/>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddExampleDialog;
