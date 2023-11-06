import React, {useState} from "react";
import type {MenuProps} from 'antd';
import {Badge, Dropdown, Input, message, Modal, Space, Table, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {updateProviderSyncStatus} from "@/services/provider/api";
import {EditOutlined} from "@ant-design/icons";
import {get} from "lodash";
import {CloudName, openDocsInRegistry} from "@/global";
import {PresetStatusColorType} from "antd/es/_util/colors";
import MonitorDialog from "@/pages/Partner/monitor/monitor-dialog";
import MonitorListDialog from "@/pages/Partner/monitor/monitor-list-dialog";
import {getSyncTypeName} from "@/pages/Partner/components/provider_sync_issue_dialog";
import {request} from "umi";
import {PMS_PATH} from "@/services/api";


const wrapperRequired = (v: any) => {
  if (!v) {
    return '';
  }
  if (v.toString().toLowerCase() === 'required') {
    return <Tag color={'gold'}>{v}</Tag>;
  }
  return <Tag color={'green'}>{v}</Tag>
}

const wrapperFieldCategory = (v: any) => {
  if (!v) {
    return '';
  }
  const mapper: { [type: string]: string } = {
    argument: 'blue',
    attribute: 'cyan',
    timeout: 'green',
    import: 'purple'
  };
  const color = mapper[v];
  return <Tag color={color}>{v}</Tag>;
}

const wrapperProviderName = (v: any, row: Provider.ProviderSyncIssue) => {
  if (v.toString().startsWith('huaweicloud_')) {
    return openDocsInRegistry(row.cloudName, row.providerType, row.providerName, v)
  }

  const status: PresetStatusColorType = row.isReference ? 'processing' : 'default';
  const el = <Badge status={status} text={v} style={{color: '#1890ff'}}/>
  return openDocsInRegistry(row.cloudName, row.providerType, row.providerName, el)
}

const wrapperFieldName = (v: any, row: Provider.ProviderSyncIssue, callback?: () => any) => {
  return <MonitorListDialog content={v}
                            cloudName={row.cloudName}
                            providerType={row.providerType}
                            providerName={row.providerName}
                            relationType={row.type}
                            onClose={() => {
                              if (callback) {
                                callback()
                              }
                            }}
  />
}

const renderCol = (field: string, wrapper?: (v: any, row: Provider.ProviderSyncIssue, callback?: () => any) => any, callback?: () => any) => {
  return (v: any, row: Provider.ProviderSyncIssue) => {
    if (wrapper === wrapperFieldName && !v) {
      return wrapper ? wrapper('(查看监控)', row, callback) : '(查看监控)';
    }
    if (!row.diffSchema) {
      return wrapper ? wrapper(v, row, callback) : v;
    }

    const diffVal = get(row, 'diffSchema.' + field)
    let v1 = (diffVal + '').toLowerCase();
    v1 = v1 === 'set' ? 'list' : v1;
    let v2 = (v + '').toLowerCase();
    v2 = v2 === 'set' ? 'list' : v2;

    if (v1 === v2) {
      return wrapper ? wrapper(v, row, callback) : v;
    }

    let borderTop = '1px dotted #fa8c16';
    // if (!diffVal) {
    //     borderTop = '';
    // }
    return <>
      <div style={{height: '22px'}}> {wrapper ? wrapper(v, row, callback) : v} </div>
      <div style={{borderTop: borderTop, height: '22px', borderRadius: '0px'}} title={'schema 中的值'}>
        {wrapper ? wrapper(diffVal, row, callback) : diffVal}
      </div>
    </>;
  }
}

const quickInputMapper: { [key: string]: { remark: string, status: string } } = {
  '1': {
    remark: '已提交PR，待合并',
    status: 'merging',
  },
  '2': {
    remark: '服务未上线',
    status: '',
  },
  '3': {
    remark: '缺少API',
    status: '',
  },
  '4': {
    remark: 'Schema为Optional，实际是Required',
    status: 'manually-closed',
  },
  '5': {
    remark: 'DataSource回填字段，误报',
    status: 'manually-closed',
  },
}

const getDropItems = () => {
  const items: MenuProps['items'] = [];
  for (let k in quickInputMapper) {
    if (!quickInputMapper.hasOwnProperty(k)) {
      continue
    }
    const input = quickInputMapper[k];
    items.push({
      key: k,
      label: (
        <span>{input.remark}</span>
      ),
    })
  }
  return items;
}

const Remark: React.FC<{ value: string, onChange: (remark: string, status: string) => any }> = ({value, onChange}) => {
  const [val, setVal] = useState<string>(value);

  const onClick: MenuProps['onClick'] = ({key}) => {
    if (!quickInputMapper.hasOwnProperty(key)) {
      return
    }

    const remark = quickInputMapper[key].remark;
    const status = quickInputMapper[key].status;

    setVal(remark);
    onChange(remark, status);
  };

  const items = getDropItems();
  return <Dropdown menu={{items, onClick}}>
    <Input value={val}
           onChange={e => setVal(e.target.value)}
           onBlur={e => onChange(e.target.value, '')}
    />
  </Dropdown>
}

const getCloudName = (url: string) => {
  if (url.includes("terraform-provider-flexibleengine")) {
    return CloudName.FlexibleEngineCloud
  }
  if (url.includes("terraform-provider-huaweicloud")) {
    return CloudName.HuaweiCloud
  }
  if (url.includes("terraform-provider-g42cloud")) {
    return CloudName.G42Cloud
  }
  return ""
}

async function getCheckIssuesList(url: string) {
  return request<Provider.ProviderSyncIssue[]>(`${PMS_PATH}/checker/issue/list`, {
    method: 'GET',
    params: {url},
  });
}

const ProviderSyncIssueStaticDialog: React.FC<{
  content: any,
  url: string,
}> = ({url, content}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataSource, setDataSource] = useState<Provider.ProviderSyncIssue[]>([]);
  const cloudName = getCloudName(url);

  const showModal = () => {
    getCheckIssuesList(url).then(t => {
      setDataSource(t || []);
    })
    setIsModalOpen(true);
  };

  const closeModel = () => {
    setIsModalOpen(false);
  };

  const modifyStatusChange = (id: number, status: string, remark: string) => {
    updateProviderSyncStatus(id, status, remark).then(() => {
      const tmp = dataSource.map(t => {
        if (t.id === id) {
          t.status = status;
          t.remark = remark;
        }
        return t;
      });
      setDataSource(tmp);
      messageApi.info('已保存');
    })
  }

  const columns: ColumnsType<Provider.ProviderSyncIssue> = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 60,
      align: 'center',
      render: (v, r, i) => i + 1,
    },
    {
      title: '类别',
      dataIndex: 'type',
      width: 120,
      ellipsis: true,
      render: (v) => getSyncTypeName(v),
    },
    {
      title: '资源类型',
      width: 100,
      dataIndex: 'providerType',
    },
    {
      title: '资源名称',
      width: '15%',
      dataIndex: 'providerName',
      ellipsis: true,
      render: renderCol('providerName', wrapperProviderName),
    },
    {
      title: '字段分类',
      width: 100,
      dataIndex: 'fieldCategory',
      align: 'center',
      render: renderCol('fieldCategory', wrapperFieldCategory),
    },
    {
      title: '名称',
      width: '15%',
      dataIndex: 'fieldName',
      ellipsis: true,
      render: renderCol('fieldName', wrapperFieldName),
    },
    {
      title: '类型',
      dataIndex: 'fieldType',
      width: 80,
      align: 'center',
      render: renderCol('fieldType'),
    },
    {
      title: 'ForceNew',
      dataIndex: 'forceNew',
      width: 100,
      align: 'center',
      render: renderCol('forceNew'),
    },
    {
      title: 'Computed',
      dataIndex: 'computed',
      width: 100,
      align: 'center',
      render: renderCol('computed'),
    },
    {
      title: 'Required',
      dataIndex: 'requiredFlag',
      width: 100,
      align: 'center',
      render: renderCol('requiredFlag', wrapperRequired),
    },
    {
      title: 'SLA',
      dataIndex: 'daysUsed',
      align: 'center',
      width: 60,
    },
    {
      title: '状态',
      align: 'center',
      width: 80,
      dataIndex: 'status',
      render: v => {
        switch (v) {
          case 'open':
            return <Tag color="gold">待处理</Tag>;
          case 'padding':
            return <Tag color="purple">挂起</Tag>;
          case 'service-missing':
            return <Tag color="orange">服务未上线</Tag>;
          case 'api-missing':
            return <Tag color="orange">API未发布</Tag>;
          case 'monitoring':
            return <Tag color="purple">监控中</Tag>;
          case 'closed':
            return <Tag color="blue">已完成</Tag>;
          case 'manually-closed':
            return <Tag color="blue">手动关闭</Tag>;
          case 'merging':
            return <Tag color="blue">待合并</Tag>
        }
        return v
      }
    },
    {
      title: <>备注<EditOutlined style={{color: '#6d6d6d'}}/></>,
      dataIndex: 'remark',
      width: 200,
      render: (v, row) => {
        return <Remark value={v} onChange={(remark, status) => {
          if (remark === row.remark) {
            return;
          }
          modifyStatusChange(row.id, status === '' ? row.status : status, remark)
        }}/>
      },
    },
    {
      title: '操作',
      dataIndex: 'status',
      align: 'center',
      width: 160,
      render: (v, row) => {
        if (v === 'manually-closed') {
          return <a onClick={() => modifyStatusChange(row.id, 'open', row.remark)}>开启</a>
        }

        return <Space>
          {
            v === 'padding' ?
              <a onClick={() => modifyStatusChange(row.id, 'open', row.remark)}>取消挂起</a>
              :
              <a onClick={() => modifyStatusChange(row.id, 'padding', row.remark)}>挂起</a>
          }

          <MonitorDialog content={'监控'} option={'add'} cloudName={cloudName} field={row}
                         defaultValue={{
                           id: 0,
                           cloudName: cloudName,
                           providerType: row.providerType,
                           providerName: row.providerName,
                           type: 'API',
                           status: 'open',

                           productName: '',
                           method: '',
                           uriShort: '',
                           fieldIn: 'body',
                           fieldName: '',

                           relationType: row.type,
                           relationId: row.id,
                           groupName: '',
                         }}
          />
          <a onClick={() => modifyStatusChange(row.id, 'manually-closed', row.remark)}
             style={{color: 'red'}}> 关闭 </a>
        </Space>
      },
    },
  ];


  return (
    <>
      {contextHolder}
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '100%', maxWidth: '680px'}} onClick={showModal}>
          {content}
        </div>
      </div>
      <Modal title={`字段列表`}
             transitionName={''}
             destroyOnClose
             open={isModalOpen}
             onOk={closeModel}
             onCancel={closeModel}
             width={'95%'}
             footer={[]}>
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
          <Table dataSource={dataSource} columns={columns} size={'small'}
                 rowKey={(record) => record.id + ''}
                 pagination={false}
          />
        </Space>
      </Modal>
    </>
  );
}

export default ProviderSyncIssueStaticDialog;
