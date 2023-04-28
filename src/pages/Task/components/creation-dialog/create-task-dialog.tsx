import React, {useState} from "react";
import {Button, Modal} from "antd";
import {createTask} from "@/services/task/api";
import TaskDetailEditor from "@/pages/Task/components/creation-dialog/task-detail-editor";

const CreateTaskDialog: React.FC<{ productName: string, onClosed: () => any }> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [task, setTask] = useState<Task.CreateOpts>({
        assignee: "",
        content: "",
        deadline: "",
        priority: 0,
        productName: props.productName,
        status: "",
        title: ""
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const closeModel = () => {
        setTask({
            productName: props.productName,
            assignee: "",
            content: "",
            deadline: "",
            priority: 1,
            status: "new",
            title: ""
        })
        setIsModalOpen(false);
    }

    const handleOk = () => {
        setIsModalOpen(false);

        createTask(task).then(() => {
            if (props.onClosed) {
                props.onClosed();
            }
        })
    };

    const onChange = (detail: Task.CreateOpts) => {
        setTask(detail);
    }

    return (
        <>
            <Button onClick={showModal} size={'small'} type={'primary'}>新建待办</Button>
            <Modal title="新建待办"
                   transitionName={''}
                   destroyOnClose
                   open={isModalOpen}
                   onCancel={closeModel}
                   width={1600}
                   footer={[
                       <Button key="close" type="primary" onClick={handleOk}>保存</Button>
                   ]}
            >
                <TaskDetailEditor task={task} onChange={onChange}/>
            </Modal>
        </>
    );
}

export default CreateTaskDialog;
