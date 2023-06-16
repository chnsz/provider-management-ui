declare namespace ApiBaseline {
    type inputList = {
        // 参数类型
        paramType: string;
        // 参数名称
        fieldName: string;
        // 参数类型
        fieldType: string;
        // 参数位置
        fieldIn: string;
        // 描述
        fieldDesc: string;
        // 状态
        useStatus: string;
        // schema 名称
        schemaName: string;
        remark: string;
        apiId: number;
    };

    type outputList = [
        {
            // 参数类型
            paramType: 'output';
            // 参数名称
            fieldName: string;
            // 参数类型
            fieldType: string;
            // 参数位置
            fieldIn: string;
            // 描述
            fieldDesc: string;
            // 状态
            useStatus: string;
            schemaName: string;
            remark: string;
        },
    ];
}
