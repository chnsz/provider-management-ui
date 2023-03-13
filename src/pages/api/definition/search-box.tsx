import {getMenu} from '@/services/api';
import {AutoComplete, Input} from 'antd';
import type {SelectProps} from 'antd/es/select';
import React, {useState} from 'react';

let menu: any[] = [];
(async () => await getMenu('menu-api.json'))().then((d) => (menu = d));

const SearchBox: React.FC<{ defaultValue?: string; onSelect?: (value: string) => any }> = (
    props,
) => {
    const [options, setOptions] = useState<SelectProps<object>['options']>([]);
    const searchResult = (query: string) => {
        const data = menu
            .filter((t) => t.label.toLowerCase().indexOf(query.toLowerCase()) !== -1)
            .map((t) => {
                return {
                    value: t.label,
                    label: t.label,
                };
            });
        return data;
    };

    const handleSearch = (value: string) => {
        setOptions(value ? searchResult(value) : []);
    };

    const onSelect = (value: string) => {
        if (props!.onSelect) {
            props!.onSelect(value);
        }
    };

    return (
        <AutoComplete
            dropdownMatchSelectWidth={252}
            defaultActiveFirstOption
            style={{width: '100%'}}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            defaultValue={props!.defaultValue}
        >
            <Input.Search size="large" placeholder="请输入服务名，如ECS" enterButton/>
        </AutoComplete>
    );
};

export default SearchBox;
