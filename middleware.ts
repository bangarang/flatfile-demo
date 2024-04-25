import constants from "@config/constants.json"
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const cartCookiePresent = request.cookies.get(constants.go_cart_cookie)
    if (cartCookiePresent) {
        const url = request.nextUrl.clone()
        url.pathname = '/group-order-matrix'
        return NextResponse.redirect(url)
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/cart',
}