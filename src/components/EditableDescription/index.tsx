import {EditOutlined} from '@ant-design/icons';
import type {InputRef} from 'antd';
import {Button, DatePicker, Input, Select} from 'antd';
import type {DefaultOptionType, SelectProps} from 'antd/es/select';
import type {ReactElement} from 'react';
import React, {useEffect, useRef, useState} from 'react';
import './editable-description.less';
import dayjs from 'dayjs';


type EditableDesProps = {
    children?: ReactElement[] | JSX.Element | string;
    type?: 'text' | 'select' | 'date',
    value: string | number;
    onChange?: (val: string | number, options: DefaultOptionType | DefaultOptionType[]) => any;
    options?: SelectProps['options'];
};

const EditableDes: React.FC<EditableDesProps> = (props) => {
    const inputRef = useRef<InputRef>(null);

    const [defaultVal, setDefaultVal] = useState<string | number>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    let value = props.value;
    let selectedOptions: DefaultOptionType | DefaultOptionType[];

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
                    <EditOutlined/>
                </div>
            </div>
        );
    };

    const onCancel = () => setIsEdit(false);
    const onSubmit = () => {
        if (props.onChange) {
            props.onChange(value, selectedOptions);
            setDefaultVal(value);
        }
        setIsEdit(false);
    };

    const getEdit = () => {
        const text = (
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
                onChange={(val, opts) => {
                    selectedOptions = opts;
                    value = val;
                }
                }
                options={props.options}
            />
        );

        const datePicker = () => {
            return (
                <DatePicker defaultValue={value ? dayjs(new Date(), 'YYYY-MM-DD') : undefined}
                            placeholder={''}
                            onChange={(d, s) => value = s}
                />
            )
        }

        let input = props.options ? select : text
        if (props.type === 'date') {
            input = datePicker();
        }

        return (
            <div className={'edit-block'}>
                <div className={'edit-input'}>{input}</div>
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
