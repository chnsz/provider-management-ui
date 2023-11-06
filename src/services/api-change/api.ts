import {request} from 'umi';
import {PGS_PATH} from "@/services/api";

/** 搜索变更历史记录 Get change-history/list/{limit}/{offset} */
export async function getApiChangeAnalysis(
    params: ApiChange.queryListParams,
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<ApiChange.ApiChange[]>>(
        `${PGS_PATH}/api/change-history/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: {...params},
        },
    );
}

export async function getApiFieldChangedList(params: ApiChange.ApiFieldChangeQuery, pageSize: number, pageNum: number) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<{ items: ApiChange.ApiFieldChange[]; total: number; toExpiredDays: number; expiredDays: number; }>(
        `${PGS_PATH}/provider-api-base/api-field/changed/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: params,
        },
    );
}

export async function modifyApiFieldChangeStatus(id: number, status: string, remark: string) {
    return request<Global.List<ApiChange.ApiFieldChange[]>>(
        `${PGS_PATH}/provider-api-base/${id}/status/${status}`,
        {
            method: 'PATCH',
            params: {remark},
        },
    );
}
