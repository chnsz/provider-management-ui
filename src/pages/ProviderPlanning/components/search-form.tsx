import React, {useEffect, useState} from "react";
import {getUserList, getProductList} from "@/services/product/api";
import {ButtonType} from "antd/es/button/buttonHelpers";
import {Button, Select, Space} from "antd";
import {SelectProps} from "antd/es/select";

export type ProviderPlanningFormProps = {
    productName: string[];
    owner: string[];
};

const SearchForm: React.FC<{ onSearch: (val: ProviderPlanningFormProps) => any }> = (props) => {
    const [ownerList, setOwnerList] = useState<string[]>([]);
    const [serviceOptions, setServiceOptions] = useState<SelectProps['options']>([]);
    const [selectedOwner, setSelectedOwner] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string[]>([]);

    useEffect(() => {
        getProductList().then((data) => {
            const opts = data.items
                .map(product => product.productName)
                .sort()
                .map(productName => {
                    return {value: productName, label: productName};
                });
            setServiceOptions(opts);
        });

        getUserList().then((rsp) => {
            setOwnerList(rsp.items.map(t => t.username));
        });
    }, []);

    useEffect(() => {
        props.onSearch({
            productName: selectedProduct,
            owner: selectedOwner,
        });
    }, [selectedOwner, selectedProduct]);

    const onOwnerClick = function (name: string) {
        return function () {
            if (selectedOwner.includes(name)) {
                const arr = selectedOwner.filter(n => n !== name)
                setSelectedOwner(arr);
            } else {
                setSelectedOwner([...selectedOwner, name]);
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
            }
        };
    };

    return (
        <Space direction="vertical" size="middle" style={{display: 'flex'}}>
            <div>
                <span className={'custom-label'}>按田主：</span>
                <Space>
                    {ownerList.map(t => {
                        let type: ButtonType =  selectedOwner.includes(t) ? 'primary':'dashed';

                        return (
                            <Button key={t} size={'small'} type={type} onClick={onOwnerClick(t)}>{t}</Button>
                        );
                    })}
                    <Button size={'small'} type={'link'} onClick={clearFilter('owner')}>
                        清空已选
                    </Button>
                </Space>
            </div>
            <div>
                <span className={'custom-label'}>按服务：</span>
                <Select
                    mode="multiple"
                    allowClear={true}
                    placeholder="选择服务过滤数据"
                    style={{minWidth: '45%', maxWidth: '80%'}}
                    options={serviceOptions}
                    onChange={onServiceSelected}
                />
            </div>
        </Space>
    );
}

export default SearchForm;
