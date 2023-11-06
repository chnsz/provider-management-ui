import React, {useState} from "react";
import {Badge, message, Modal, Space, Table, Tabs, TabsProps} from "antd";
import {ColumnsType} from "antd/es/table";
import {getSyncIssueProviderSum, startPartnerTest} from "@/services/provider/api";
import {CloudName} from "@/global";
import {getSyncTypeName} from "@/pages/Partner/components/provider_sync_issue_dialog";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DesktopOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import {useModel} from 'umi';
import Txt from "@/components/Txt/Txt";


const getRecord = (cloudName: string, row: Provider.ProviderIssueSum) => {
  let record: Product.TestJobRecord = {
    id: 0,
    productName: '',
    name: '',
    jobId: 0,
    timeCost: '',
    status: '',
    startTime: '',
    endTime: '',
    output: '',
    coverageFile: '',
    logFile: '',
  };

  switch (cloudName) {
    case CloudName.FlexibleEngineCloud:
      record = row.feTestJobRecord || record;
      break;
    case CloudName.G42Cloud:
      record = row.g42TestJobRecord || record;
      break;
  }
  return record;
}

let intervalId = 0;
let queryCount = 0;
const ProviderSyncSumDialog: React.FC<{
  context: any,
  cloudName: Global.CloudName,
  syncType: string | string[],
  status: string[],
  remark?: string,
  subTitle?: string,
  onClosed?: () => any,
}> = ({context, cloudName, syncType, status, remark, subTitle, onClosed}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const {initialState} = useModel('@@initialState');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceData, setResourceData] = useState<Provider.ProviderIssueSum[]>([]);
  const [dataSourceData, setDataSourceData] = useState<Provider.ProviderIssueSum[]>([]);
  const [logContent, setLogContent] = useState<string>('');
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  const loadData = () => {
    getSyncIssueProviderSum(cloudName, syncType, remark || '', status).then(rsp => {
      if (!rsp.items) {
        return;
      }

      const resourceArr: Provider.ProviderIssueSum[] = [];
      const dataSourceArr: Provider.ProviderIssueSum[] = [];
      rsp.items.forEach(t => {
        if (t.providerType === 'Resource') {
          resourceArr.push(t);
        } else if (t.providerType === 'DataSource') {

          dataSourceArr.push(t);
        }
      });
      setResourceData(resourceArr);
      setDataSourceData(dataSourceArr);

    });
  }

  const showModal = () => {
    loadData();
    queryCount = 0;
    intervalId = window.setInterval(() => {
      if (queryCount++ > 50) {
        window.clearInterval(intervalId);
      }
      loadData();
    }, 15000);
    setIsModalOpen(true);
  };

  const closeModel = () => {
    setIsModalOpen(false);
    window.clearInterval(intervalId);
    if (onClosed) {
      onClosed();
    }
  };

  const runUnitTest = (row: Provider.ProviderIssueSum) => {
    const record = getRecord(cloudName, row);
    startPartnerTest(record.jobId, cloudName, row.providerType, row.providerName).then(() => {
      messageApi.info('提交成功');
      loadData();
    });
  }

  const columns: ColumnsType<Provider.ProviderIssueSum> = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 70,
      align: 'center',
      render: (v, r, i) => i + 1,
    },
    {
      title: '类别',
      dataIndex: 'type',
      ellipsis: true,
      width: 160,
      render: (v) => getSyncTypeName(v),
    },
    {
      title: 'Category',
      width: 300,
      ellipsis: true,
      dataIndex: 'category',
    },
    {
      title: '资源类型',
      width: 100,
      dataIndex: 'providerType',
    },
    {
      title: '资源名称1',
      dataIndex: 'providerName',
      ellipsis: true,
      render: (v: any, row: Provider.ProviderIssueSum) => {
        if (v.toString().startsWith('huaweicloud_')) {
          return <Txt value={v}>
            <Badge status={'default'} text={v}/>
          </Txt>
        }

        const status = row.isReference ? 'processing' : 'default';
        return <Txt value={v}>
          <Badge status={status} text={v}/>
        </Txt>
      }
    },
    {
      title: '字段数',
      width: 100,
      align: 'center',
      dataIndex: 'count',
    },];

  if (location.hash === '#/ac' && (initialState?.currentUser?.username === '程相栋' || process.env.NODE_ENV === 'development')) {
    columns.push({
      title: 'UT检查',
      width: 100,
      align: 'center',
      dataIndex: 'count',
      render: (v, row) => {
        const record = getRecord(cloudName, row);
        let icon: any = '';

        switch (record.status) {
          case 'Completed':
            icon = <CheckCircleOutlined style={{color: '#52c41a'}}/>;
            break
          case 'InProgress':
            icon = <SyncOutlined spin style={{color: '#1677ff'}}/>;
            break
          case 'Failed':
            icon = <CloseCircleOutlined style={{color: '#ff4d4f'}}/>;
            break
        }

        return <span style={{fontSize: '16px'}}
                     title={`启动时间：${record.startTime}，用时：${record.timeCost}`}>
                    {icon}
                </span>;
      },
    });
    columns.push({
      title: '操作',
      width: 120,
      align: 'center',
      dataIndex: 'count',
      render: (v, row) => {
        const record = getRecord(cloudName, row);

        let downloadLog = <a href={'/pgs/download/log/' + record.id} rel="noreferrer" title={'下载Log文件'}>
          <FileTextOutlined/>
        </a>;

        let viewConsoleLog = <a
          onClick={() => {
            setLogContent(record.output);
            setIsLogModalOpen(true);
          }}
          title={'查看控制台日志'}
        >
          <DesktopOutlined/>
        </a>;

        if (record.status === '') {
          viewConsoleLog = <div style={{width: '47px'}}>&nbsp;</div>;
          downloadLog = <></>;
        }

        if (record.status === 'InProgress') {
          viewConsoleLog = <div style={{width: '16px'}}>&nbsp;</div>
        }

        return <Space size={15} style={{fontSize: '16px'}}>
          {viewConsoleLog}
          {downloadLog}
          <a onClick={() => runUnitTest(row)} title={'启动UT'}>
            <PlayCircleOutlined/>
          </a>
        </Space>;
      },
    });
  }

  const getCloudName = () => {
    switch (cloudName) {
      case CloudName.HuaweiCloud:
        return '华为云';
      case CloudName.FlexibleEngineCloud:
        return '法电';
      case CloudName.G42Cloud:
        return 'G42';
    }
    return cloudName;
  }

  const items: TabsProps['items'] = [{
    key: '1',
    label: `Resource (${resourceData.length})`,
    children: <Table dataSource={resourceData}
                     columns={columns} size={'small'}
                     rowKey={(record) => record.providerType + '_' + record.providerName}
                     pagination={false}
    />,
  }, {
    key: '2',
    label: `DataSource (${dataSourceData.length})`,
    children: <Table dataSource={dataSourceData}
                     columns={columns} size={'small'}
                     rowKey={(record) => record.providerType + '_' + record.providerName}
                     pagination={false}
    />,
  }];

  let title = '资源列表';
  if (subTitle) {
    title = `资源列表 - ${subTitle}`
  } else if (!Array.isArray(syncType)) {
    title = `资源列表 - ${getSyncTypeName(syncType)}`
  }
  title += `【${getCloudName()}】`;

  return (
    <>
      {contextHolder}
      <div style={{cursor: 'pointer'}} onClick={showModal}> {context}</div>
      <Modal title={title}
             transitionName={''}
             destroyOnClose
             open={isModalOpen}
             onOk={closeModel}
             onCancel={closeModel}
             width={1500}
             footer={[]}>

        <Tabs defaultActiveKey="1" items={items}/>
      </Modal>

      <Modal title={'控制台日志'}
             zIndex={20000}
             destroyOnClose
             transitionName={''}
             open={isLogModalOpen}
             onOk={() => setIsLogModalOpen(false)}
             onCancel={() => setIsLogModalOpen(false)}
             width={'80%'}
             footer={[]}>
        <div style={{
          height: '75vh',
          background: '#2b2b2b',
          color: '#fff',
          fontSize: '16px',
          padding: '12px 24px',
          whiteSpace: 'pre',
          fontFamily: 'Consolas,Courier New,monospace'
        }}>
          <Scrollbars>
            <pre>{logContent}</pre>
          </Scrollbars>
        </div>
      </Modal>
    </>
  );
}

export default ProviderSyncSumDialog;
