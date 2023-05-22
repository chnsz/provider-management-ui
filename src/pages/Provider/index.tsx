import SearchForm from '@/components/SearchForm';
import Introduction from '@/pages/Provider/introduction-dialog';
import PrListDialog from '@/pages/Provider/pr_list_dialog';
import {
    changeEpsSupport,
    changePrePaidSupport,
    changeQualityStatus,
    changeTagSupport,
    changeUtFlag,
    getProviderScoreList,
} from '@/services/provider/api';
import { createFromIconfontCN, SafetyCertificateOutlined } from '@ant-design/icons';
import { Breadcrumb, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import './provider.less';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overridden)
        '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
        '//at.alicdn.com/t/c/font_4039325_co8qvh6ah1.js',
    ],
});

const ProviderList: React.FC<{ owners: string[] }> = ({ owners }) => {
    const [data, setData] = useState<Provider.ProviderScoreDto[]>([]);

    const onChange = (type: string, record: Provider.ProviderScoreDto) => {
        return (checked: boolean) => {
            switch (type) {
                case 'prePaidSupport':
                    changePrePaidSupport(record.id, checked ? 'true' : 'false');
                    return;
                case 'epsSupport':
                    changeEpsSupport(record.id, checked ? 'true' : 'false');
                    return;
                case 'tagSupport':
                    changeTagSupport(record.id, checked ? 'true' : 'false');
                    return;
                case 'utFlag':
                    changeUtFlag(record.id, checked ? 'full_coverage' : '-');
                    return;
            }
        };
    };

    const onChangeQualityStatus = (record: Provider.ProviderScoreDto) => {
        return () => {
            const state = record.qualityStatus === 'checked' ? 'unchecked' : 'checked';
            changeQualityStatus(record.id, state).then((d) => {
                if (d.affectedRow) {
                    const arr = data.map((t) => {
                        if (t.id === record.id) {
                            t.qualityStatus = state;
                        }
                        return t;
                    });
                    setData(arr);
                }
            });
        };
    };

    useEffect(() => {
        getProviderScoreList(owners, '', '').then((data) => {
            if (data.items.length === 0) {
                setData([]);
                return;
            }
            setData(data.items.slice(0, 100));
        });
    }, [owners]);

    const columns: ColumnsType<Provider.ProviderScoreDto> = [
        {
            title: '资源类型',
            dataIndex: 'type',
            width: '6%',
        },
        {
            title: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资源名称</>,
            dataIndex: 'name',
            width: '14%',
            render: (text, record) => {
                const resourceType = record.type === 'Resource' ? 'resources' : 'data-sources';
                const resourceName = record.name.replace('huaweicloud_', '');

                const color = record.qualityStatus === 'checked' ? '#389e0d' : 'rgb(223 223 223)';
                return (
                    <>
                        <SafetyCertificateOutlined
                            style={{
                                color: color,
                                fontSize: '18px',
                                marginRight: '5px',
                                cursor: 'point',
                            }}
                            onClick={onChangeQualityStatus(record)}
                        />
                        <a
                            href={`https://registry.terraform.io/providers/huaweicloud/huaweicloud/latest/docs/${resourceType}/${resourceName}`}
                            target={'_blank'}
                            rel="noreferrer"
                        >
                            {text}
                        </a>
                    </>
                );
            },
        },
        {
            title: '责任人',
            width: '7%',
            dataIndex: 'owner',
        },
        {
            title: '包周期',
            width: '7%',
            dataIndex: 'prePaidSupport',
            render: (text, record) => {
                return (
                    <>
                        <Switch
                            defaultChecked={record.prePaidSupport === 'true'}
                            onChange={onChange('prePaidSupport', record)}
                        />
                    </>
                );
            },
        },
        {
            title: '标签',
            width: '7%',
            dataIndex: 'tagSupport',
            render: (text, record) => {
                return (
                    <>
                        <Switch
                            defaultChecked={record.tagSupport === 'true'}
                            onChange={onChange('tagSupport', record)}
                        />
                    </>
                );
            },
        },
        {
            title: '企业项目',
            width: '7%',
            dataIndex: 'epsSupport',
            render: (text, record) => {
                return (
                    <>
                        <Switch
                            defaultChecked={record.epsSupport === 'true'}
                            onChange={onChange('epsSupport', record)}
                        />
                    </>
                );
            },
        },
        {
            title: 'UT 覆盖率（%）',
            width: '7%',
            dataIndex: 'utCoverage',
            render: (text, record) => {
                return (
                    <>
                        <Switch
                            defaultChecked={record.utFlag === 'full_coverage'}
                            checkedChildren={text}
                            unCheckedChildren={text}
                            onChange={onChange('utFlag', record)}
                        />
                    </>
                );
            },
        },
        {
            title: '质量守护',
            width: '7%',
            dataIndex: 'prScore',
            align: 'center',
            render: (v, row) => (
                <PrListDialog
                    val={v}
                    owner={row.owner}
                    providerType={row.type}
                    providerName={row.name}
                />
            ),
        },
        {
            title: 'UT 分值',
            width: '7%',
            dataIndex: 'utScore',
            align: 'center',
            render: (v) => v || 0,
        },
        {
            title: 'Bug',
            width: '7%',
            dataIndex: 'bugScore',
            align: 'center',
            render: (v) => v || 0,
        },
        {
            title: '总分',
            width: '7%',
            dataIndex: 'totalScore',
            align: 'center',
            render: (v) => v || 0,
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            size={'middle'}
            pagination={false}
            rowKey={(record) => record.id}
        />
    );
};

const Provider: React.FC = () => {
    const [owners, setOwners] = useState<string[]>([]);

    return (
        <div className={'provider'}>
            <Breadcrumb
                items={[{ title: '首页' }, { title: 'Provider 分析' }]}
                style={{ margin: '10px 0' }}
            />
            <div className={'header'}>
                <SearchForm
                    onSearch={(formData) => {
                        setOwners(formData.owner);
                    }}
                    options={['owner']}
                />
            </div>
            <div style={{ background: '#fff', marginTop: '15px' }}>
                <div className={'custom-title title'}>
                    <div className={'title'}>资源列表</div>
                    <div className={'toolbar'}>
                        <Introduction />
                    </div>
                </div>
                <div className={'provider-list'}>
                    <ProviderList owners={owners} />
                </div>
            </div>
        </div>
    );
};

export default Provider;
