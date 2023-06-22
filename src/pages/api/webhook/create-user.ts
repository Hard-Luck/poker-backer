import type { WebhookEvent, } from "@clerk/clerk-sdk-node"
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "~/server/db";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const evt = req.body as WebhookEvent
    switch (evt.type) {
        case 'user.created': // this is typed
            const user_id = evt.data.id
            const name = evt.data.first_name + `${Date.now() % 17}`
            await prisma.userInfo.create({
                data: {
                    username: name,
                    id: user_id,
                }
            }).catch(e => console.log(e))
            res.send('ok')
            break;
        default:
            break;
    }

}

export default handler