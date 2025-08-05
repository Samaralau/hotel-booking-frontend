import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { BACKEND_URL } from '../config/api'
import useToastStore from '../stores/ToastStore'

export const Signup = () => {
  const [message, setMessage] = useState('')
  const [msgClass, setMsgClass] = useState('')
  const setToast = useToastStore(state => state.setToast)
  const [, nav] = useLocation()

  interface SignUpResponse {
    success: boolean
    data: {
      firstName: string
      email: string
      isAdmin: boolean
      token: string
    }
    message: string
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Hotel Booking</h1>
      <p className="mb-4 text-2xl font-bold flex">Sign-up Form</p>
      <div className="grid gap-6 mb-6 md:grid-cols-2 w-1/2">
        <p>Name:</p>
        <input
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="John"
          required
        />
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
      <button
        id="signup"
        onClick={() => {
          void onSubmitClick()
        }}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Sign Up
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

  async function submitNewUser(): Promise<void> {
    const name_inp = document.getElementById('name') as HTMLInputElement
    const email_inp = document.getElementById('email') as HTMLInputElement
    const passwd_inp = document.getElementById('passwd') as HTMLInputElement

    if (
      name_inp.value == ''
      || email_inp.value == ''
      || passwd_inp.value == ''
    ) {
      setMsgClass('text-red-800')
      setMessage('Missing fields.')
    }
    else {
      // Sign up API call
      const res = await fetch(`${BACKEND_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: name_inp.value,
          email: email_inp.value,
          password: passwd_inp.value,
        }),
      })
      const msg = (await res.json()) as SignUpResponse
      setMessage(msg.message)
      // Response successful
      if (res.ok) {
        // User successfully created
        if (msg.success) {
          // sessionStorage.setItem("toast", msg.message);
          setToast(msg.message, 'success')
          nav('/login')
        }
        // Error
        else {
          setMsgClass('text-red-800')
        }
      }
      setMsgClass('text-red-800')
    }
  }
  async function onSubmitClick() {
    await submitNewUser()
  }
}
