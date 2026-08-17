import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/no-autorizado"]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isApiRoute(req)) return;
  if (isPublicRoute(req)) return;
  const { userId } = await auth();
  if (!userId) return (await auth()).redirectToSignIn();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
