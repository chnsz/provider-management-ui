import {Select, Tag} from 'antd';
import type {CustomTagProps} from 'rc-select/lib/BaseSelect';
import React from 'react';

const color = {
    'argument': 'blue',
    'attribute': 'cyan',
    'update': 'orange',
    'delete': 'red',
}
const tagRender = (props: CustomTagProps) => {
    const {label, value, closable, onClose} = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <Tag
            color={color[value]}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{marginRight: 3}}
        >
            {label}
        </Tag>
    );
};

const ApiCategory: React.FC = () => (
    <Select
        showArrow
        style={{width: '140px'}}
        placeholder={'请选择操作'}
    >
        <Option value="argument">CreateContext</Option>
        <Option value="attribute">ReadContext</Option>
        <Option value="update">UpdateContext</Option>
        <Option value="delete">DeleteContext</Option>
    </Select>
);

export default ApiCategory;
