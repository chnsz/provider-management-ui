// @ts-ignore
/* eslint-disable */
declare namespace Api {
    type ApiList = {
        // API分组名称
        apiGroup: string;
        // API名称
        apiName: string;
        // API英文名称
        apiNameEn: string;
        // 创建时间
        created: string;
        // 定义
        definition: string;
        // 主键
        id: number;
        // 最后同步日期
        lastSyncDate: string;
        // 方法
        method: string;
        // 服务类别
        productGroup: string;
        // 产品名称
        productName: string;
        providerList: Provider[];
        // 发布状态
        publishStatus: 'online' | 'offline' | 'unpublished';
        // 更新时间
        updated: string;
        // URI
        uri: string;
        // 无惨 URI
        uriShort: string;
        // 使用状态
        useRemark: 'used' | 'need_analysis' | 'ignore' | 'missing_api' | 'planning';
    };

    type Provider = {
        // 活动状态
        activeStatus: 'active' | 'deprecated';
        // 类别
        category: string;
        // 云名称
        cloudName: string;
        // 创建日期
        created: string;
        // EPS支持
        epsSupport: string;
        // 主键
        id: integer;
        // 资源名称
        name: string;
        // 包周期支持
        prePaidSupport: string;
        // 所属产品
        productName: string;
        providerApiList: ProviderApi[];
        // 发布状态
        publishStatus: string;
        // 发布日期
        releaseDate: string;
        // 标签支持
        tagSupport: string;
        // 资源类型
        type: string;
        // 更新日期
        updated: string;
    };

    type ApiChange = {
        affectStatus: string;
        apiGroup: string;
        apiId: integer;
        apiName: string;
        apiNameEn: string;
        created: string;
        diffContent: string;
        id: integer;
        lastVersionDate: string;
        method: string;
        productGroup: string;
        productName: string;
        providers: string;
        remark: string;
        updated: string;
        uri: string;
        uriShort: string;
    };

    type ApiGroups = {
        // API分组名称
        apiGroup: string;
        // 已使用
        usedCount: number;
        // 待分析
        needAnalysisCount: number;
        // 规划中
        planningCount: number;
        // 缺少API
        missingCount: number;
        // 不适合
        ignoreCount: number;
    };

    type Detail = {
        id: number;
        productGroup: string;
        productName: string;
        apiGroup: string;
        apiName: string;
        apiNameEn: string;
        method: string;
        uri: string;
        uriShort: string;
        publishStatus: string;
        useRemark: string;
        remark: string;
        definition: string;
        lastSyncDate: string;
        created: string;
        updated: string;

        providerList: null;
    };

    type Group = {
        apiGroup: string;
        usedCount: number;
        needAnalysisCount: number;
        planningCount: number;
        missingCount: number;
        ignoreCount: number;
    };

    type queryListParams = {
        cloudName?: string;
        productName?: string;
        apiGroup?: string;
        apiName?: string;
        uri?: string;
        useRemark?: string;
        publishStatus?: string;
        owner?: string;
        id?: number[];
    };

    type ProviderApi = {
        id: number;
        type: string;
        name: string;
        apiId: number;
        productGroup: string;
        productName: string;
        apiGroup: string;
        apiName: string;
        apiNameEn: string;
        method: string;
        uriShort: string;
    };

    type ChangeDetail = {
        id: number;
        apiId: number;
        productName: string;
        productGroup: string;
        apiGroup: string;
        apiName: string;
        apiNameEn: string;
        method: string;
        uri: string;
        uriShort: string;
        providers: string;
        affectStatus: string;
        remark: string;
        diffContent: string;
    };

    type ChangeHistory = {
        affectStatus: string;
        apiGroup: string;
        apiId: integer;
        apiName: string;
        apiNameEn: string;
        created: string;
        diffContent: string;
        id: integer;
        lastVersionDate: string;
        method: string;
        productGroup: string;
        productName: string;
        providers: string;
        remark: string;
        updated: string;
        uri: string;
        uriShort: string;
    };
}
