import store from '@/store'

export function hasPermission(permission) {
  const myPermissions = store.getters.permissionList
  return myPermissions.indexOf(permission) > -1
}
