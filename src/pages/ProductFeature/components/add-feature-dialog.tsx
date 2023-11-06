import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select} from 'antd';
import type {SelectProps} from "antd/es/select";
import {getProductList} from "@/services/product/api";
import {createProductFeature} from "@/services/product-feature/api";

const AddFeatureDialog: React.FC<{
    productName?: string,
    onSuccess: (data: ProductFeature.ProductFeature) => any
}> = (props) => {
    const [serviceOptions, setServiceOptions] = useState<SelectProps['options']>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productName, setProductName] = useState<string>(props.productName || '');
    const [name, setName] = useState<string>();
    const [actualCoverage, setActualCoverage] = useState<string>('not_covered');

    useEffect(() => {
        getProductList().then((data) => {
            const opts = data.items
                .map((product: Product.Product) => product.productName)
                .sort()
                .map((productName: string) => {
                    return {value: productName, label: productName};
                });
            setServiceOptions(opts);
        });
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        console.log({productName, name, actualCoverage})
        createProductFeature({productName, name, actualCoverage}).then(rsp => {
            setIsModalOpen(false);
            props.onSuccess(rsp);
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button onClick={showModal} size={'small'} type={'primary'}>新增特性</Button>
            <Modal title="新建特性"
                   destroyOnClose
                   transitionName={''}
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{span: 6}}
                    wrapperCol={{span: 16}}
                    initialValues={{remember: true}}
                    autoComplete="off"
                >

                    <Form.Item
                        label="所属服务"
                        name="productName"
                        initialValue={productName}
                        rules={[{required: true, message: '请选择特性所属的服务'}]}
                    >
                        <Select
                            showSearch
                            onChange={(v) => setProductName(v)}
                            options={serviceOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="特性名称"
                        name="name"
                        rules={[{required: true, message: '请输入特性名称'}]}
                    >
                        <Input value={name} maxLength={128} onChange={e => setName(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="覆盖状态"
                        name="actualCoverage"
                        initialValue={actualCoverage}
                        rules={[{required: true, message: '请选择特性覆盖状态'}]}
                    >
                        <Select
                            onChange={(v) => setActualCoverage(v)}
                            options={[
                                {value: 'covered', label: '已覆盖'},
                                {value: 'partially_covered', label: '部分覆盖'},
                                {value: 'not_covered', label: '未覆盖'},
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddFeatureDialog;
