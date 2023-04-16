import { Request, Response } from 'express';

export default {
    'GET /portal/provider-health-check-sum': (req: Request, res: Response) => {
        res.send({
            resource: {
                success: 83,
                apiFailed: 10,
                other: 7,
            },
            dataSource: {
                success: 84,
                apiFailed: 10,
                other: 7,
            },
        });
    },
};
