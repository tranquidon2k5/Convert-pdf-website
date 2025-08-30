export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard", "/tools/:path*"] };


