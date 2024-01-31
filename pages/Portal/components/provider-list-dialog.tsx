import React, { useState } from "react";
import ProviderListCard from "@/pages/Portal/components/provider-list-card";
import { Button, Modal } from "antd";

const ProviderListDialog: React.FC<{ productName: string, text: JSX.Element, selectedKey: string }> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return <>
        <div onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>{props.text}</div>
        <Modal
            title={"Provider 列表"}
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            transitionName={''}
            destroyOnClose
            width={'80%'}
            footer={[
                <Button type={'primary'} key="save" onClick={() => setIsModalOpen(false)}>关闭</Button>
            ]}>
            <div style={{ height: '900px' }}>
                <ProviderListCard productName={props.productName} tableHeight={'800px'} hideTitle={true}
                    selectedKey={props.selectedKey} />
            </div>
        </Modal>
    </>
}

export default ProviderListDialog;
