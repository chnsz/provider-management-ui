declare namespace Product {
    type Product = {
        id: number;
        productGroup: string;
        productName: string;
        productNameZh: string;
        productNameC: string;
        productNameCZh: string;
        productIcon?: string;
        owner?: string;
        ordinalPosition: number;
        created: string;
        updated: string;

        apiCount: number;
        level: string;
        statusCode: string;
    };

    type User = {
        username: string;
        ip: string;
        kbUserId: number;
    }

    type TestJobRecord = {
        id: number;
        productName: string;
        name: string;
        jobId: number;
        timeCost: string;
        status: string;
        startTime: string;
        endTime: string;
        output: string;
        coverageFile: string;
        logFile: string;
        created?: string;
        updated?: string;
    }
}
