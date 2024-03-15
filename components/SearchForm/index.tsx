import { getProductList, getUserList } from '@/services/product/api';
import { Button, Select, Space } from 'antd';
import type { ButtonType } from 'antd/es/button/buttonHelpers';
import type { SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';

export type SearchFormProps = {
    productName: string[];
    owner: string[];
    status: string[];
};

type defaultValueType = {
    productName?: string[];
    owner?: string[];
    status?: string[];
}

const taskStatus: { label: string, value: string }[] = [
    { label: '未启动', value: 'new' },
    { label: '进行中', value: 'processing' },
    { label: '待合并', value: 'merging' },
    { label: '已合并', value: 'merged' },
    { label: '冻结', value: 'freeze' },
    { label: '已关闭', value: 'closed' },
];

const SearchForm: React.FC<{
    onSearch: (val: SearchFormProps) => any,
    options?: string[],
    defaultValue?: defaultValueType
}> = (props) => {
    const [ownerList, setOwnerList] = useState<string[]>([]);
    const [serviceOptions, setServiceOptions] = useState<SelectProps['options']>([]);
    const [selectedOwner, setSelectedOwner] = useState<string[]>(props.defaultValue?.owner || []);
    const [selectedProduct, setSelectedProduct] = useState<string[]>(props.defaultValue?.productName || []);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

    useEffect(() => {
        getProductList().then((data) => {
            const opts = data.items
                .map((product: Product.Product) => product.productName)
                .sort();
            const optsList = [...new Set([...opts])];
            const newOpts = optsList.map((productName: string) => {
                return { value: productName, label: productName };
            });
            setServiceOptions(newOpts);
        });

        getUserList().then((rsp) => {
            setOwnerList(rsp.items.map((u: Product.User) => u.username));
        });
    }, []);

    useEffect(() => {
        props.onSearch({
            productName: selectedProduct,
            owner: selectedOwner,
            status: selectedStatus,
        });
    }, [selectedOwner, selectedProduct, selectedStatus]);

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

    const onServiceSelected = function (value: string[]) {
        setSelectedProduct(value);
    };

    const clearFilter = function (name: string) {
        return function () {
            if (name === 'owner') {
                setSelectedOwner([]);
            } else if (name === 'service') {
                setSelectedProduct([]);
            } else if (name === 'status') {
                setSelectedStatus([]);
            }
        };
    };

    const items = props.options || ['status', 'owner', 'product'];

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            {
                items.includes('status') ?
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
                    </div> : ''
            }
            {
                items.includes('owner') ?
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
                    </div> : ''
            }
            {
                items.includes('product') ?
                    <div>
                        <span className={'custom-label'}>按服务：</span>
                        <Select
                            mode="multiple"
                            allowClear={true}
                            placeholder="选择服务过滤数据"
                            style={{ minWidth: '45%', maxWidth: '80%' }}
                            options={serviceOptions}
                            defaultValue={props.defaultValue?.productName || []}
                            onChange={onServiceSelected}
                        />
                    </div> : ''
            }
        </Space>
    );
};

export default SearchForm;
