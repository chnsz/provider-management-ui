import {getProductList, getProductListPaged, getUserList, updateProduct} from '@/services/product/api';
import {Select, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {set} from 'lodash';
import React, {useEffect, useState} from 'react';
import '../settings.less';
import CustomBreadcrumb from "@/components/Breadcrumb";
import {QueryFilter} from "@ant-design/pro-form";
import {ProFormSelect} from "@ant-design/pro-components";
import type {ProSchemaValueEnumObj} from "@ant-design/pro-utils/es/typing";

type FormProps = {
    productGroup: string;
    productName: string;
};

const SearchForm: React.FC<{
    onSearch: (val: FormProps) => any,
}> = ({data, onSearch}) => {
    const [productGroupOptions, setProductGroupOptions] = useState<ProSchemaValueEnumObj>({});
    const [productNameOptions, setProductNameOptions] = useState<ProSchemaValueEnumObj>({});
    const [productGroup, setProductGroup] = useState<string>('');
    const [productName, setProductName] = useState<string>('');

    useEffect(() => {
        onSearch({productGroup: productGroup, productName: productName})
    }, [productGroup, productName]);

    useEffect(() => {
        getProductList().then((response) => {
            let mapper: Record<string, boolean> = {};

            const productNameMap: ProSchemaValueEnumObj = {};
            response.items
                .filter((d) => {
                    if (d.productNameC in mapper) {
                        return false;
                    }
                    mapper[d.productNameC] = true;
                    return true;
                }).map(v => v.productNameC).sort().forEach(n => productNameMap[n] = n);
            setProductNameOptions(productNameMap);

            mapper = {};
            const productGroupMap: ProSchemaValueEnumObj = {};
            response.items.filter((d) => {
                if (d.productGroup in mapper) {
                    return false;
                }
                mapper[d.productGroup] = true;
                return true;
            }).map(v => v.productGroup).forEach(n => productGroupMap[n] = n);
            setProductGroupOptions(productGroupMap);
        });
    }, []);

    return (
        <QueryFilter<FormProps>
            span={4}
            labelWidth={80}
            searchGutter={8}
            style={{marginTop: '20px', marginBottom: '-27px'}}
            onFinish={async (values) => onSearch(values)}
            onReset={async () => onSearch({productGroup: '', productName: ''})}
        >
            <ProFormSelect
                name="productGroup"
                label="服务领域"
                showSearch
                valueEnum={productGroupOptions}
                fieldProps={{
                    onChange: (v) => {
                        setProductGroup(v);
                        setProductName('');
                    }
                }}
            />
            <ProFormSelect
                name="productName"
                label="服务简称"
                showSearch
                valueEnum={productNameOptions}
                fieldProps={{
                    value: productName,
                    onChange: (v) => setProductName(v),
                }}
            />
        </QueryFilter>
    );
};

const OwnerView: React.FC<{
    name: string,
    onChange: (value: string) => any,
    onClear: () => any,
}> = ({name, onChange, onClear}) => {
    const [value, setValue] = useState<string>();
    const [ownerList, setOwnerList] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        getUserList().then((rsp) => {
            const arr = rsp.items.map((u: Product.User) => {
                return {
                    value: u.username,
                    label: u.username,
                };
            });
            setOwnerList(arr);
        });
    }, []);

    useEffect(() => {
        setValue(name);
    }, [name])

    return <Select
        value={value}
        style={{width: '100%'}}
        bordered={false}
        allowClear
        onClear={onClear}
        onChange={
            (val) => {
                setValue(val);
                onChange(val);
            }}
        options={ownerList}
    />
}

const SelectView: React.FC<{
    defaultVal: string,
    options: { value: string; label: string }[],
    onChange: (value: string) => any,
    onClear: () => any,
    showSearch?: boolean,
}> = ({defaultVal, options, onChange, onClear, showSearch}) => {
    const [value, setValue] = useState<string>(defaultVal);
    useEffect(() => {
        setValue(defaultVal);
    }, [defaultVal]);

    return <Select
        value={value}
        style={{width: '100%'}}
        bordered={false}
        showSearch
        allowClear={!!onClear}
        onClear={onClear}
        onChange={(v) => {
            setValue(v);
            onChange(v);
        }}
        options={options}
    />
}

const ServiceConfig: React.FC = () => {
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(15);
    const [pageNum, setPageNum] = useState<number>(1);
    const [params, setParams] = useState<{ productName: string, productGroup: string }>({
        productName: '',
        productGroup: ''
    });
    const [data, setData] = useState<Product.Product[]>([]);
    const [serviceOptions, setServiceOptions] = useState<{ val: string; value: string; label: string }[]>([]);
    const [productList, setProductList] = useState<Product.Product[]>([]);

    const loadData = (formData: { productName: string, productGroup: string }) => {
        getProductListPaged(formData, pageSize, pageNum).then((response) => {
            const arr = response.items.sort((a, b) => {
                const s1 = a.productGroup + a.productName;
                const s2 = b.productGroup + b.productName;
                return s1.localeCompare(s2);
            });
            setData(arr);
            setTotal(response.total);
        })
    }

    useEffect(() => {
        loadData(params);
    }, [params, pageSize, pageNum]);

    useEffect(() => {
        getProductList().then((response) => {
            const mapper: Record<string, boolean> = {};
            const svcOptions = response.items
                .filter((d) => {
                    if (d.productNameC in mapper) {
                        return false;
                    }
                    mapper[d.productNameC] = true;
                    return true;
                })
                .map((d) => {
                    return {
                        val: d.productNameC,
                        value: d.productNameC + '@' + d.productNameCZh,
                        label: d.productNameC + ' / ' + d.productNameCZh,
                    };
                })
                .sort((a, b) => a.label.localeCompare(b.label));
            setServiceOptions(svcOptions);
        });
    }, []);

    const saveData = (field: string, val: string, product: Product.Product) => {
        if (field === 'productNameC') {
            const arr = val.split('@');
            product.productNameC = arr[0];
            product.productNameCZh = arr[1];
        } else {
            set(product, field, val);
        }
        updateProduct(product.id, product);
    };

    const columns: ColumnsType<Product.Product> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '服务领域',
            dataIndex: 'productGroup',
            width: '20%',
        },
        {
            title: '服务',
            dataIndex: 'productNameC',
            width: '20%',
            render: (v: any, row) => {
                const val = row.productNameC + ' / ' + row.productNameCZh;
                return <SelectView defaultVal={val}
                                   showSearch
                                   options={serviceOptions}
                                   onClear={() =>
                                       setTimeout(() => {
                                           saveData('level', '', row);
                                       }, 50)}
                                   onChange={(v) => saveData('productNameC', v, row)}
                />;
            },
        },
        {
            title: '服务（API Explorer）',
            dataIndex: 'productName',
            width: '20%',
            render: (v, row) => (
                <>
                    {row.productName} / {row.productNameZh}
                </>
            ),
        },
        {
            title: '服务分级',
            dataIndex: 'level',
            align: 'center',
            width: '10%',
            render: (v: any, row) => {
                return <SelectView defaultVal={v === '' ? ' ' : v}
                                   onClear={() =>
                                       setTimeout(() => {
                                           saveData('level', '', row);
                                       }, 50)}
                                   onChange={(v) => saveData('level', v, row)}
                                   options={[
                                       {value: '核心服务', label: '核心服务'},
                                       {value: '主力服务', label: '主力服务'},
                                       {value: '', label: '(清空）'},
                                   ]}
                />;
            },
        },
        {
            title: 'API数量',
            dataIndex: 'apiCount',
            align: 'center',
            width: '10%',
        },
        {
            title: '责任人',
            dataIndex: 'owner',
            align: 'center',
            width: '10%',
            render: (v: any, row) => {
                return <OwnerView
                    name={v === '' ? ' ' : v}
                    onClear={() =>
                        setTimeout(() => {
                            saveData('owner', '', row);
                        }, 50)
                    }
                    onChange={(v) => saveData('owner', v, row)}
                />;
            },
        },
        {
            title: '状态',
            dataIndex: 'statusCode',
            align: 'center',
            render: (v: any, row) => {
                return (
                    <Select
                        defaultValue={v}
                        style={{width: '100%'}}
                        bordered={false}
                        onChange={(v) => saveData('statusCode', v, row)}
                        options={[
                            {value: 'active', label: '监听中'},
                            {value: 'ignore', label: '不监听'},
                        ]}
                    />
                );
            },
        },
    ];

    return (
        <div>
            <div style={{marginTop: '25px'}}>
                <CustomBreadcrumb
                    items={[
                        {title: '首页'},
                        {title: <a href="">系统配置</a>},
                        {title: <a href="">服务配置</a>},
                    ]}
                />
            </div>
            <SearchForm onSearch={setParams}/>
            <div className={'serve-card'} style={{marginTop: '15px'}}>
                <h3>服务列表</h3>
                <Table
                    rowClassName={() => 'editable-row'}
                    bordered
                    size={'small'}
                    dataSource={data}
                    columns={columns}
                    pagination={{
                        defaultCurrent: 1,
                        total: total,
                        size: 'default',
                        pageSize: pageSize,
                        current: pageNum,
                        showTotal: (num) => `总条数: ${num}`,
                        onShowSizeChange: (current, size) => {
                            setPageSize(size);
                        },
                        onChange: (page, size) => {
                            setPageSize(size);
                            setPageNum(page);
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default ServiceConfig;
