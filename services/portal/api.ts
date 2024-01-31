import {request} from 'umi';
import {PGS_PATH, PMS_PATH} from "@/services/api";

/** 查询API对接汇总数据 GET /portal/provider-health-check-sum */
export async function getProviderHealthCheckSum() {
    return request<Portal.ProviderHealthCheckSum>('/portal/provider-health-check-sum', {
        method: 'GET',
    });
}

/** 查询API对接汇总数据 GET /portal/service-statistics-card-sum */
export async function getApiPanelSum(productName: string) {
    return request<Portal.ProductSumPanel>(`${PMS_PATH}/portal/product/sum/${productName}`, {
        method: 'GET',
    });
}

export async function getServiceSumList(ownerArr: string[], levelArr: string[]) {
    return request<Portal.PortalSum>(`${PMS_PATH}/portal/product/sum`, {
        method: 'GET',
        params: {owner: ownerArr, level: levelArr}
    });
}

export async function getOwnerSumList() {
    return request<Global.List<Portal.OwnerSum[]>>(`${PGS_PATH}/portal/sum/owners`, {
        method: 'GET',
    });
}

export async function getPartnerSum(cloudName: string) {
    return request<Global.Response<Portal.PartnerSum>>(`${PGS_PATH}/portal/sum/partner`, {
        method: 'GET',
        params: {cloudName},
    });
}

export async function changePwd(oldPasswd: string, newPasswd: string) {
    return request<Global.Response<{ message: string }>>(`${PGS_PATH}/user/change-passwd`, {
            method: 'POST',
            data: {
                newPasswd: newPasswd,
                oldPasswd: oldPasswd,
            },
        },
    );
}

export async function changeUserSettings(params: { email: string, githubAccount: string, ip: string }) {
    return request<Global.Response<{ message: string }>>(`${PGS_PATH}/user/change-settings`, {
            method: 'POST',
            data: params,
        },
    );
}
