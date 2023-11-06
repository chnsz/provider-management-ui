import {request} from 'umi';
import {PGS_PATH} from "@/services/api";

/** 查询api列表 Get /api/list/{limit}/{offset} */
export async function getApiListSum(
    queryParams: {
        productName?: string;
        title?: string;
        status?: string;
        assignee?: string;
    },
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Api.ApiList[]>>(`${PGS_PATH}/api/list/${limit}/${offset}`, {
        method: 'GET',
        params: queryParams,
    });
}

/** 查询api列表 Get /api/{id}/change-history */
export async function getApiChangeSum(
    queryParams: {
        productName?: string;
        title?: string;
        status?: string;
        assignee?: string;
    },
    id: number,
) {
    return request<Global.List<Api.ApiChange[]>>(`${PGS_PATH}/api/${id}/change-history`, {
        method: 'GET',
        params: {...queryParams},
    });
}

/** 查询api分组列表 Get /api/groups/list */
export async function getApiGroupsSum() {
    return request<Api.ApiGroups[]>(`${PGS_PATH}/api/groups/list/?productName=ECS`, {
        method: 'GET',
    });
}

/** 查询API列表 GET /pms/api/list/{limit}/{offset} */
export async function getApiDetailList(
    params: Api.queryListParams,
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Api.Detail[]>>(`${PGS_PATH}/api/list/${limit}/${offset}`, {
        method: 'GET',
        params: {...params},
    });
}

export async function getApiGroupList(productName: string) {
    return request<Api.Group[]>(`${PGS_PATH}/api/groups/list`, {
        method: 'GET',
        params: {productName: productName},
    });
}

export async function getApiChangeDetail(id: number | string) {
    return request<Api.ChangeDetail>(`${PGS_PATH}/api/change-detail/${id}`, {
        method: 'GET',
    });
}

export async function getApiChangeHistory(id: number | string) {
    return request<Global.List<Api.ChangeHistory[]>>(`${PGS_PATH}/api/${id}/change-history`, {
        method: 'GET',
    });
}

export async function modifyApiChangeStatus(id: number, status: string, remark: string) {
    return request<Global.List<Api.ChangeHistory[]>>(`${PGS_PATH}/api/change-detail/${id}/status/${status}`, {
        method: 'PATCH',
        params: {remark},
    });
}

export async function updatePublishStatus(id: number, status: string) {
    return request<Global.AffectResponse>(`${PGS_PATH}/api/publish-status/${id}/${status}`, {
        method: 'PATCH',
    });
}

export async function updateUseStatus(id: number, status: string, remark?: string) {
    return request<Global.AffectResponse>(`${PGS_PATH}/api/use-status/${id}/${status}`, {
        method: 'PATCH',
        params: {remark},
    });
}
