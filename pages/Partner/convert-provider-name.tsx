import React, {useEffect, useState} from "react";
import DiffEditor from "@/components/DiffEditor";
import {Button, Drawer, Input, Select, Spin} from "antd";
import {convertProviderName} from "@/services/provider/api";
import CustomBreadcrumb from "@/components/Breadcrumb";

const {Option} = Select;
const {TextArea} = Input;

const ConvertProviderName: React.FC = () => {
    const [modified, setModified] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [showMsg, setShowMsg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cloudName, setCloudName] = useState<string>('FlexibleEngineCloud');
    const [original, setOriginal] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        convertProviderName(cloudName, original).then(r => {
            setLoading(false);
            setModified(r.data.modified);
            setMessage(r.message);
            if (r.message) {
                setShowMsg(true);
            }
        })
    }, [cloudName, original])

    const onChange = (original: string) => {
        setOriginal(original);
    }

    return <>
        <CustomBreadcrumb items={[{title: '首页'}, {title: '常用工具'}, {title: '转换UT代码'}]}/>
        <div style={{marginBottom: '10px'}}>
            目标：
            <Select size={'small'} value={cloudName} style={{width: '100px'}} onChange={v => setCloudName(v)}>
                <Option value="FlexibleEngineCloud">法电</Option>
                <Option value="G42Cloud">G42</Option>
                <Option value="other">天翼云</Option>
            </Select>
            <Button type="link" onClick={() => setShowMsg(true)}> 查看转换失败的资源 </Button>
        </div>
        <Spin spinning={loading}>
            <DiffEditor
                height={'calc(100vh - 220px)'}
                language={'go'}
                modified={modified}
                onChange={onChange}
                originalEditable
                modifiedEditable
            />
        </Spin>
        <Drawer title="无法转换的资源"
                size={'large'}
                placement="left"
                destroyOnClose
                mask={false}
                open={showMsg}
                closeIcon={false}
                extra={<Button type={"primary"} onClick={() => setShowMsg(false)}>关闭</Button>}
        >
            <TextArea rows={30} value={message}/>
        </Drawer>
    </>
}

export default ConvertProviderName
