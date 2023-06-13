import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getDigestSecret, setDigestSecret, removeDigestSecret } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    code: '',
    avatar: '',
    digestSecret: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, adminName) => {
    state.name = adminName
  },
  SET_CODE: (state, adminCode) => {
    state.code = adminCode
  },
  SET_AVATAR: (state, adminAvatarUrl) => {
    state.avatar = adminAvatarUrl
  },
  //提交mutations
  SET_DIGESTSECRET:(state, digestSecret) => {
    state.digestSecret = digestSecret
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      //这个login方法对应的是api包下的login方法
      login({ adminCode: username.trim(), adminPwd: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)//存储到VueX
        setToken(data.token)//存储到cookies
        
        commit('SET_DIGESTSECRET', data.digestSecret)//把摘要密钥也存起来
        setDigestSecret(data.digestSecret)
        
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info  获取管理员信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { adminName, adminCode ,adminAvatarUrl } = data
        // console.log(data)
        commit('SET_NAME', adminName)
        commit('SET_CODE', adminCode)
        commit('SET_AVATAR', adminAvatarUrl)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeDigestSecret()//同时移除摘要密钥

        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

