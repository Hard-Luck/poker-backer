import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from "~/env.mjs";

import PushNotifications from "@pusher/push-notifications-server";
const beamsClient = new PushNotifications({
    instanceId: env.PUSHER_INSTANCE_ID,
    secretKey: env.PUSHER_SECRET_KEY,
});
const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(403).send({ message: "not authorized" })
    const beamsToken = beamsClient.generateToken(userId);
    res.send(JSON.stringify(beamsToken));
}





export default handler