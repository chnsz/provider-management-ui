import React, {useState} from "react";
import {Button, Modal} from "antd";
import ProviderPlanningEditor, {
    CreateOptions
} from "@/pages/ProviderPlanning/components/creation-dialog/provider-planning-editor";
import {createProviderPlanning} from "@/services/provider-planning/api";


const AddFeaturePlanningDialog: React.FC<{ productName: string, onClosed: () => any }> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planning, setPlanning] = useState<CreateOptions>({
        productName: props.productName,
        featureId: '',
        featureName: '',
        title: '',
        priority: '1',
        priorityStr: 'P1',
        status: 'new',
        assignee: '',
        content: '',
        providerList: [],
        apiList: [],
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const closeModel = ()=>{
        setPlanning({
            productName: props.productName,
            featureId: '',
            featureName: '',
            title: '',
            priority: '1',
            priorityStr: 'P1',
            status: 'new',
            assignee: '',
            content: '',
            providerList: [],
            apiList: [],
        })
        setIsModalOpen(false);
    }

    const handleOk = () => {
        setIsModalOpen(false);

        createProviderPlanning({
            apiIdList: planning.apiList.map(t => {
                return t.id
            }),
            assignee: planning.assignee,
            content: planning.content,
            featureId: parseInt(planning.featureId || '0'),
            priority: parseInt(planning.priority || '1'),
            productName: planning.productName,
            providerList: planning.providerList,
            status: planning.status,
            title: planning.title
        }).then(() => {
            if (props.onClosed) {
                props.onClosed();
            }
        })
    };

    const onChange = (detail: CreateOptions) => {
        setPlanning(detail);
    }

    return (
        <>
            <Button onClick={showModal} size={'small'} type={'primary'}>新建规划</Button>
            <Modal title="新建规划"
                   transitionName={''}
                   destroyOnClose
                   open={isModalOpen}
                   onCancel={closeModel}
                   width={1600}
                   footer={[
                       <Button key="close" type="primary" onClick={handleOk}>保存</Button>
                   ]}
            >
                <ProviderPlanningEditor
                    providerPlanning={planning}
                    onChange={onChange}
                />
            </Modal>
        </>
    );
}

export default AddFeaturePlanningDialog;
