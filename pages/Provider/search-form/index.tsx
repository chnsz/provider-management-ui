import {getUserList} from '@/services/product/api';
import {Button, Space} from 'antd';
import type {ButtonType} from 'antd/es/button/buttonHelpers';
import React, {useEffect, useState} from 'react';

export type SearchFormProps = {
    owner: string[];
    status: string;
};

type defaultValueType = {
    owner?: string[];
    status?: string;
}

const taskStatus: { label: string, value: string }[] = [
    {label: '待合并', value: 'open'},
];

const SearchForm: React.FC<{
    onSearch: (val: SearchFormProps) => any,
    defaultValue?: defaultValueType
}> = (props) => {
    const [ownerList, setOwnerList] = useState<string[]>([]);
    const [selectedOwner, setSelectedOwner] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

    useEffect(() => {
        getUserList().then((rsp) => {
            setOwnerList(rsp.items.map((u: Product.User) => u.username));
        });
    }, []);

    useEffect(() => {
        props.onSearch({
            owner: selectedOwner,
            status: selectedStatus,
        });
    }, [selectedOwner, selectedStatus]);

    const onOwnerClick = function (name: string) {
        return function () {
            if (selectedOwner.includes(name)) {
                const arr = selectedOwner.filter((n) => n !== name);
                setSelectedOwner(arr);
            } else {
                setSelectedOwner([...selectedOwner, name]);
            }
        };
    };

    const onStatusClick = function (value: string) {
        return function () {
            if (selectedStatus.includes(value)) {
                const arr = selectedStatus.filter((n) => n !== value);
                setSelectedStatus(arr);
            } else {
                setSelectedStatus([...selectedStatus, value]);
            }
        };
    };

    const clearFilter = function (name: string) {
        return function () {
            if (name === 'owner') {
                setSelectedOwner([]);
            } else if (name === 'status') {
                setSelectedStatus([]);
            }
        };
    };


    return (
        <Space direction="vertical" size="middle" style={{display: 'flex'}}>
            <div>
                <span className={'custom-label'}>按状态：</span>
                <Space>
                    {
                        taskStatus.map(s => {
                            const type: ButtonType = selectedStatus.includes(s.value) ? 'primary' : 'dashed';

                            return <Button key={s.value} size={'small'} type={type}
                                           onClick={onStatusClick(s.value)}>
                                {s.label}
                            </Button>
                        })
                    }
                    <Button size={'small'} type={'link'} onClick={clearFilter('status')}>
                        清空已选
                    </Button>
                </Space>
            </div>
            <div>
                <span className={'custom-label'}>按田主：</span>
                <Space>
                    {ownerList.map((t) => {
                        const type: ButtonType = selectedOwner.includes(t) ? 'primary' : 'dashed';

                        return (
                            <Button key={t} size={'small'} type={type} onClick={onOwnerClick(t)}>
                                {t}
                            </Button>
                        );
                    })}
                    <Button size={'small'} type={'link'} onClick={clearFilter('owner')}>
                        清空已选
                    </Button>
                </Space>
            </div>
        </Space>
    );
};

export default SearchForm;
