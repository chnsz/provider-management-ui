import React, {useEffect, useState} from "react";
import {Button, Modal} from "antd";
import ProviderPlanningDetail from "@/pages/ProviderPlanning/components/provider-planning-detail";

const PlanningViewDialog: React.FC<{
    planning: ProviderPlanning.ProviderPlanning,
    onClosed?: () => any
}> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        if (props.onClosed) {
            props.onClosed();
        }
    };

    const onDetailChange = (detail: ProviderPlanning.ProviderPlanning) => {
        console.log('detail', detail);
    }

    return (
        <>
            <Button onClick={showModal} size={'small'} type={'link'}>编辑</Button>
            <Modal title="编辑规划"
                   transitionName={''}
                   destroyOnClose
                   open={isModalOpen}
                   onCancel={handleCancel}
                   width={1400}
                   footer={[
                       <Button key="close" type="primary" onClick={handleCancel}>关闭</Button>
                   ]}
            >
                <ProviderPlanningDetail
                    providerPlanning={props.planning}
                    onChange={onDetailChange}
                />
            </Modal>
        </>
    );
}

export default PlanningViewDialog;
