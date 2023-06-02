import React, {useState} from 'react';
import {InfoCircleOutlined, SafetyCertificateOutlined} from "@ant-design/icons";
import {Button, Divider, Modal, Tag} from "antd";

const Introduction: React.FC = () => {
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
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   width={700}
                   footer={[
                       <Button key="close" type="primary" onClick={handleOk}>关闭</Button>
                   ]}>
                <h4>一、UT 覆盖率</h4>
                <p>通过运行单元测试统计的 UT 覆盖率，覆盖率大于 80% 则为达标。</p>
                <p>一些资源因分支较多无法达到，如果主要内容已经全覆盖，可以通过打开开关标记为达标。</p>

                <h4>二、质量守护</h4>
                <p>指对自己负责的资源所做的加固质量的工作，按照合并的 PR 的个数作为分值，PR 的标签中需包含：
                    <Tag>bugfix</Tag>、<Tag>refactor</Tag>、<Tag>chore</Tag>、<Tag>documentation</Tag>一个或者多个。
                </p>
                <p>如果一个 PR 中包含了多个资源，则每个资源均加一分。</p>

                <h4>三、UT分值</h4>
                <p>单元测试（UT）分值是运行单元测试的得分，衡量单元测试健康度。成功运行不加分，运行失败则扣减一分，以负数展示。</p>

                <h4>四、Bug</h4>
                <p>Bug 为扣分项，一次问题单扣一分，以负数展示。</p>

                <h4>五、总分</h4>
                <p>总分 = 质量守护 + UT分值 + Bug。</p>
                <Divider dashed/>

                <h4>六、送检完成</h4>
                <p>已完送检后并整改完全部问题，请点亮资源名称前面的小盾牌 -&gt; <SafetyCertificateOutlined
                    style={{
                        color: '#389e0d',
                        fontSize: '18px',
                        marginRight: '5px',
                        cursor: 'point',
                    }}
                />。</p>
                <p>通过点击标题前面 <SafetyCertificateOutlined
                    style={{
                        color: 'rgb(223 223 223)',
                        fontSize: '18px',
                        marginRight: '5px',
                        cursor: 'point',
                    }}
                />图标完成，反之取消点亮。
                </p>
            </Modal>
        </>
    );
};

export default Introduction;
