const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  teachingGradeId: state => state.user.teachingGradeId,
  teachingCoursesId: state => state.user.teachingCoursesId,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,

  userId: state => state.user.userId,
  menuList: state => state.user.menuList,
  permissionList: state => state.user.permissionList,

  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
}
export default getters
