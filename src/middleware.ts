import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import type { NextRequest } from 'next/server' 
// if used add req: NextRequest to line 6

export default withClerkMiddleware(() => {
    return NextResponse.next();
});

// Stop Middleware running on static files
export const config = { matcher: '/((?!_next/image|_next/static|favicon.ico).*)' };