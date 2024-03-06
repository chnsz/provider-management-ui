import React, {useState} from "react";
import {Button, Modal, Tabs, Tag} from "antd";
import CodeEditor from "@/components/CodeEditor";

const InstallToolDialog: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);


    const closeModel = () => {
        setIsModalOpen(false);
    };
    return <>
        <Button type="link" size='middle' onClick={() => setIsModalOpen(true)}>安装客户端</Button>
        <Modal
            title={'安装客户端'}
            transitionName={''}
            destroyOnClose
            open={isModalOpen}
            onOk={closeModel}
            onCancel={closeModel}
            width={'60%'}
            footer={[]}>
            <div>
                <h3><b>说明</b></h3>
                <p>pms客户端是一个命令行工具，通过它可以将代码导入到本地工程目录中，只需要一个命令即可将代码、单元测试、文档文件导入到本地工程中。</p>
                <p>安装方式如下：</p>
                <Tabs style={{padding: '0 20px 20px 20px'}}
                      defaultActiveKey="1"
                      items={[
                          {
                              label: `Linux`,
                              key: '1',
                              children: <>
                                  <p>在命令行执行如下命令即可完成安装</p>
                                  <CodeEditor language={'bash'}
                                              readOnly
                                              value={'curl -o- http://pms.huaweicloud.plus/pms/static/install.sh | bash'}
                                              height={30}/>
                              </>,
                          },
                          {
                              label: `Windows`,
                              key: '2',
                              children: <>
                                  <h4><b>方式一：使用命令下载下载、安装</b></h4>
                                  <CodeEditor language={'bash'}
                                              readOnly
                                              value={`# 1. 下载安装脚本
Invoke-WebRequest -Uri http://pms.huaweicloud.plus/pms/static/install.bat -OutFile install.bat -UseBasicParsing

# 如果Invoke-WebRequest执行失败，请试试下面命令
# curl.exe -L -o install.bat http://pms.huaweicloud.plus/pms/static/install.bat

# 2.运行安装脚本
.\\install.bat

# 3.删除安装脚本
del /q install.bat`}
                                              height={170}/>
                                  <p></p>

                                  <h4><b>方式二：手动安装</b></h4>
                                  <p>请先下载安装脚本，然后在本机运行脚本后即可完成安装。
                                      <a href="http://pms.huaweicloud.plus/pms/static/install.bat"
                                         target={'_blank'}
                                         rel="noopener noreferrer">点击下载安装脚本。</a>
                                  </p>
                              </>,
                          }
                      ]}
                />

                <h3><b>验证</b></h3>
                <p>安装完毕后，会自动打印版本号，在最后看到“pms version v0.1.0”后则表示安装成功。</p>
                <p>也可以手动执行<Tag>pms --version</Tag>验证。</p>
            </div>
        </Modal>
    </>
}

export default InstallToolDialog;
