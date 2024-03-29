import type { WebhookEvent } from '@clerk/clerk-sdk-node';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';
import { env } from '~/env.mjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const check = req.headers['check'];

  if (check !== env.CHECK)
    return res.status(403).send({ message: 'not authorized' });
  const evt = req.body as WebhookEvent;
  switch (evt.type) {
    case 'user.created': // this is typed
      try {
        const user_id = evt.data.id;
        const name = evt.data.first_name + `${Date.now() % 9797}`;
        await prisma.userInfo.create({
          data: {
            username: name,
            id: user_id,
            img_url: evt.data.profile_image_url,
          },
        });
        res.status(200).send('ok');
      } catch (e) {
        console.log(e);
        res.status(500).send('error');
      } finally {
        break;
      }
  }
};

export default handler;
