import React, {useEffect, useState} from 'react';
import {Button, Modal} from 'antd';
import ProductFeature from "@/pages/ProductFeature";

const ManageFeatureDialog: React.FC<{ productName: string, onClosed: () => any }> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        if(props.onClosed){
            props.onClosed();
        }
    };

    return (
        <>
            <Button onClick={showModal} size={'small'}>管理</Button>
            <Modal title="管理特性"
                   transitionName={''}
                   destroyOnClose
                   open={isModalOpen}
                   onCancel={handleCancel}
                   width={1400}
                   footer={[
                       <Button key="close" type="primary" onClick={handleCancel}>关闭</Button>
                   ]}
            >
                <ProductFeature simple productName={props.productName}/>
            </Modal>
        </>
    );
};

export default ManageFeatureDialog;
