import {request} from 'umi';
import {PGS_PATH} from "@/services/api";

export async function getApiFieldList(id: number[]) {
    return request<Global.List<Api.Detail[]>>(`${PGS_PATH}/api/field`, {
        method: 'GET',
        params: {id},
    });
}

export async function submitAutoGenerateData(opts: AutoGenerate.CreateOptions) {
    return request(
        `${PGS_PATH}/provider-generate`,
        {
            method: 'POST',
            data: opts,
        },
    );
}

export async function getAutoGenerateList(
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request(
        `${PGS_PATH}/provider-generate/list/${limit}/${offset}`,
        {
            method: 'GET',
        },
    );
}

export async function deleteAutoGenerateData(id: number) {
    return request<{ affectedRow: number }>(`${PGS_PATH}/provider-generate/${id}`, {
        method: 'DELETE',
    });
}

export async function getGenerateDetail(id: number | string) {
    return request(`${PGS_PATH}/provider-generate/${id}`, {
        method: 'GET',
    });
}