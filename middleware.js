// import { NextResponse } from "next/server";
import { NextResponse } from 'next/server'
import BASE_URL from './config'

export default function middleware (req) {
  let verify = req.cookies.get('userInfo')
  let uri = req.url


  // not logged in
  if (!verify && uri.includes('/admin')) {
    return NextResponse.redirect(`${BASE_URL}/login`)
  }

  if (
    verify &&
    uri.includes('/admin/article') &&
    JSON.parse(verify.value).role == 'user'
  ) {
    return NextResponse.redirect(`${BASE_URL}/login`)
  }

  if (
    verify &&
    JSON.parse(verify.value).role != 'admin' &&
    (uri.includes('/admin/category') ||
      uri.includes('/admin/tag') ||
      uri.includes('/admin/user'))
  ) {
    return NextResponse.redirect(`${BASE_URL}/login`)
  }

  // if (verify && uri.includes('/login')) {
  //   return NextResponse.redirect(new URL('/', uri))
  // }
}
