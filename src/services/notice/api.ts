import {request} from 'umi';
import {PMS_PATH} from "@/services/api";

/** 创建动态 POST /pms/notice */
export async function createNotice() {
    return request<Notice.Notice>(`${PMS_PATH}/notice`, {method: 'POST'});
}

/** 删除通知动态 DELETE /pms/notice/{id} */
export async function removeNotice(id: string) {
    return request<Global.AffectResponse>(`${PMS_PATH}/notice/${id}`, {method: 'DELETE'});
}

/** 查询通知动态明细 GET /pms/notice */
export async function getNotice(id: string) {
    return request<Notice.Notice>(`${PMS_PATH}/notice/${id}`, {method: 'GET'});
}

/** 查询通知动态列表 GET /pms/notice */
export async function getNoticeList(params: {
    isRead?: string, productName?: string[], owner?: string[],
}, pageSize: number, pageNum: number) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Notice.Notice[]>>(
        `${PMS_PATH}/notice/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: {...params}
        },
    );
}

/** 修改阅读状态 POST /pms/notice */
export async function markNoticeRead(id: string) {
    return request<Global.AffectResponse>(`${PMS_PATH}/notice/state/${id}/yes`, {
        method: 'PATCH',
    });
}

/** 修改阅读状态 POST /pms/notice */
export async function markNoticeNotRead(id: string) {
    return request<Global.AffectResponse>(`${PMS_PATH}/notice/state/${id}/no`, {method: 'PATCH'});
}
