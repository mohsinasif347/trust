import { createServerClient, type CookieOptions } from '@supabase/ssr'

import { NextResponse, type NextRequest } from 'next/server' // Fixed from 'next/request'



export async function middleware(request: NextRequest) {

  let response = NextResponse.next({

    request: { headers: request.headers },

  })



  const supabase = createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {

      cookies: {

        get(name: string) { return request.cookies.get(name)?.value },

        set(name: string, value: string, options: CookieOptions) {

          request.cookies.set({ name, value, ...options })

          response = NextResponse.next({ request: { headers: request.headers } })

          response.cookies.set({ name, value, ...options })

        },

        remove(name: string, options: CookieOptions) {

          request.cookies.set({ name, value: '', ...options })

          response = NextResponse.next({ request: { headers: request.headers } })

          response.cookies.set({ name, value: '', ...options })

        },

      },

    }

  )



  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()



  // 1. Agar login nahi hai aur protected routes par hai

  if (!user) {

    if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) {

      return NextResponse.redirect(new URL('/login', request.url))

    }

    return response

  }



  // 2. User Role fetch karein profiles table se

  const { data: profile } = await supabase

    .from('profiles')

    .select('role')

    .eq('id', user.id)

    .single()



  const isAdmin = profile?.role === 'admin'



  // 3. Security Logic

  if (url.pathname.startsWith('/admin') && !isAdmin) {

    // Agar user admin nahi hai toh usay dashboard par bhej do

    return NextResponse.redirect(new URL('/dashboard', request.url))

  }



  return response

}



export const config = {

  matcher: [

    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',

  ],

}