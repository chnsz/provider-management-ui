import {request} from '@@/exports';

const basePath = '/pms';

export async function createTask(opts: Task.CreateOpts) {
    return request<Task.Task>(`${basePath}/task`, {
        method: 'POST',
        data: opts,
    });
}

export async function getTask(id: number | string) {
    return request<Task.Task>(`${basePath}/task/${id}`, {method: 'GET'});
}

export async function getTaskList(
    params: {
        title?: string;
        productName?: string[];
        owner?: string[];
        status?: string[];
    },
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Task.Task[]>>(`${basePath}/task/list/${limit}/${offset}`, {
        method: 'GET',
        params: {...params},
    });
}

export async function updateTask(id: number, opts: Task.UpdateOpts) {
    return request<Task.Task>(`${basePath}/task/${id}`, {
        method: 'PATCH',
        data: opts,
    });
}

export async function deleteTask(id: number) {
    return request<{ affectedRow: number }>(`${basePath}/task/${id}`, {
        method: 'DELETE',
    });
}

export async function changeTaskStatus(id: number, status: string) {
    return request<{ affectedRow: number }>(`${basePath}/task/status/${id}/${status}`, {
        method: 'PATCH',
    });
}

export async function createTaskKbTask(id: number) {
    return request<Task.Task>(`${basePath}/task/kanboard-task/${id}`, {method: 'PUT'});
}
