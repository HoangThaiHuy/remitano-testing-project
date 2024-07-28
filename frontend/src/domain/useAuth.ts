import useSWR from "swr";
import axios from 'axios'
import { arrayURLFetcher } from "@/lib/utils";
import { isEmpty } from 'lodash-es'
import { useSnapshot } from 'valtio'
import { proxyWithComputed } from 'valtio/utils'
import { API_URL } from '@/config/common'
import { jwtDecode } from 'jwt-decode'

const __KEY__ = 'rmt_token'

function getAuthUser() {
  const jwt = window.localStorage.getItem(__KEY__)

  axios.defaults.headers.Authorization = '';
  if (!jwt) return {}

  const data = JSON.parse(atob(jwt))
  const token = jwtDecode(data.access_token);
  console.log('token', token);

  if (token && token.exp <= Math.floor(Date.now() / 1000)) {
    window.localStorage.removeItem(__KEY__)
    return {}
  }
  else {
    axios.defaults.headers.Authorization = `Bearer ${data.access_token}`
    return data;
  }
}

const state = proxyWithComputed(
  {
    authUser: getAuthUser(),
  },
  {
    isAuth: (snap) => !isEmpty(snap.authUser),
  }
)

const actions = {
  login: async (email: string, password: string) => {

    const result = await axios.post(`${API_URL}/auth/register-or-login`, {
      "email": email,
      "password": password
    })

    state.authUser = result.data.data;
    window.localStorage.setItem(__KEY__, btoa(JSON.stringify(state.authUser)))
    axios.defaults.headers.Authorization = `Bearer ${state.authUser.access_token}`

    return result.data.data

  },

  logout: () => {
    state.authUser = {}

    window.localStorage.removeItem(__KEY__)
  },

  checkAuth: () => {
    const authUser = getAuthUser()

    if (!authUser || isEmpty(authUser)) {
      actions.logout()
    }
  },
}

function useAuth() {

  const snap = useSnapshot(state)
  return {
    authUser: snap.authUser,
    isAuth: snap.isAuth,
    ...actions,
  }
}

export default useAuth
