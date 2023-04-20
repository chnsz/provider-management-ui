import React from "react";
import {Button, Modal} from "antd";
import {ButtonType} from "antd/es/button/buttonHelpers";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {SizeType} from "antd/es/config-provider/SizeContext";

const {confirm} = Modal;

const DeleteBtn: React.FC<{
    text: string,
    title: string,
    content?: React.ReactNode,
    onOk: () => any

    type?: ButtonType,
    size?: SizeType,
    disabled?:boolean,
}> = (props) => {

    const onClick = () => {
        confirm({
                title: '删除资源规划',
                icon: <ExclamationCircleFilled/>,
                maskTransitionName: '',
                width: 600,
                okText: '删除',
                cancelText: '取消',
                content: props.content,
                onOk: props.onOk,
            }
        );
    }

    return <>
        <Button danger
                type={props.type}
                size={props.size}
                onClick={onClick}
                disabled={props.disabled}
        >
            {props.text}
        </Button>
    </>
}

export default DeleteBtn;
