import {request} from "@@/exports";

/** 查询API对接汇总数据 GET /portal/api-coverage-sum */
export async function getApiCoverageSum() {
    return request<Portal.ApiCoverage>('/portal/api-coverage-sum', {method: 'GET'});
}
