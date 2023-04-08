import { EditOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import './editable-description.less';

type EditableDesProps = {
    children?: ReactElement[] | JSX.Element | string;
    value: string | number;
    onChange?: (val: string | number) => any;
    options?: SelectProps['options'];
};

const EditableDes: React.FC<EditableDesProps> = (props) => {
    const inputRef = useRef<InputRef>(null);

    const [defaultVal, setDefaultVal] = useState<string | number>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    let value = props.value;

    useEffect(() => {
        setDefaultVal(props.value);
    }, [props.value]);

    const onEditClick = function () {
        if (isEdit) {
            setIsEdit(false);
            return;
        }
        setIsEdit(true);
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 50);
    };

    const getDesc = () => {
        return (
            <div className={'description'}>
                <div className={'view'}>{props.children ? props.children : defaultVal}</div>
                <div className={'edit-btn'} title={'编辑'} onClick={onEditClick}>
                    <EditOutlined />
                </div>
            </div>
        );
    };

    const onCancel = () => setIsEdit(false);
    const onSubmit = () => {
        if (props.onChange) {
            props.onChange(value);
            setDefaultVal(value);
        }
        setIsEdit(false);
    };

    const getEdit = () => {
        const input = (
            <Input
                ref={inputRef}
                defaultValue={defaultVal}
                onChange={(e) => (value = e.currentTarget.value)}
                bordered={false}
            />
        );

        const select = (
            <Select
                size={'small'}
                showSearch
                className={'select-input'}
                defaultValue={defaultVal}
                onChange={(val) => (value = val)}
                options={props.options}
            />
        );

        return (
            <div className={'edit-block'}>
                <div className={'edit-input'}>{props.options ? select : input}</div>
                <div className={'submit-btn'}>
                    <Button type={'link'} size={'small'} onClick={onSubmit}>
                        保存
                    </Button>
                    <Button type={'link'} size={'small'} onClick={onCancel}>
                        取消
                    </Button>
                </div>
            </div>
        );
    };

    return <div className={'editable-description'}>{!isEdit ? getDesc() : getEdit()}</div>;
};

export default EditableDes;
