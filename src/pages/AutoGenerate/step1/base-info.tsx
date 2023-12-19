import React, { useState } from "react";
import '../index.less'
import { Space, Select, Input } from "antd";

const resourceOption = [
    { value: 'Resource', label: 'Resource' },
    { value: 'DataSource', label: 'DataSource' },
];

const BaseInfo: React.FC<{ setData: (data: any) => any, baseInfoPar: any }> = ({ setData, baseInfoPar }) => {
    let [providerType, setProviderType] = useState<string>();
    let [providerName, setProviderName] = useState<string>();
    let [endpoint, setEndpoint] = useState<string>();
    let [packageName, setPackageName] = useState<string>();
    let [tagPath, setTagPath] = useState<string>();
    let [tagVersion, setTagVersion] = useState<string>();
    let [createTimeout, setCreateTimeout] = useState<string>();
    let [readTimeout, setReadTimeout] = useState<string>();
    let [updateTimeout, setUpdateTimeout] = useState<string>();
    let [deleteTimeout, setDeleteTimeout] = useState<string>();

    if (baseInfoPar) {
        providerType = baseInfoPar?.providerType;
        providerName = baseInfoPar?.providerName;
        endpoint = baseInfoPar?.endpoint;
        packageName = baseInfoPar?.packageName;
        tagPath = baseInfoPar?.tagPath;
        tagVersion = baseInfoPar?.tagVersion;
        createTimeout = baseInfoPar?.createTimeout;
        readTimeout = baseInfoPar?.readTimeout;
        updateTimeout = baseInfoPar?.updateTimeout;
        deleteTimeout = baseInfoPar?.deleteTimeout;
    }
    

    return <>
        <div className={'container base-info-box'}>
            <div style={{ display: 'flex' }}>
                <div className={'info-item'}>
                    <span>
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                        资源信息
                    </span>
                    <Space.Compact style={{ width: '100%' }}>
                        <Select value={providerType}
                            onChange={(e) => {
                                setProviderType(e);
                                setData({
                                    providerType: e,
                                    providerName,
                                    endpoint,
                                    packageName,
                                    tagPath,
                                    tagVersion,
                                    createTimeout,
                                    readTimeout,
                                    updateTimeout,
                                    deleteTimeout
                                });
                            }}
                            placeholder="请选择"
                            style={{ width: '145px' }}
                            options={resourceOption} />
                        <Input value={providerName}
                            onChange={(e) => {
                                setProviderName(e.target.value);
                                setData({
                                    providerType,
                                    providerName: e.target.value,
                                    endpoint,
                                    packageName,
                                    tagPath,
                                    tagVersion,
                                    createTimeout,
                                    readTimeout,
                                    updateTimeout,
                                    deleteTimeout
                                });
                            }}
                            placeholder="请输入资源名称" style={{ width: '145px' }} />
                    </Space.Compact>
                </div>
                <div className={'info-item'}>
                    <span>
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                        服务Endpoint
                    </span>
                    <div>
                        <Input value={endpoint}
                            onChange={(e) => {
                                setEndpoint(e.target.value);
                                setData({
                                    providerType,
                                    providerName,
                                    endpoint: e.target.value,
                                    packageName,
                                    tagPath,
                                    tagVersion,
                                    createTimeout,
                                    readTimeout,
                                    updateTimeout,
                                    deleteTimeout
                                });
                            }}
                            style={{ width: '290px' }} placeholder='请输入' />
                    </div>
                </div>
                <div className={'info-item'}>
                    <span>
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                        package
                    </span>
                    <div>
                        <Input value={packageName}
                            onChange={(e) => {
                                setPackageName(e.target.value);
                                setData({
                                    providerType,
                                    providerName,
                                    endpoint,
                                    packageName: e.target.value,
                                    tagPath,
                                    tagVersion,
                                    createTimeout,
                                    readTimeout,
                                    updateTimeout,
                                    deleteTimeout
                                });
                            }}
                            style={{ width: '290px' }} placeholder='请输入' />
                    </div>
                </div>
                <div className={'info-item'}>
                    <span>
                        Tag路径和版本
                    </span>
                    <Space.Compact>
                        <Input value={tagPath}
                            onChange={(e) => {
                                setTagPath(e.target.value);
                                setData({
                                    providerType,
                                    providerName,
                                    endpoint,
                                    packageName,
                                    tagPath: e.target.value,
                                    tagVersion,
                                    createTimeout,
                                    readTimeout,
                                    updateTimeout,
                                    deleteTimeout
                                });
                            }}
                            style={{ width: '145px' }} placeholder='请输入路径' />
                        <Input value={tagVersion}
                            onChange={(e) => {
                                setTagVersion(e.target.value);
                                setData({
                                    providerType,
                                    providerName,
                                    endpoint,
                                    packageName,
                                    tagPath,
                                    tagVersion: e.target.value,
                                    createTimeout,
                                    readTimeout,
                                    updateTimeout,
                                    deleteTimeout
                                });
                            }}
                            style={{ width: '145px' }} placeholder='请输入版本' />
                    </Space.Compact>
                </div>
            </div>

            <div style={{ display: 'flex' }} className={'mt20'}>
                <div className={'info-item'}>
                    <span>
                        CreateTimeout
                    </span>
                    <div>
                        <Input value={createTimeout}
                            onChange={(e) => {
                                setCreateTimeout(e.target.value);
                                setData({
                                    providerType,
                                    providerName,
                                    endpoint,
                                    packageName,
                                    tagPath,
                                    tagVersion,
                                    createTimeout: e.target.value,
                                    readTimeout,
                                    updateTimeout,
                                    deleteTimeout
                                });
                            }}
                            placeholder="请输入" style={{ width: '290px' }} />
                    </div>
                </div>
                <div className={'info-item'}>
                    <span>
                        ReadTimeout
                    </span>
                    <div>
                        <Input value={readTimeout}
                            onChange={(e) => {
                                setReadTimeout(e.target.value);
                                setData({
                                    providerType,
                                    providerName,
                                    endpoint,
                                    packageName,
                                    tagPath,
                                    tagVersion,
                                    createTimeout,
                                    readTimeout: e.target.value,
                                    updateTimeout,
                                    deleteTimeout
                                });
                            }}
                            style={{ width: '290px' }} placeholder='请输入' />
                    </div>
                </div>
                <div className={'info-item'}>
                    <span>
                        UpdateTimeout
                    </span>
                    <div>
                        <Input value={updateTimeout}
                            onChange={(e) => {
                                setUpdateTimeout(e.target.value);
                                setData({
                                    providerType,
                                    providerName,
                                    endpoint,
                                    packageName,
                                    tagPath,
                                    tagVersion,
                                    createTimeout,
                                    readTimeout,
                                    updateTimeout: e.target.value,
                                    deleteTimeout
                                });
                            }}
                            style={{ width: '290px' }} placeholder='请输入' />
                    </div>
                </div>
                <div className={'info-item'}>
                    <span>
                        DeleteTimeOut
                    </span>
                    <div>
                        <Input value={deleteTimeout}
                            onChange={(e) => {
                                setDeleteTimeout(e.target.value);
                                setData({
                                    providerType,
                                    providerName,
                                    endpoint,
                                    packageName,
                                    tagPath,
                                    tagVersion,
                                    createTimeout,
                                    readTimeout,
                                    updateTimeout,
                                    deleteTimeout: e.target.value
                                });
                            }}
                            style={{ width: '290px' }} placeholder='请输入' />
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default BaseInfo;