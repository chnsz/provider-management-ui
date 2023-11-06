import {Breadcrumb, Button, Popconfirm, Select, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import '../settings.less';
import {
    addCategoryProduct,
    deleteCategoryProduct,
    listCategoryProduct,
    updateCategoryProduct
} from "@/services/provider/api";
import {getProductList} from "@/services/product/api";
import CustomBreadcrumb from "@/components/Breadcrumb";

const CategoryProductConfig: React.FC = () => {
    const [data, setData] = useState<Provider.CategoryProductDto[]>([]);
    const [productOptions, setProductOptions] = useState<{ value: string; label: string }[]>([]);

    const loadData = () => {
        listCategoryProduct().then(r => {
            r.items.sort((a, b) => a.productName.localeCompare(b.productName));
            setData(r.items);
        });
    }

    useEffect(() => {
        loadData();

        getProductList().then((r) => {
            const mapper: Record<string, string> = {};
            r.items.forEach(t => {
                mapper[t.productName] = t.productName + ' / ' + t.productNameZh;
                mapper[t.productNameC] = t.productNameC + ' / ' + t.productNameCZh;
            });

            const arr: { value: string; label: string }[] = [];
            for (const key in mapper) {
                if (mapper.hasOwnProperty(key)) {
                    arr.push({value: key, label: mapper[key]})
                }
            }
            setProductOptions(arr);
        });
    }, []);

    const saveData = (productName: any, row: Provider.CategoryProductDto) => {
        if (row.id === 0) {
            addCategoryProduct(row.categoryName, productName).then(loadData);
            return;
        }
        updateCategoryProduct(row.id, productName).then(loadData);
    }

    const columns: ColumnsType<Provider.CategoryProductDto> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            width: '20%',
        },
        {
            title: '服务',
            dataIndex: 'productName',
            width: '20%',
            render: (v: any, row) => {
                return (
                    <Select
                        defaultValue={v}
                        style={{width: '100%'}}
                        bordered={false}
                        showSearch
                        onChange={(v) => saveData(v, row)}
                        options={productOptions}
                    />
                );
            },
        },
        {
            title: '备注',
            dataIndex: 'tags',
            render: (v, row) => {
                if (v === 'unused') {
                    return <span style={{color: '#faad14'}}>该 Category 已不再使用</span>;
                }
                if (row.productName === '' && row.categoryName !== 'Deprecated') {
                    return <span style={{color: '#ff4d4f'}}>服务名称为空，请配置</span>
                }
                return v;
            },
        },
        {
            title: '操作',
            dataIndex: 'id',
            width: 100,
            align: 'center',
            render: v => {
                return <Popconfirm
                    title="删除 Category 配置"
                    description="确定要删除该条数据？"
                    onConfirm={() => {
                        deleteCategoryProduct(v).then(() => {
                            const arr = data.filter(t => t.id !== v)
                            setData(arr);
                        });
                    }}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button danger type={'link'}>删除</Button>
                </Popconfirm>
            },
        },
    ];

    return (
        <div>
            <div style={{marginTop: '20px'}}>
                <CustomBreadcrumb
                    items={[
                        {title: '首页'},
                        {title: <a href="">系统配置</a>},
                        {title: <a href="">Category 配置</a>},
                    ]}
                />
            </div>
            <div className={'serve-card'}>
                <h3>Category 配置列表</h3>
                <Table
                    pagination={false}
                    rowClassName={() => 'editable-row'}
                    bordered
                    size={'small'}
                    dataSource={data}
                    columns={columns}
                />
            </div>
        </div>
    );
};

export default CategoryProductConfig;
