import type { NextApiRequest, NextApiResponse } from 'next';
import connectionPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await connectionPromise;

        const users = await db.collection('user').find({}).toArray();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
