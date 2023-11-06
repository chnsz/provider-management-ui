import {request} from 'umi';
import {CloudName} from "@/global";
import {PGS_PATH} from "@/services/api";

const PMS_PATH = '/pms';

type queryProviderParams = {
    cloudName: 'HuaweiCloud' | 'FlexibleEngineCloud' | 'G42Cloud';
    productName?: string;
    type?: 'Resource' | 'DataSource';
    catalog?: string;
    name?: string;
};

export async function getProviderList(
    params: queryProviderParams,
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Provider.Provider[]>>(
        `${PGS_PATH}/provider/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: params,
        },
    );
}

export async function getProviderSyncList(params: queryProviderParams) {
    return request<Global.List<Provider.Provider[]>>(
        `${PGS_PATH}/provider/sync/list`,
        {
            method: 'GET',
            params: params,
        },
    );
}

export async function updateSync(id: number, cloudName: string, name: string) {
    const params: { cloudName: string, g42Name?: string, feName?: string } = {cloudName: cloudName};
    if (cloudName === CloudName.G42Cloud) {
        params.g42Name = name;
    } else if (cloudName === CloudName.FlexibleEngineCloud) {
        params.feName = name;
    }

    return request<Global.List<Provider.Provider[]>>(
        `${PGS_PATH}/provider/${id}/sync`,
        {
            method: 'PATCH',
            data: params,
        },
    );
}

export async function updateRemark(id: number, cloudName: string, remark: string) {
    const params: { cloudName: string, g42Remark?: string, feRemark?: string } = {cloudName: cloudName};
    if (cloudName === CloudName.G42Cloud) {
        params.g42Remark = remark;
    } else if (cloudName === CloudName.FlexibleEngineCloud) {
        params.feRemark = remark;
    }

    return request<Global.List<Provider.Provider[]>>(
        `${PGS_PATH}/provider/${id}/remark`,
        {
            method: 'PATCH',
            data: params,
        },
    );
}

export async function updateRelaTag(id: number, cloudName: string, relaTag: string) {
    const params: { cloudName: string, g42RelaTag?: string, feRelaTag?: string } = {cloudName: cloudName};
    if (cloudName === CloudName.G42Cloud) {
        params.g42RelaTag = relaTag;
    } else if (cloudName === CloudName.FlexibleEngineCloud) {
        params.feRelaTag = relaTag;
    }

    return request<Global.List<Provider.Provider[]>>(
        `${PGS_PATH}/provider/${id}/relation`,
        {
            method: 'PATCH',
            data: params,
        },
    );
}

export async function updateSchemaSyncStatus(id: number, cloudName: string, schemaSyncStatus: string) {
    const params: {
        cloudName: string,
        g42SchemaSyncStatus?: string,
        feSchemaSyncStatus?: string
    } = {cloudName: cloudName};
    if (cloudName === CloudName.G42Cloud) {
        params.g42SchemaSyncStatus = schemaSyncStatus;
    } else if (cloudName === CloudName.FlexibleEngineCloud) {
        params.feSchemaSyncStatus = schemaSyncStatus;
    }

    return request<Global.List<Provider.Provider[]>>(
        `${PGS_PATH}/provider/${id}/schemaSyncStatus`,
        {
            method: 'PATCH',
            data: params,
        },
    );
}

export async function getProviderScoreList(owners: string[], prStatus: string, startDate: string, endStart: string) {
    return request<Global.List<Provider.ProviderScoreDto[]>>(`${PGS_PATH}/provider/score/list`, {
        method: 'GET',
        params: {
            owner: owners,
            prStatus,
            startDate,
            endStart,
        },
    });
}

export async function changeUtFlag(id: number, state: string) {
    return request<Global.AffectResponse>(`${PGS_PATH}/provider/${id}/ut-flag/${state}`, {
        method: 'PATCH',
    });
}

export async function changeEpsSupport(id: number, state: string) {
    return request<Global.AffectResponse>(`${PGS_PATH}/provider/${id}/eps-state/${state}`, {
        method: 'PATCH',
    });
}

export async function changePrePaidSupport(id: number, state: string) {
    return request<Global.AffectResponse>(`${PGS_PATH}/provider/${id}/pre-paid-state/${state}`, {
        method: 'PATCH',
    });
}

export async function changeTagSupport(id: number, state: string) {
    return request<Global.AffectResponse>(`${PGS_PATH}/provider/${id}/tag-state/${state}`, {
        method: 'PATCH',
    });
}

export async function changeQualityStatus(id: number, state: string) {
    return request<Global.AffectResponse>(`${PGS_PATH}/provider/${id}/quality-status/${state}`, {
        method: 'PATCH',
    });
}

export async function getPrList(owner: string, prStatus: string, providerType: string, providerName: string, startDate: string, endStart: string) {
    return request<Global.List<Provider.PullRequest[]>>(`${PGS_PATH}/provider/pr/list`, {
        method: 'GET',
        params: {
            owner,
            prStatus,
            providerType,
            providerName,
            startDate,
            endStart,
        },
    });
}

export async function getOwnerPrList(owner: string, prStatus: string, startDate: string, endStart: string) {
    return request<Global.List<Provider.PullRequest[]>>(`${PGS_PATH}/provider/owner/pr/list`, {
        method: 'GET',
        params: {
            owner,
            prStatus,
            startDate,
            endStart,
        },
    });
}

export async function getProviderBaseAllSum() {
    return request<Global.List<Provider.ProviderBaseSum[]>>(`${PGS_PATH}/provider-api-base/sum`, {
        method: 'GET',
    });
}

export async function getProviderApiBaseSum(providerType: string, providerName: string) {
    return request<Global.List<Provider.ProviderBaseSum[]>>(`${PGS_PATH}/provider-api-base/${providerType}/${providerName}/sum`, {
        method: 'GET',
    });
}

export async function getProviderBaseList(apiId: number, providerType: string, providerName: string) {
    return request<Global.List<Provider.ProviderBase[]>>(`${PGS_PATH}/provider-api-base/list`, {
        method: 'GET',
        params: {
            apiId: apiId,
            providerType: providerType,
            providerName: providerName,
        },
    });
}

export async function saveProviderBase(apiId: number,
                                       providerType: string,
                                       providerName: string,
                                       inputList: Provider.ProviderBase[],
                                       outputList: Provider.ProviderBase[]
) {
    return request<Global.Response<string>>(`${PGS_PATH}/provider-api-base/${providerType}/${providerName}/${apiId}/action/save`, {
        method: 'POST',
        data: {
            inputList: inputList,
            outputList: outputList,
        },
    });
}

export async function getProviderByOwner(owner: string) {
    return request<Global.List<Provider.Provider[]>>(
        `/pgs/provider/owner/list`,
        {
            method: 'GET',
            params: {owner: owner},
        },
    );
}

export async function getProviderTypeSum(cloudName?: string) {
    return request<Provider.TypeSum>(
        `${PGS_PATH}/provider/type/sum`,
        {
            method: 'GET',
            params: {cloudName: cloudName},
        },
    );
}

export async function getCloudSum(cloudName: string) {
    return request<Provider.CloudSum>(
        `${PGS_PATH}/api/cloud/sum`,
        {
            method: 'GET',
            params: {cloudName},
        },
    );
}

export async function getProviderBugs(owner?: string) {
    return request<Global.List<Provider.Bug[]>>(
        `${PGS_PATH}/provider/bugs/list`,
        {
            method: 'GET',
            params: {owner: owner},
        },
    );
}

export async function getProviderSyncSum() {
    return request<Global.List<Provider.ProviderSyncSum[]>>(
        `${PGS_PATH}/provider-sync/list/sum`,
        {
            method: 'GET',
        },
    );
}

export async function getProviderSyncIssueList(
    params: {
        cloudName: string,
        type: string,
        providerType: string,
        providerName: string,
        fieldName: string,
        status: string
    },
    pageSize: number, pageNum: number
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<{ items: Provider.ProviderSyncIssue[]; total: number; toExpiredDays: number; expiredDays: number; }>(
        `${PGS_PATH}/provider-sync/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: params,
        },
    );
}

export async function updateProviderSyncStatus(id: number, status: string, remark: string) {
    return request<Global.Response<Provider.ProviderSyncIssue>>(
        `${PGS_PATH}/provider-sync/status/${id}/${status}`,
        {
            method: 'PATCH',
            params: {
                remark
            },
        }
    );
}

export async function getSyncIssueProviderSum(cloudName: string, syncType: string | string[], remark: string, status: string[]) {
    let type: string[] = [];
    if (Array.isArray(syncType)) {
        type = syncType
    } else {
        type.push(syncType)
    }

    return request<Global.List<Provider.ProviderIssueSum[]>>(
        `${PGS_PATH}/provider-sync/list/sum/provider`,
        {
            method: 'GET',
            params: {cloudName, type, remark, status}
        },
    );
}

export async function addCategoryProduct(category: string, productName: string) {
    return request<Global.List<Provider.CategoryProductDto>>(
        `${PGS_PATH}/provider/catalog/product`,
        {
            method: 'POST',
            params: {category, productName}
        },
    );
}

export async function updateCategoryProduct(id: number, productName: string) {
    return request<Global.AffectResponse>(
        `${PGS_PATH}/provider/catalog/product/${id}`,
        {
            method: 'PATCH',
            params: {productName}
        },
    );
}

export async function deleteCategoryProduct(id: number) {
    return request<Global.AffectResponse>(
        `${PGS_PATH}/provider/catalog/product/${id}`,
        {
            method: 'DELETE',
        },
    );
}

export async function listCategoryProduct() {
    return request<Global.List<Provider.CategoryProductDto[]>>(
        `${PGS_PATH}/provider/catalog/product/list`,
        {
            method: 'GET',
        },
    );
}

export async function startPartnerTest(id: number, cloudName: string, providerType: string, providerName: string) {
    return request<Global.List<Provider.CategoryProductDto[]>>(
        `${PGS_PATH}/test-job/partner/${id}/action/start`,
        {
            method: 'POST',
            params: {cloudName, providerType, providerName},
        },
    );
}

export async function addApiMonitor(monitor: Provider.ApiMonitor) {
    return request<Global.Response<string>>(`${PGS_PATH}/api-monitor`, {
        method: 'POST',
        data: monitor,
    });
}

export async function updateApiMonitor(monitor: Provider.ApiMonitor) {
    return request<Global.Response<string>>(`${PGS_PATH}/api-monitor/${monitor.id}`, {
        method: 'PUT',
        data: {monitor},
    });
}

export async function getApiMonitorList(
    params: {
        cloudName?: string;
        providerType?: string;
        providerName?: string;
        type?: string;
        status?: string;

        productName?: string;
        method?: string;
        uriShort?: string;
        fieldIn?: 'header' | 'query' | 'path' | 'body' | '';
        fieldName?: string;

        relationType?: string;
        relationId?: number;
        groupName?: string;
    },
    pageSize: number, pageNum: number
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Provider.ApiMonitor[]>>(`${PGS_PATH}/api-monitor/list/${limit}/${offset}`, {
        method: 'GET',
        params: params,
    });
}

export async function deleteApiMonitor(id: number) {
    return request<{ affectedRow: number }>(`${PGS_PATH}/api-monitor/${id}`, {
        method: 'DELETE',
    });
}

export async function openApiMonitor(id: number) {
    return request<{ affectedRow: number }>(`${PGS_PATH}/api-monitor/${id}/action/open`, {
        method: 'PATCH',
    });
}

export async function closeApiMonitor(id: number) {
    return request<{ affectedRow: number }>(`${PGS_PATH}/api-monitor/${id}/action/close`, {
        method: 'PATCH',
    });
}

export async function convertProviderName(cloudName: string, original: string) {
    return request<{ data: Provider.PartnerConvert, message: string }>(`${PGS_PATH}/partner/convert/provider-name`, {
        method: 'POST',
        data: {cloudName, original},
    });
}
