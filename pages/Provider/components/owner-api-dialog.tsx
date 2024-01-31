import React, {useState} from 'react';
import {Button, Modal} from "antd";
import ApiDialogList from "@/pages/Portal/components/api-dialog-list";
import {getCloudName} from "@/global";

const OwnerApiDialog: React.FC<{
    content: any,
    cloudName: string,
    owner?: string,
    onClosed?: () => any,
}> = ({content, owner, cloudName, onClosed}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const closeModel = () => {
        if (onClosed) {
            onClosed()
        }
        setIsModalOpen(false);
    };

    let title = 'API 列表';
    if (owner) {
        title = 'API 列表【' + owner + '】';
    }
    if (cloudName) {
        title += `【${getCloudName(cloudName)}】`
    }

    return (
        <>
            <div style={{cursor: 'pointer'}} onClick={showModal}>{content}</div>
            <Modal title={title}
                   transitionName={''}
                   destroyOnClose
                   open={isModalOpen}
                   onOk={closeModel}
                   onCancel={closeModel}
                   width={'85%'}
                   footer={[
                       <Button key="close" type="primary" onClick={closeModel}>关闭</Button>
                   ]}>
                <ApiDialogList owner={owner} cloudName={cloudName}/>
            </Modal>
        </>
    );
};

export default OwnerApiDialog;
