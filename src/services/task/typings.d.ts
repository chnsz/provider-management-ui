declare namespace Task {
    type Task = {
        id: number;
        productName: string;
        title: string;
        content?: string;
        deadline?: string;
        status: string;
        priority: number;
        cardId?: number;
        assignee?: string;
        creator: string;
        created: string;
        updated: string;

        kanboardTask?: ProviderPlanning.KanboardTaskBo;
    };

    type CreateOpts = {
        title: string;
        productName?: string;
        content?: string;
        deadline?: string;
        status: string;
        priority?: number;
        assignee?: string;
    };

    type UpdateOpts = {
        id?: number;
        productName?: string;
        title?: string;
        content?: string;
        deadline?: string;
        status?: string;
        priority?: number;
        cardId?: number;
        assignee?: string;
    };
}
