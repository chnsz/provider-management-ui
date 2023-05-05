import { request } from '@@/exports';

const basePath = '/pms';

/** 查询服务 GET /pms/product/list */
export async function getProductList() {
    return request<Global.List<Product.Product[]>>(`${basePath}/product/list`, { method: 'GET' });
}

/** 查询全部田主 GET /pms/product */
export async function getUserList() {
    return request<Global.List<Product.User[]>>(`${basePath}/product/owner/list`, { method: 'GET' });
}