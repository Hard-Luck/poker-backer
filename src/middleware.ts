/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/"],
    signInUrl: "/",

});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};