import {request} from '@@/exports';
import {ItemType} from 'antd/es/menu/hooks/useItems';

/** 查询菜单 GET /data/menu-changes.json */
export async function getMenu(name: string) {
    return request<ItemType[]>(`/api_data/${name}`, {method: 'GET'});
}

/** 查询API定义 GET /data/API_Definition/计算/ECS/云服务器操作管理/查询云服务器操作行为列表_GET_NovaListServerActions.yaml */
export async function getApiDefinition(path: string) {
    return request<string>(`/api_data/API_Definition${path}`, {method: 'GET'});
}

/** 查询API变更信息 GET /data/API_Change/计算/ECS/云服务器操作管理/查询云服务器操作行为列表_GET_NovaListServerActions.yaml */
export async function getApiChanges(path: string) {
    return request<string>(`/api_data/API_Change${path}`, {method: 'GET'});
}

export async function getApiChangeReport() {
    return request<Api.Report[]>(`/api_data/Report/overview.json`, {method: 'GET'});
}

export async function getCurrentUser() {
    return request<Global.User>(`/pms/currentUser`, {method: 'GET'});
}
