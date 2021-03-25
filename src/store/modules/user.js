import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { request } from 'https'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    teachingGradeId: '',
    teachingCoursesId: '',
    name: '',
    avatar: '',
    introduction: '',
    roles: [],

    userId: '',
    menuList: [],
    permissionList: [],

    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_TEAGRADEID: (state, teachingGradeId) => {
      state.teachingGradeId = teachingGradeId
    },
    SET_TEACOURSEID: (state, teachingCoursesId) => {
      state.teachingCoursesId = teachingCoursesId
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },

    SET_MENULIST: (state, menuList) => {
      state.menuList = menuList
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    }
    // SET_ROLES: (state, roles) => {
    //   state.roles = roles
    // }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          if (response.result === 'success') {
            // cookie中保存前端登录状态
            console.log(response)
            commit('SET_TOKEN', response.result)
            setToken(response.result)
          }
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.userPermission
          commit('SET_ROLES', data.roles)
          if (data.teachingGradeId == undefined) {
            commit('SET_TEAGRADEID', '')
          } else {
            commit('SET_TEAGRADEID', data.teachingGradeId + '')
          }
          if (data.teachingGradeId == undefined) {
            commit('SET_TEACOURSEID', '')
          } else {
            commit('SET_TEACOURSEID', data.teachingCoursesId + '')
          }
          commit('SET_NAME', data.nickname)
          commit('SET_USERID', data.userId)
          commit('SET_MENULIST', data.menuList)
          commit('SET_PERMISSIONLIST', data.permissionList)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_NAME', '')
          commit('SET_USERID', '')
          commit('SET_MENULIST', [])
          commit('SET_PERMISSIONLIST', [])

          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_NAME', '')
        commit('SET_USERID', '')
        commit('SET_MENULIST', [])
        commit('SET_PERMISSIONLIST', [])

        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.userPermission
          commit('SET_ROLES', data.roles)
          if (data.teachingGradeId == undefined) {
            commit('SET_TEAGRADEID', '')
          } else {
            commit('SET_TEAGRADEID', data.teachingGradeId + '')
          }
          if (data.teachingGradeId == undefined) {
            commit('SET_TEACOURSEID', '')
          } else {
            commit('SET_TEACOURSEID', data.teachingCoursesId + '')
          }
          commit('SET_NAME', data.nickname)
          commit('SET_USERID', data.userId)
          commit('SET_MENULIST', data.menuList)
          commit('SET_PERMISSIONLIST', data.permissionList)

          const roles = data.menuList // note: roles must be a array! such as: ['editor','develop']
          dispatch('GenerateRoutes', roles) // 动态修改权限后 重绘侧边菜单

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
