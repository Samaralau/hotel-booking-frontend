import { Link, useLocation } from 'wouter'
// import useAuthStore from '../store'
import useAuthStore from '../stores/AuthStore'
import useToastStore from '../stores/ToastStore'
import { useState } from 'react'
import { BACKEND_URL } from '../config/api'

export const Login = () => {
  const [message, setMessage] = useState('')
  const [msgClass, setMsgClass] = useState('')
  // const { login } = useAuthStore();
  const login = useAuthStore(state => state.login)
  const setToast = useToastStore(state => state.setToast)
  // const toastMsg = useToastStore(state => state.toastMsg)
  // const clearToast = useToastStore(state => state.clearToast)
  const redirectUrl = useAuthStore(state => state.redirectUrl)
  const clearRedirectUrl = useAuthStore(state => state.clearRedirectUrl)
  const [, nav] = useLocation()

  // Already implemented auto-clearing in useToastStore
  // useEffect(() => {
  //   if (toastMsg) {
  //     const timer = setTimeout(() => clearToast(), 3000)
  //     return () => clearTimeout(timer)
  //   }
  // }, [toastMsg, clearToast])

  interface LoginResponse {
    data: {
      firstName: string
      email: string
      isAdmin: boolean
      token: string
    }
    message: string
    error?: {
      issues?: {
        message: string
      }[]
    }
  }

  return (
    <>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex">Hotel Booking</h1>
      </div>

      <p className="mb-4 text-2xl font-bold flex">Login Form</p>
      <div className="grid gap-6 mb-6 md:grid-cols-2 w-1/2">
        <p>Email:</p>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="john@company.com"
          required
        />
        <p>Password:</p>
        <input
          id="passwd"
          type="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="•••••••••"
          required
        />
      </div>
      <p className="mb-4 p-0.5 ">
        Dont have an Account?
        <Link
          className="ml-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
          href="/signup"
        >
          Sign up now.
        </Link>
      </p>
      <button
        id="login"
        onClick={() => {
          void onSubmitClick()
        }}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Login
        </span>
      </button>
      <Link
        href="/"
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 "
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Back to Home
        </span>
      </Link>
      <p className={`${msgClass}`}>{message}</p>
    </>
  )

  // Login button

  async function loginUser(): Promise<void> {
    const email_inp = document.getElementById('email') as HTMLInputElement
    const passwd_inp = document.getElementById('passwd') as HTMLInputElement

    // Login API call
    // console.log('email,password', email_inp.value, passwd_inp.value)
    const response = await fetch(`${BACKEND_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email_inp.value,
        password: passwd_inp.value,
      }),
    })
    const msg = (await response.json()) as LoginResponse
    // Handle login
    const isSuccess = response.ok && msg.data?.token
    if (isSuccess) {
      // sessionStorage.setItem("accessToken", msg.data.token);
      // sessionStorage.setItem(
      //   "details",
      //   JSON.stringify({
      //     email: msg.data.email,
      //     firstName: msg.data.firstName,
      //   }),
      // );
      // sessionStorage.setItem("toast", msg.message);
      // login();
      login(
        {
          email: msg.data.email,
          firstName: msg.data.firstName,
        },
        msg.data.token,
      )
      setToast(msg.message, 'success')
      // Redirect to stored URL or home
      if (redirectUrl) {
        clearRedirectUrl()
        nav(redirectUrl)
      }
      else {
        nav('/')
      }
    }
    else {
      const zodError = msg.error?.issues?.[0]?.message
      const fallbackmsg = msg.message
      console.log(msg.message)
      console.log(zodError)
      setMessage(zodError || fallbackmsg)
      setMsgClass('text-red-800')
    }
  }
  async function onSubmitClick(): Promise<void> {
    await loginUser()
  }
}
