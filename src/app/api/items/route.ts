import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/vendor/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method === 'GET') {
    const { id } = query;

    try {
      const list = await prisma.item.findMany({
        where: {
          id: parseInt(id as string, 10),
        },
        orderBy: {
          id: 'desc',
        },
      });
      res.status(200).json({ list });
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
