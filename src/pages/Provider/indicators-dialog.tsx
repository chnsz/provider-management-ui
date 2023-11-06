import React, {useState} from 'react';
import {InfoCircleOutlined, SafetyCertificateOutlined} from "@ant-design/icons";
import {Button, Divider, Modal, Tag} from "antd";

const IndicatorsIntroDialog: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div>
                <span onClick={showModal} style={{color: 'rgba(0, 0, 0, 0.45)', cursor: 'pointer'}}>
                    <InfoCircleOutlined/> 指标说明
                </span>
            </div>
            <Modal title="指标说明"
                   transitionName={''}
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   width={1500}
                   footer={[
                       <Button key="close" type="primary" onClick={handleOk}>关闭</Button>
                   ]}>
                <h4>一、服务基线</h4>
                <p>
                    指将一个服务下 “未分析” 状态的 API 全部分析完毕，则表示完成服务基线（后续会补充其他条件）。
                    服务基线率：已基线服务数 / 负责的服务总数。
                </p>
                <h4>二、资源基线</h4>
                <p>
                    指将所负责服务下的资源全部完成基线，目前只统计 <Tag>Resource</Tag>，<Tag>DataSource</Tag> 不计算在内。
                    资源基线：已基线资源数 / 负责的资源总数。
                </p>
                <h4>三、API 分析率</h4>
                <p>
                    该指标衡量所负责服务下的 API 的分析比例，计算公式：（负责的 API 总数 - 未分析状态的个数）/
                    负责的API总数 x 100 %。负责的 API 总数，是值所负责服务下的 API 的数量。
                </p>
                <h4>四、持续优化 PR（原：质量加固 PR 数）</h4>
                <p>
                    <p>指对自己负责的资源所做的加固质量的工作，按照合并的 PR 的个数作为分值，PR 的标签中需包含：
                        <Tag>bugfix</Tag>、<Tag>refactor</Tag>、<Tag>chore</Tag>、<Tag>documentation</Tag>、<Tag>feature</Tag>、<Tag>test</Tag>一个或者多个。
                    </p>
                    <p>
                        如果一个 PR 中包含了多个资源，则每个资源均加一分。
                    </p>
                    <p>
                        首次提交的资源不统计在内，其他类型：<Tag>modified</Tag>、<Tag>removed</Tag>、<Tag>renamed</Tag>的文件会在分析后加分。
                    </p>

                </p>
                <h4>五、单元测试质量</h4>
                <p>
                    指将所负责服务下的资源执行单元测试中失败的次数，统计维度是单元测试函数不是资源维度；也不会区分 <Tag>Resource</Tag>、<Tag>DataSource</Tag>。
                </p>
                <h4>六、UT 覆盖率（%）</h4>
                <p>
                    统计资源类型为<Tag>Resource</Tag>，且覆盖率大于<span
                    style={{color: '#ff4d4f', fontWeight: 'bold'}}>大于 20%</span> 的资源，按照责任人统计每个资源的平均、最大、最小单元测试覆盖率。
                </p>
                <p>
                    注：如果资源的单元测试覆盖率<span style={{color: '#ff4d4f', fontWeight: 'bold'}}>小于 20%</span>，则视为没有运行单元测试，该资源不参与统计。
                </p>
                <h4>七、Bug 数</h4>
                <p>
                    OnCall 记录的问题数量。
                </p>
                <h4>八、变更未及时处理（暂未统计）</h4>
                <p>
                    指当已经基线的资源对应的 API 发生可能有影响的变更时，负责人未能在
                    <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>30天</span> 内完成处理，则记为一次。
                </p>
                <h4>八、量化分</h4>
                <p>
                    <b>总分</b> = <Tag>已基线的资源数</Tag> + <Tag>持续优化 PR 数</Tag> + <Tag>规划的资源</Tag> - <Tag>Bug
                    数</Tag> - <Tag>API
                    变更未及时处理</Tag> - <Tag>UT 失败次数</Tag>
                </p>
                <p>
                    上不封顶下不设限。
                </p>
            </Modal>
        </>
    );
};

export default IndicatorsIntroDialog;
