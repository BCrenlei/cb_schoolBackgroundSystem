import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
{
  path: '/operationalInstructions',
  component: _import('login/operationalInstructions'),
  hidden: true
},
{
  path: '/authredirect',
  component: _import('login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: _import('errorPage/404'),
  hidden: true
},
{
  path: '',
  component: Layout,
  // redirect: 'dashboard',
  redirect: '/adminM/userGroupM/userGroup/userGroup',
  children: [{
    // path: 'dashboard',
    // component: _import('dashboard/index'),
    path: 'adminM/userGroupM/userGroup/userGroup',
    component: _import('adminM/userGroupM/userGroup/userGroup'),
    name: 'dashboard',
    meta: {
      title: 'dashboard',
      // icon: 'dashboard',
      noCache: true
    }
  }]
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {// 管理权限
    path: '/adminM',
    component: Layout,
    // redirect: '/adminM/schoolM/schoolM',
    name: 'adminM',
    // hasLink: true,
    meta: {
      title: 'adminM',
      // icon: 'user',
      role: ['institution', 'role', 'user']
    },
    children: [
      {
        path: 'schoolM',
        component: _import('adminM/schoolM/schoolM'),
        name: 'schoolM',
        meta: {
          title: 'schoolM',
          role: ['institution']
        }
      },
      {
        path: '/userGroupM',
        component: _import('adminM/userGroupM/userGroupM'),
        // name: 'userGroupM',
        meta: {
          // title: 'userGroupM',
          role: ['role']
        },
        children: [
          {
            path: 'userGroupM/userGroup',
            component: _import('adminM/userGroupM/userGroup/userGroup'),
            name: 'userGroup',
            meta: {
              title: 'userGroup',
              role: ['role']
            }
          }
        ]
      },
      // {
      //   path: 'userGroupM/userGroup',
      //   component: _import('adminM/userGroupM/userGroup/userGroup'),
      //   name: 'userGroup',
      //   meta: {
      //     title: 'userGroup',
      //     role: ['role']
      //   }
      // },
      // {
      //   path: 'userGroup/userGroup',
      //   component: _import('adminM/userGroup/userGroup'),
      //   name: 'userGroup',
      //   meta: {
      //     title: 'userGroup',
      //     role: ['role']
      //   }
      // },
      {
        path: 'userM/userM',
        component: _import('adminM/userM/userM'),
        name: 'userM',
        meta: {
          title: 'userM',
          role: ['user']
        }
      }
    ]
  },
  {// 学校基本管理   semester
    path: '/schoolSettingM',
    component: Layout,
    // redirect: '/schoolSettingM/semesterM/semesterM',
    name: 'schoolSettingM',
    meta: {
      title: 'schoolSettingM',
      // icon: 'user',
      role: ['semester', 'classroom', 'grade', 'class', 'category']
    },
    children: [
      {
        path: 'semesterM/semesterM',
        component: _import('schoolSettingM/semesterM/semesterM'),
        name: 'semesterM',
        meta: {
          title: 'semesterM',
          role: ['semester']
        }
      }, {
        path: 'gradeM/gradeM',
        component: _import('schoolSettingM/gradeM/gradeM'),
        name: 'gradeM',
        meta: {
          title: 'gradeM',
          role: ['grade']
        }
      }, {
        path: 'classroomM/classroomM',
        component: _import('schoolSettingM/classroomM/classroomM'),
        name: 'classroomM',
        meta: {
          title: 'classroomM',
          role: ['classroom']
        }
      }, {
        path: '/classM',
        component: _import('schoolSettingM/classM/classM'),
        redirect: '/classM/classList/classList',
        name: 'classM',
        meta: {
          title: 'classM',
          role: ['class', 'category']
        },
        children: [
          // {
          //   path: 'classTypeM/classTypeM',
          //   component: _import('schoolSettingM/classM/classTypeM/classTypeM'),
          //   name: 'classTypeM',
          //   meta: {
          //     title: 'classTypeM',
          //     role: ['category']
          //   }
          // },
          {
            path: 'classList/classList',
            component: _import('schoolSettingM/classM/classList/classList'),
            name: 'classList',
            meta: {
              title: 'classList',
              role: ['class']
            }
          }
        ]
      }
    ]
  },
  { // 信息管理
    path: '/informationM',
    component: Layout,
    // redirect: '/informationM/roleM/roleM',
    name: 'informationM',
    meta: {
      title: 'informationM',
      // icon: 'people',
      role: ['dict', 'teacher', 'student']
    },
    children: [
      // {
      //   path: 'roleM/roleM',
      //   component: _import('informationM/roleM/roleM'),
      //   name: 'roleM',
      //   meta: {
      //     title: 'roleM',
      //     role: ['dict']
      //   }
      // },
      {
        path: 'teacherM/teacherM',
        component: _import('informationM/teacherM/teacherM'),
        name: 'teacherM',
        meta: {
          title: 'teacherM',
          role: ['teacher']
        }
      },
      {
        path: 'studentM/studentM',
        component: _import('informationM/studentM/studentM'),
        name: 'studentM',
        meta: {
          title: 'studentM',
          role: ['student']
        }
      },
      // {
      //   path: 'studentM/stuAdd',
      //   component: _import('informationM/studentM/stuAdd'),
      //   name: 'stuAdd',
      //   meta: {
      //     title: 'stuAdd',
      //     role: ['student']
      //   }
      // }
    ]
  },
  {// 学校课程管理
    path: '/schoolCourseM',
    component: Layout,
    // redirect: '/schoolCourseM',
    name: 'schoolCourseM',
    meta: {
      title: 'schoolCourseM',
      // icon: 'user',
      role: ['course', 'category', 'details', 'ability', 'abilityCategory']
    },
    children: [
      // {
      //   path: 'courseCategoryM/courseCategoryM',
      //   component: _import('schoolCourseM/courseCategoryM/courseCategoryM'),
      //   name: 'courseCategoryM',
      //   meta: {
      //     title: 'courseCategoryM',
      //     role: ['category']
      //   }
      // }, {
      //   path: 'courseTypeM/courseTypeM',
      //   component: _import('schoolCourseM/courseTypeM/courseTypeM'),
      //   name: 'courseTypeM',
      //   meta: {
      //     title: 'courseTypeM',
      //     role: ['category']
      //   }
      // },
      {
        path: '/courseM',
        component: _import('schoolCourseM/courseM/courseM'),
        name: 'courseM',
        meta: {
          title: 'courseM',
          role: ['course']
        },
        children: [
          {
            path: 'courseList/courseList',
            component: _import('schoolCourseM/courseM/courseList/courseList'),
            name: 'courseList',
            meta: {
              title: 'courseList',
              role: ['course']
            }
          }
        ]
      }, 
      // {
      //   path: 'abilityClassifyListM/abilityClassifyListM',
      //   component: _import('schoolCourseM/abilityClassifyListM/abilityClassifyListM'),
      //   name: 'abilityClassifyListM',
      //   meta: {
      //     title: 'abilityClassifyListM',
      //     role: ['abilityCategory']
      //   }
      // },
      {
        path: 'addAbilityListM/addAbilityListM',
        component: _import('schoolCourseM/addAbilityListM/addAbilityListM'),
        name: 'addAbilityListM',
        meta: {
          title: 'addAbilityListM',
          role: ['ability']
        }
      },{
        path: 'courseAuditM/courseAuditM',
        component: _import('schoolCourseM/courseAuditM/courseAuditM'),
        name: 'courseAuditM',
        meta: {
          title: 'courseAuditM'
        // role: ['institution']
        }
      },
      {
        path: 'classPerformanceM/classPerformanceM',
        component: _import('schoolCourseM/classPerformanceM/classPerformanceM'),
        name: 'classPerformanceM',
        meta: {
          title: 'classPerformanceM'
        // role: ['institution']
        }
      }, {
        path: 'learnDetailM/learnDetailM',
        component: _import('schoolCourseM/learnDetailM/learnDetailM'),
        name: 'learnDetailM',
        meta: {
          title: 'learnDetailM',
          role: ['details']
        }
      }, {
        path: 'teacherAssessM/teacherAssessM',
        component: _import('schoolCourseM/teacherAssessM/teacherAssessM'),
        name: 'teacherAssessM',
        meta: {
          title: 'teacherAssessM'
        }
      },
      // {
      //   path: 'studentAssessM/studentAssessM',
      //   component: _import('schoolCourseM/studentAssessM/studentAssessM'),
      //   name: 'studentAssessM',
      //   meta: {
      //     title: 'studentAssessM'
      //   }
      // },

    ]
  },
  {// 成绩管理  markList
    path: '/markM',
    component: Layout,
    name: 'markM',
    meta: {
      title: 'markM',
      // icon: 'user',
      role: ['score']
    },
    children: [{
      path: 'examM/examM',
      component: _import('markM/examM/examM'),
      name: 'examM',
      meta: {
        title: 'examM',
        role: ['score']
      }
    }, {
      path: 'markList/markList',
      component: _import('markM/markList/markList'),
      name: 'markList',
      meta: {
        title: 'markList',
        role: ['score']
      }
    }, 
    // {
    //   path: 'epqList/epqList',
    //   component: _import('markM/epqList/epqList'),
    //   name: 'epqList',
    //   meta: {
    //     title: 'epqList',
    //     role: ['score']
    //   }
    // }
  ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
