import React, {useEffect, useState} from "react";
import './index.less'
import CustomBreadcrumb from "@/components/Breadcrumb";
import {Button, Space, Row, Col, message, Steps, Tabs, Modal} from "antd";
import FunArrange, {allFunData, funData} from "./step1/fun-arrange";
import FuncOrch from "./step1/func-orch";
import PreviewDoc from "./step4/previewDoc";
import ApiConfig, {ApiDetail, FieldTypeOption, getType} from "./step1/api-config";
import Doc from "./step2/doc";
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import {getGenerateDetail, submitAutoGenerateData} from "@/services/auto-generate/api";
import {history} from 'umi';
import {copyTxt} from "@/components/Txt/Txt";
import BaseInfoForm, {BaseInfo} from "./step1/base-info";

const AutoGenerate: React.FC = () => {
    const [baseInfo, setBaseInfo] = useState<BaseInfo>({
        providerType: null,
        providerName: '',
        productName: '',
        packageName: '',
        globalService: false,
        tagPath: '',
        tagVersion: '',
        createTimeout: '',
        readTimeout: '',
        updateTimeout: '',
        deleteTimeout: '',
    });
    const [apiData, setApiData] = useState<ApiDetail[]>([]);
    const [funcOrchData, setFuncOrchData] = useState<funData[]>([]);
    const [allFunData, setAllFunData] = useState<allFunData[]>([]);
    const [docData, setDocData] = useState<any>();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [previewData, setPreviewData] = useState<any>();
    const [dataId, setDataId] = useState<any>(null); // 区分编辑or新创
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const hashArr = location.hash.split('/');
        if (hashArr.length === 3) {
            getGenerateDetail(hashArr[2]).then((data) => {
                setDataId(data.id);
                const info = {...JSON.parse(data.baseInfo)};
                info.productName = info.productName || info.endpoint;
                setBaseInfo(info);

                setFuncOrchData([...JSON.parse(data.funcFormationData)]);
                setAllFunData([...JSON.parse(data.funcData)]);
                if (data?.docsData) {
                    setDocData({...JSON.parse(data?.docsData)});
                }

                setPreviewData({
                    codeContent: data.codeContent,
                    docsContent: data.docsContent,
                    testCodeContent: data.testCodeContent,
                    exampleContent: data.exampleContent,
                    message: data.message,
                })

                const apiList = JSON.parse(data.apiData)
                apiList.forEach(t => {
                    t.inputFieldList.forEach(t => {
                        t.schemaType = getType(t.schemaType)
                    })
                    t.outputFieldList.forEach(t => {
                        t.schemaType = getType(t.schemaType)
                    })
                })
                setApiData(apiList);
            });
        }
    }, []);

    const review = () => {
        // 校验DOC
        checkSecond();

        const data = {
            id: dataId,
            baseInfo: JSON.stringify(baseInfo),
            apiData: JSON.stringify(apiData),
            funcFormationData: JSON.stringify(funcOrchData),
            funcData: JSON.stringify(allFunData),
            docsData: JSON.stringify(docData),
            templateData: JSON.stringify(handleSubmitData())
        };

        submitAutoGenerateData(data).then((res) => {
            setDataId(res.id);
            setPreviewData({
                codeContent: res.codeContent,
                docsContent: res.docsContent,
                testCodeContent: res.testCodeContent,
                exampleContent: res.exampleContent,
                message: res.message
            });
        });

    }

    const checkFirst = () => {
        if (!baseInfo) {
            message.error('请输入基本信息！');
            return false;
        }

        if (!baseInfo.providerType || !baseInfo.providerName || !baseInfo.productName || !baseInfo.packageName) {
            message.error('请完善基本信息必填项！');
            return false;
        }

        // Tag路径和版本都输入or都不输入
        if (!baseInfo.tagPath && baseInfo.tagVersion || baseInfo.tagPath && !baseInfo.tagVersion) {
            message.error('Tag路径和版本必须都输入，请完善！');
            return false;
        }

        if (!apiData.length) {
            message.error('请选择API！');
            return false;
        }

        if (apiData.some(item => !item.schemaType)) {
            message.error('请完善API操作！');
            return false;
        }

        const createApi = apiData.find(item => item.schemaType === 'argument');
        if (createApi && !createApi.isJmespath && !createApi.resourceId) {
            message.error(`请选择${createApi.apiNameEn} API中的资源ID！`);
            return false;
        }

        if (createApi && createApi.isJmespath && !createApi.jmespath) {
            message.error(`请输入${createApi.apiNameEn} API中的资源ID！`);
            return false;
        }

        if (apiData.some(item => !item.statusCode)) {
            message.error('请完善API配置信息的成功状态码！');
            return false;
        }

        // read中勾选支持分页必填参数校验
        let pageFlag = true;
        const readApiDatas = apiData.filter(item => item.schemaType === 'attribute' && item.isPage);
        for (let i = 0; i < readApiDatas.length && pageFlag; i++) {
            if (!readApiDatas[i].dataPath) {
                message.error('请完善ReadContext API中的分页信息必填项！');
                pageFlag = false;
                break;
            }
            if (readApiDatas[i].pageMethod === 'marker' && (!readApiDatas[i].markerKey || !readApiDatas[i].nextExp)) {
                message.error('请完善ReadContext API中的分页信息必填项！');
                pageFlag = false;
                break;
            }

            if (readApiDatas[i].pageMethod === 'link' && !readApiDatas[i].linkExp) {
                message.error('请完善ReadContext API中的分页信息必填项！');
                pageFlag = false;
                break;
            }

            if (readApiDatas[i].pageMethod === 'offset' && (!readApiDatas[i].offsetKey || !readApiDatas[i].limitKey)) {
                message.error('请完善ReadContext API中的分页信息必填项！');
                pageFlag = false;
                break;
            }

            if (readApiDatas[i].pageMethod === 'pageSize' && (!readApiDatas[i].pageNumKey || !readApiDatas[i].pageSizeKey)) {
                message.error('请完善ReadContext API中的分页信息必填项！');
                pageFlag = false;
                break;
            }
        }

        if (!pageFlag) {
            return false;
        }

        // 描述不能为空
        let descriptionFlag = true;
        for (let i = 0; i < apiData.length && descriptionFlag; i++) {
            const inputFieldList = apiData[i].inputFieldList;
            const findInputData = inputFieldList.some(item => !item.schemaDesc);
            if (findInputData) {
                message.error('Schema 字段中描述不能为空，请完善！');
                descriptionFlag = false;
                break;
            }

            if (['argument', 'attribute'].includes(apiData[i].schemaType)) {
                const findOutputData = apiData[i].outputFieldList?.some(item => !item.schemaDesc);
                if (findOutputData) {
                    message.error('Schema 字段中描述不能为空，请完善！');
                    descriptionFlag = false;
                    break;
                }
            }
        }

        if (!descriptionFlag) {
            return false;
        }


        // ReadContext、DeleteContext、UpdateContext: 请求参数的名称设置规则：当资源类型为 Resource 时，必须是 CreateContext 中的请求参数（入参）中设置的名称，再加上一个id（放在第一位）；
        let flag = true;
        if (baseInfo.providerType === 'Resource') {
            for (let i = 0; i < apiData.length && flag; i++) {
                if (apiData[i].schemaType !== 'argument') {
                    const inputFieldList = apiData[i].inputFieldList;
                    for (let j = 0; j < inputFieldList.length; j++) {
                        if (!inputFieldList[j].selectSchemaName && !inputFieldList[j].ignore) {
                            message.error('Schema 字段名称在未勾选忽略的情况下不能为空，请检查Schema 字段！');
                            flag = false;
                            break;
                        }
                        if (!inputFieldList[j].schemaTypeOption?.some((item: any) => item.value === inputFieldList[j].selectSchemaName) && !inputFieldList[j].ignore) {
                            message.error('当资源类型为 Resource 时，ReadContext、UpdateContext、DeleteContext 的请求参数名称必须是CreateContext 中的请求参数中设置的名称，请检查！');
                            flag = false;
                            break;
                        }
                    }
                }
            }

            return flag;

        }

        return true;
    }

    const checkSecond = () => {
        // Category、Overview、Example是必填项
        if (!docData) {
            message.error('请填写文档描述！');
            return false;
        }

        if (!docData.category || !docData.overview || !docData.examples?.length) {
            message.error('请完善文档描述必填项！');
            return false;
        }

        return true;
    }

    const handleSubmitData = () => {
        const json: any = {
            type: baseInfo.providerType ?? null,
            name: baseInfo.providerName ?? null,
            serviceName: baseInfo.productName ?? null,
            package: baseInfo.packageName ?? null,
            globalService: baseInfo.globalService ?? null,
            tagsServicePath: baseInfo.tagPath ?? null,
            tagsServiceVersion: baseInfo.tagVersion ?? null,
            apis: apiData.map(item => `${item.id}_${item.apiNameEn}`),
            timeouts: {
                create: baseInfo.createTimeout ?? null,
                read: baseInfo.readTimeout ?? null,
                update: baseInfo.updateTimeout ?? null,
                delete: baseInfo.deleteTimeout ?? null,
            },
            schema: [],
            create: [],
            read: [],
            update: [],
            delete: [],
            customDocs: docData
        };
        json.schema = setSchemaData();
        if (json.tagsServicePath) {
            // json.schema.push({
            //     schemaType: "tags",
            // });
        }

        setContextData(json, 'create');
        setContextData(json, 'read');
        setContextData(json, 'update');
        setContextData(json, 'delete');
        return json;
    }

    const setSchemaData = () => {
        const schema: Array<any> = [];
        apiData.forEach(api => {
            const obj = {
                schemaType: api.schemaType,
                uri: api.uri,
                method: api.method,
                serviceName: api.productName,
                serviceAlias: api.serviceAlias,
                requestIgnore: api.inputFieldList.filter(field => field.ignore).map(field => field.fieldName),
                responseIgnore: api.outputFieldList?.filter(field => field.ignore).map(field => field.fieldName),
                schemas: {},
                filters: {},
            };

            if (api.schemaType === 'argument') {
                obj.schemas = api.inputFieldList.filter(field => !field.ignore).reduce((result, item) => {
                    result[item.fieldName] = {
                        name: item.schemaName,
                        type: item.schemaType,
                        subType: item.schemaSubType,
                        required: item.schemaRequired,
                        optional: !item.schemaRequired,
                        description: item.schemaDesc,
                        default: item.default,
                        sensitive: item.sensitive,
                        computed: item.computed,
                        pos: item.index,
                        dateFormat: item.dateFormat ?? null,
                        keepZero: item.keepZero,
                        getterCode: item.getterCode,
                        setterCode: item.setterCode,
                    };

                    return result;
                }, {});

                obj.schemas['id'] = {
                    relation: api.resourceId,
                };

            }
            obj['pluginId'] = !api.isJmespath ? api.resourceId : null;
            obj['jmespath'] = api.isJmespath ? api.jmespath : null;

            if (api.schemaType === 'attribute') {
                const inputObj = api.inputFieldList.filter(field => !field.ignore).reduce((result, item) => {
                    result[item.fieldName] = {
                        relation: item.schemaName,
                        type: item.schemaType,
                        subType: item.schemaSubType,
                        required: item.schemaRequired,
                        optional: !item.schemaRequired,
                        description: item.schemaDesc,
                        default: item.default,
                        sensitive: item.sensitive,
                        computed: item.computed,
                        pos: item.index,
                        dateFormat: item.dateFormat ?? null,
                        keepZero: item.keepZero,
                        getterCode: item.getterCode,
                        setterCode: item.setterCode,
                    };
                    return result;
                }, {});

                const outputObj = api.outputFieldList?.filter(field => !field.ignore).reduce((result, item) => {
                    result[item.fieldName] = {
                        name: item.schemaName,
                        type: item.schemaType,
                        subType: item.schemaSubType,
                        required: item.schemaRequired,
                        description: item.schemaDesc,
                        default: item.default,
                        sensitive: item.sensitive,
                        computed: item.computed,
                        pos: item.index,
                        dateFormat: item.dateFormat ?? null,
                        keepZero: item.keepZero,
                        getterCode: item.getterCode,
                        setterCode: item.setterCode,
                    };

                    return result;
                }, {});

                const mergedObj = {};
                // read中涉及出入参，相同key的需要合并
                for (const key in inputObj) {
                    if (outputObj.hasOwnProperty(key)) {
                        mergedObj[key] = {
                            ...outputObj[key],
                            ...inputObj[key]
                        }
                    } else {
                        mergedObj[key] = inputObj[key];
                    }
                }

                for (const key in outputObj) {
                    if (!inputObj.hasOwnProperty(key)) {
                        mergedObj[key] = outputObj[key]
                    }
                }

                obj.schemas = mergedObj;

                // read中涉及分页
                if (api.isPage) {

                    obj['pager'] = {
                        method: api.pageMethod ?? null,
                        dataPath: api.dataPath ?? null,
                        markerKey: api.markerKey ?? null,
                        nextExp: api.nextExp ?? null,
                        linkExp: api.linkExp ?? null,
                        offsetKey: api.offsetKey ?? null,
                        limitKey: api.limitKey ?? null,
                        defaultLimit: api.defaultLimit ?? null,
                        pageNumKey: api.pageNumKey ?? null,
                        pageSizeKey: api.pageSizeKey ?? null,
                        defaultSize: api.defaultSize ?? null,
                    }
                }
            }

            if (['update', 'delete'].includes(api.schemaType)) {
                obj.schemas = api.inputFieldList.filter(field => !field.ignore).reduce((result, item) => {
                    result[item.fieldName] = {
                        relation: item.schemaName,
                        type: item.schemaType,
                        subType: item.schemaSubType,
                        pos: item.index,
                        dateFormat: item.dateFormat ?? null,
                        keepZero: item.keepZero,
                        getterCode: item.getterCode,
                        setterCode: item.setterCode,
                    };

                    return result;
                }, {});
            }

            // 自定义Schema
            if (api.dataNode && api.customSchemaData.length > 0) {
                obj.filters[api.dataNode] = api.customSchemaData;
            }

            schema.push(obj);
        });

        // tag版本号跟随在schema中传入
        if (baseInfo.tagPath && baseInfo.tagVersion) {
            schema.push({
                schemaType: "tags",
                version: baseInfo.tagVersion
            });
        }
        return schema;
    }


    const setContextData = (json: any, action: string) => {
        const context = allFunData.find(item => item.id === `${action}Context`)?.contextValue;
        if (context?.length) {
            context.forEach(item => {
                if (item.funType !== 'fun') {
                    json[action].push({
                        functionName: item.funName,
                        functionType: item.funType,
                        code: item.funCode || null,
                    });
                }
            })
        }
    }

    const onBaseChange = (data: BaseInfo) => {
        setBaseInfo({...data});
    }

    const onApiChange = (data: ApiDetail[]) => {
        setApiData([...data]);
    }

    const onFuncOrchChange = (data: funData[]) => {
        setFuncOrchData([...data]);
    }

    const onAllFunDataChange = (data: allFunData[]) => {
        setAllFunData([...data]);
    }

    const onDocChange = (data: any) => {
        setDocData({...data});
    }

    const closeModel = () => {
        setIsModalOpen(false);
    };

    return <>
        <CustomBreadcrumb items={[{title: '首页'}, {title: '自动生成'}]}/>
        <Modal
            className={'preview-dialog'}
            transitionName={''}
            destroyOnClose
            open={isModalOpen}
            onOk={closeModel}
            onCancel={closeModel}
            width={'90%'}
            footer={[]}>
            <div style={{height: '80vh'}}>
                <PreviewDoc previewDataPar={previewData} defaultActiveKey={'tab' + (currentStep + 1)}/>
            </div>
        </Modal>
        <div style={{margin: '-5px 30% 20px 30%'}}>
            <Steps size={'small'}
                   current={currentStep}
                   items={[
                       {title: '编排API'},
                       {title: '文档'},
                       {title: '预览'},
                       {title: '完成'},
                   ]}
                   onChange={num => {
                       setCurrentStep(num === 3 ? 2 : num);
                       if (num == 2) {
                           review();
                       }
                   }}
            />
        </div>
        <div style={{height: 'calc(100vh - 280px)'}}>
            <Scrollbars>
                {
                    currentStep === 0 &&
                    <Space direction={"vertical"} size={20} style={{width: '100%'}}>
                        <div className={'portal-card'}>
                            <div className={'header'}>基本信息</div>
                            <BaseInfoForm onChange={onBaseChange} defaultValue={baseInfo}/>
                        </div>

                        <div className={'portal-card'}>
                            <div className={'header'}>API 配置</div>
                            <div className={'container'}>
                                <ApiConfig setData={onApiChange}
                                           baseInfo={baseInfo}
                                           dataId={dataId}
                                           apiDataPar={apiData}
                                           funData={allFunData}
                                           setFunData={onAllFunDataChange}/>
                            </div>
                        </div>

                        <Row>
                            <Col flex="calc(50% - 20px)">
                                <div className={'portal-card'}>
                                    <div className={'header'}>函数编排</div>
                                    <div className={'container'}>
                                        <FunArrange
                                            setData={onAllFunDataChange}
                                            apiData={apiData}
                                            funcOrchData={funcOrchData}
                                            handleFunOrchData={onFuncOrchChange}
                                            allFunDataPar={allFunData}/>
                                    </div>
                                </div>
                            </Col>
                            <Col flex="20px"></Col>
                            <Col flex="calc(50% - 20px)">
                                <div className={'portal-card'}>
                                    <div className={'header'}>自定义函数</div>
                                    <div className={'container'}>
                                        <FuncOrch setData={onFuncOrchChange} funcOrchDataPar={funcOrchData}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Space>
                }
                {
                    currentStep === 1 &&
                    <Doc setData={onDocChange} docDataPar={docData}/>
                }
                {
                    currentStep === 2 &&
                    <PreviewDoc previewDataPar={previewData}/>
                }
            </Scrollbars>
        </div>
        <Space direction={'horizontal'} size={20}
               style={{
                   width: '100%',
                   marginTop: '20px',
                   justifyContent: 'center',
                   alignItems: 'center',
                   marginBottom: '-20px'
               }}>
            {
                currentStep > 0 &&
                <Button onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>
            }
            {
                currentStep < 2 &&
                <Button onClick={() => {
                    review();
                    setIsModalOpen(true);
                }}>预览</Button>
            }
            {
                currentStep <= 1 &&
                <Button type={'primary'} onClick={() => {
                    setCurrentStep(currentStep + 1);
                    if (currentStep == 1) {
                        review();
                    }
                }}>下一步</Button>
            }
            {
                currentStep === 2 &&
                <Button type={'primary'} onClick={() => history.push('/auto-generate-provider-list')}>保存</Button>
            }
            <Button type={'link'} onClick={() => {
                if (baseInfo.providerType == "DataSource") {
                    copyTxt(`pms import -d ${baseInfo.providerName} --skip-test`)
                } else {
                    copyTxt(`pms import -r ${baseInfo.providerName} --skip-test`)
                }
            }}>复制脚本</Button>
        </Space>
    </>
}

export default AutoGenerate;
