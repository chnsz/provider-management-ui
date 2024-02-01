declare namespace ProviderPlanning {
    type CreateOption = {
        // 归属服务
        productName: string;
        // 标题
        title: string;
        // 特性ID
        featureId?: number;
        // 详细内容
        content?: string;
        // 状态
        status: string;
        //优先级
        priority: number;
        // 对应看板卡片的ID
        cardId?: string;
        // 创建人
        creator?: string;
        // 负责人
        assignee?: string;
        syncToKanboard?: string;

        // 关联的 Provider
        providerList?: Relation.ProviderRelation[];
        // 关联的 API
        apiIdList?: number[];
    };

    type UpdateOption = {
        // 归属服务
        productName: string;
        // 标题
        title: string;
        // 特性ID
        featureId?: string;
        featureName?: string;
        // 详细内容
        content?: string;
        // 状态
        status: string;
        //优先级
        priority: number;
        // 对应看板卡片的ID
        cardId?: string;
        // 负责人
        assignee?: string;

        // 关联的 Provider
        providerList?: Relation.ProviderRelation[];
        // 关联的 API
        apiIdList?: number[];
    };

    type KanboardTaskBo = {
        task: {
            id: number;
            title: string;
            description: string;
            color_id: string;
            project_id: number;
            column_id: number;
            owner_id: number;
            is_active: number;
            category_id: number;
            swimlane_id: number;
            url: string;
        }
        column: {
            id: number;
            title: string;
        }
        userDto?: {
            "id": number,
            "username": string,
            "name": string,
            "email": string
        }
    }

    type ProviderPlanning = {
        id: number;
        // 归属服务
        productName: string;
        // 标题
        title: string;
        // 特性ID
        featureId?: string;
        // 详细内容
        content?: string;
        // 状态
        status: string;
        //优先级
        priority: number;
        // 对应看板卡片的ID
        cardId?: number;
        // 负责人
        assignee?: string;
        // 创建人
        creator?: string;
        // 创建时间
        created: string;
        // 更新时间
        updated: string;
        // 特性信息
        feature?: ProductFeature.ProductFeature;

        // 关联的 Provider
        providerList?: Relation.ProviderRelation[];
        // 关联的 API
        apiList?: Relation.ApiRelation[];
        kanboardTask?: KanboardTaskBo;
    };

    type QueryParams = {
        productName?: string;
        owner?: string;
        title?: string;
        status?: string;
        assignee?: string;
    }
}
