import LRLayout, {Container, Header, LeftSide} from '@/components/Layout';
import SideList from '@/pages/Task/components/side-list';
import TaskDetail from '@/pages/Task/components/task-detail';
import {createTask, createTaskKbTask, deleteTask, getTask, getTaskList, updateTask,} from '@/services/task/api';
import {useLocation} from '@@/exports';
import {ExclamationCircleFilled, SendOutlined} from '@ant-design/icons';
import {Breadcrumb, Button, Modal, notification, Space} from 'antd';
import React, {useEffect, useState} from 'react';
import './task.less';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import SearchForm, {SearchFormProps} from "@/components/SearchForm";

const {confirm} = Modal;
const defaultTaskTitle = '新建的待办任务';

const defaultTask = {
    id: 0,
    created: '',
    creator: '',
    priority: 0,
    productName: '',
    status: '',
    title: '',
    updated: '',
};

let page = 1;
let productNameArr: string[] = [];
let ownerArr: string[] = [];
let taskStatus: string[] = [];

const Task: React.FC = () => {
    const [taskList, setTaskList] = useState<Task.Task[]>([]);
    const [task, setTask] = useState<Task.Task>(defaultTask);
    const [notificationApi, contextHolder] = notification.useNotification();

    const location = useLocation();

    const loadData = (pageNum: number, isAppend: boolean, notice: boolean) => {
        const queryParams = {
            productName: productNameArr,
            owner: ownerArr,
            status: taskStatus,
        };

        getTaskList(queryParams, 50, pageNum).then((data) => {
            if (notice && data.items.length === 0) {
                page--;
                notificationApi['info']({
                    message: '提示',
                    description: '没有更多数据',
                });
                return;
            }

            if (isAppend) {
                setTaskList([...taskList, ...data.items]);
            } else {
                setTaskList(data.items);
            }
        });
    };

    const onSearch = (query: SearchFormProps) => {
        productNameArr = query.productName;
        ownerArr = query.owner;
        taskStatus = query.status;
        loadData(1, false, false);
    };

    const loadMore = () => {
        loadData(++page, true, true);
    };

    const onSelect = (task: Task.Task) => {
        getTask(task.id).then((task) => {
            setTask(task);
        });
    };

    const onDetailChange = (opts: Task.UpdateOpts) => {
        if (!opts.id) {
            notificationApi['info']({
                message: '警告',
                description: '数据ID为空，无法保存',
            });
            return;
        }

        updateTask(opts.id, opts).then((rsp) => {
            if (!rsp.id) {
                notificationApi['error']({
                    message: '错误',
                    description: '保存失败，服务没有返回保存后的数据',
                });
            }
            setTask(rsp);
            const arr = taskList.map((t) => {
                if (t.id === rsp.id) {
                    return rsp;
                }
                return t;
            });
            setTaskList(arr);
        });
    };

    useEffect(() => {
        const hashArr = location.hash.split('/');
        if (hashArr.length === 3) {
            getTask(hashArr[2]).then((data: Task.Task) => {
                console.log('got task', data);
                setTask(data);
                // setSelectedPlanning(data);
            });
        }
    }, []);

    const onDeleteTask = () => {
        if (task.id === 0) {
            notificationApi['warning']({
                message: '操作失败',
                description: '您还没有选择资源规划，请先选择一条资源规划',
            });
            return;
        }

        confirm({
            title: '删除任务',
            icon: <ExclamationCircleFilled/>,
            maskTransitionName: '',
            width: 600,
            okText: '删除',
            cancelText: '取消',
            content: (
                <>
                    <div>确定要删除该待办任务吗？关联的卡片会被同步删除。</div>
                    <div>删除后可联系管理员恢复，请谨慎操作。</div>
                    <p>
                        <a>
                            #{task.id} {task.title}
                        </a>
                    </p>
                </>
            ),
            onOk() {
                deleteTask(task.id).then((rsp) => {
                    if (rsp.affectedRow === 0) {
                        return;
                    }
                    const arr = taskList.filter((t) => t.id !== task.id);
                    setTaskList(arr);
                    setTask(defaultTask);
                });
            },
        });
    };

    const createKanboardTask = () => {
        if (task.id === 0) {
            notificationApi['warning']({
                message: '操作失败',
                description: '您还没有选择待办任务',
            });
            return;
        }

        createTaskKbTask(task.id).then((t) => {
            if (!t.kanboardTask) {
                return;
            }
            notificationApi['info']({
                message: '成功',
                description: '卡片推送成功',
            });
            setTask(t);
        });
    };

    const createNew = () => {
        createTask({
            title: defaultTaskTitle,
            status: 'new',
            priority: 1,
        }).then(t => {
            if (t.id <= 0) {
                notificationApi['warning']({
                    message: '操作失败',
                    description: '未能获取新创建的任务',
                });
                return;
            }
            setTask(t);
            setTaskList([t, ...taskList])
        });
    }

    const getTaskTitle = () => {
        let taskTitle = <>任务详情</>;
        if (task.id) {
            taskTitle = <>任务详情：<span className="task-title">#{task.id} {task.title}</span></>
        }
        return taskTitle;
    }

    return (
        <LRLayout className={'task'}>
            <Breadcrumb items={[{title: '首页'}, {title: '待办任务'}]}/>
            <Header>
                {contextHolder}
                <div style={{background: '#fff', padding: '20px 20px'}}>
                    <SearchForm onSearch={onSearch}/>
                </div>
            </Header>
            <LeftSide width={window.innerWidth * 0.3} minWidth={500} style={{height: '100%'}}>
                <div className={'custom-title'}>
                    <div className={'title'}>待办任务</div>
                    <div className={'toolbar'}>
                        <Button type={'primary'} size={'small'} onClick={createNew}>
                            新建任务
                        </Button>
                    </div>
                </div>
                <div style={{height: 'calc(100% - 80px)'}}>
                    <Scrollbars>
                        <SideList data={taskList} selectedValue={task} onSelect={onSelect}/>
                        <div className={'load-more'}>
                            <a onClick={loadMore}>加载更多</a>
                        </div>
                    </Scrollbars>
                </div>
            </LeftSide>
            <Container>
                <div className={'custom-title'}>
                    {getTaskTitle()}
                </div>
                <div style={{padding: '20px'}}>
                    <Space size={'middle'} direction={'vertical'}>
                        <Space size={'middle'}>
                            <Button
                                type="primary"
                                size={'small'}
                                icon={<SendOutlined/>}
                                onClick={createKanboardTask}
                                disabled={task.id === 0}
                            >
                                推送卡片
                            </Button>

                            <Button
                                size={'small'}
                                danger
                                disabled={task.id === 0}
                                onClick={onDeleteTask}
                            >
                                删除任务
                            </Button>
                        </Space>
                        <TaskDetail task={task} onChange={onDetailChange}/>
                    </Space>
                </div>
            </Container>
        </LRLayout>
    );
};

export default Task;
