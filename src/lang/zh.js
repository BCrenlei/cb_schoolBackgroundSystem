export default {
  route: {
    dashboard: '首页',

    adminM: '权限管理',
    schoolM: '学校管理',
    userGroup: '身份权限',
    userM: '用户管理',
    roleM: '职称管理',
    teacherM: '老师管理',

    informationM: '信息管理',
    studentM: '学生管理',
    stuAdd: '新增学生',

    schoolSettingM: '学校管理',
    semesterM: '学期管理',
    classroomM: '教室管理',
    classM: '班级管理',
    classList: '班级列表',
    classTypeM: '班级类型管理',
    gradeM: '年级管理',
    deptM: '部门管理',

    schoolCourseM: '课程管理',
    courseM: '课程管理',
    courseList: '课程列表',
    courseCategoryM: '课程分类管理',
    courseTypeM: '课程类型管理',
    classPerformanceM: '课堂表现管理',
    learnDetailM: '学习详情管理',
    assessM: '课程评语感悟管理',
    assessTeacher: '评语感悟管理',
    assessStudent: '学生感悟管理',
    courseAuditM: '课程报名管理',
    // teacherAssessM: '评语感悟管理',
    teacherAssessM: '评语及感悟',
    
    studentAssessM: '学生感悟管理',
    abilityClassifyListM: '能力分类列表',
    addAbilityListM: '六艺分类',
    commentM: '评论管理',

    markM: '成绩管理',
    markList: '成绩列表',
    epqList: 'EPQ列表',
    examM: '考试管理'
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    screenfull: '全屏'
  },
  login: {
    title: '新六艺核心素养-成长能力档案管理系统',
    enter: '进入官网',
    understand: '了解六艺',
    logIn: '登录',
    username: '账号',
    password: '密码'
  },
  list: {
    id: '序号',
    status: '状态',
    // 新闻
    title: '标题',
    classification: '类别',
    reviews: '阅读数',
    comments: '评论数',
    repost: '转发量',
    author: '作者',
    createTime: '创建时间',

    // 图片
    photo: '照片',
    photoName: '图片名称',
    link: '链接地址',
    photoSrc: '照片路径',
    schoolLogo: '学校Logo',

    order: '排序',

    // 学校管理
    type: '分类',
    school: '学校',
    city: '城市',
    address: '地址',
    intro: '简介',
    hotline: '热线',
    logo: 'Logo',
    admin: '管理员账号',
    adminNickName: '管理员昵称',
    adminPhone: '管理员号码',
    schoolAddress: '学校地址',
    detailedAddress: '街道详情',
    schoolNameEn: '学校英文名',
    detailedAddressEn: '地址详情英文',
    password: '密码',

    // 用户组管理 用户 角色
    userGroupName: '用户组名称',
    menu: '菜单&权限',
    list: '列表',
    userGroup: '身份',
    addSchool: '添加学校',

    // 学校人员管理
    phoneNumber: '手机号',
    sex: '性别',
    role: '职称',
    roleName: '职称',
    professorsCourses: '教授课程',
    registerTime: '注册时间',
    nickName: '昵称',
    class: '班级',
    workingState: '在职状态',
    email: '邮箱',

    entranceTime: '入学时间',
    graduationTime: '毕业时间',

    // 学校基本设置
    year: '学期年份',
    semesterName: '学期名称',
    semesterTime: '学期时间',

    classroomName: '教室名称',
    classroomType: '教室类型',
    seating: '座位数',
    containClass: '容纳班级数',

    gradeName: '年级',
    className: '班级名称',
    classroom: '教室',
    stuNum: '学生数量',
    headmaster: '班主任',
    teachers: '任课老师',

    classType: '班级类型',
    classFixed: '教室是否固定',

    // 年级设置
    grade: '年级',
    course: '课程',
    courseSort: '课程分类',
    courseSortName: '课程分类名称',
    courseType: '课程类型',
    courseTypeName: '课程类型',
    score: '分值',
    examinationName: '考试名称',
    enrollmentTime: '报名时间',
    level: '等级',
    courseName: '课程名称',
    period: '课时',
    content: '内容',
    periodName: '课时名称',
    courseware: '课件',

    // 学校课程管理
    courseHour: '课时',
    coursePrice: '价格',
    courseRefPrice: '优惠价',
    homework: '作业',

    // 成绩管理
    examName: '考试名称',
    examTime: '考试时间',

    calculationRules: '课程分数计算规则',
    calculationRatio: '计算比例',
    conversionRules: '分数显示转换规则',
    startValue: '开始值',
    endValue: '结束值',

    // 课程评语感悟管理
    teacherComment: '老师评语',
    studentFeedback: '学生感悟',

    // 学校活动管理
    activityName: '活动名称',
    publisher: '发布者',
    activityAttendance: '活动人数',
    numberOfApplicants: '报名人数',
    activityCategory: '活动类型',

    // 活动报名管理
    fee: '活动费用',
    payment: '支付方式',

    // 评论管理
    commentDetails: '评论详情',
    reviewer: '评论者',
    // Attendance
    attendance: '考勤',
    lessons: '课节',
    // assess
    name: '姓名',
    announceTime: '发表时间',
    // course
    price: '价格',
    discountPrice: '优惠价',
    reason: '事由',

    // 能力模块
    categoryName: '六艺分类',
    capabilityName: '能力名称',
    abilityName: '能力分类名称',

    time: '时间',
    leaveType: '请假类型',

    // 评论
    comment: '评论',

    // 校车
    departurePoint: '出发地', destination: '目的地', departureTime: '出发时间', registrationDeadline: '截止时间', personCharge: '负责人', personChargeNumber: '负责人号码', driverName: '司机', driverNumber: '司机号码', licensePlate: '车牌',

    // 合作名校
    schoolName: '学校名称', schoolImg: '学校照片', admissionTime: '入学时间', applicationTime: '申请时间', applicationMaterial: '申请材料', remark: '备注',

    // 申请记录
    enrollCertificate: '录取凭证', applicationDocument: '申请文件', applicationStatus: '申请状态',

    //
    dailyAssessment: '日常考核',

    //
    whetherEpq: 'EPQ课程'
  },

  new: {
    confirm: '确认',
    cancel: '取消',
    require: '必填项',

    // 一级分类 二级分类  请输入内容 请选择  选择日期时间
    primaryCategory: '一级分类',
    secondaryCategory: '二级分类',

    // 新闻 图片 视频
    category: '分类',
    title: '标题',
    // intro: '简介',
    photo: '照片',

    categoryParent: '上级分类',
    categoryName: '六艺分类',
    sort: '排序',
    whetherToShow: '是否显示',
    show: '显示',
    notShow: '不显示',
    categoryPhoto: '分类图片',

    photoName: '图片名称',
    link: '链接地址',

    coverPhoto: '封面图片',
    commentModeration: '评论审核',
    notifyObject: '通知对象',

    // 学校管理
    adminName: '管理员姓名',
    adminPhone: '管理员手机号',
    city: '城市',
    weChat: '微信',
    password: '密码',
    adrress: '地址',
    schoolLogo: '学校Logo',
    customerServicePhone: '客服电话',
    schoolQRCode: '学校二维码',

    // 学校人员管理
    name: '姓名',
    nameEn: '英文名',
    phoneNumber: '手机号',
    nickName: '昵称',
    sex: '性别',
    age: '年龄',
    male: '男',
    female: '女',
    userGroup: '身份',
    role: '职称',
    professorsCourses: '教授课程',
    email: '邮箱',
    headPortrait: '头像',
    workingState: '在职状态',

    currentSchool: '目前所在学校',
    currentGrade: '目前所在年级',
    householRegister: '户籍所在地',
    passport: '护照编号',
    seniorEntranceScore: '中考分数',
    collegeEntranceScore: '高考分数',
    screScore: 'scre分数',
    interest: '兴趣',
    readme: '自述',

    writtenExamScore: '入学成绩',
    examTime: '考试时间',
    admissionGrade: '报读年级',

    fatherName: '父亲',
    fatherPhone: '父亲手机',
    fatherOccupation: '父亲职业',
    fatherMailbox: '父亲邮箱',
    motherName: '母亲',
    motherPhone: '母亲手机',
    motherOccupation: '母亲职业',
    motherMailbox: '母亲邮箱',
    precautions: '简单评价一下你的孩子以及我们需要注意的事项',

    oneInchPhoto: '一寸免冠照片',
    idPhoto: '身份证照片',
    accountPhotos: '常驻户口照片',
    vaccinationRecord: '疫苗接种记录',
    medicalReport: '体检报告',

    parentHouseholRegister: '父母户籍照片',
    parentIdPhoto: '父母身份证照片',
    parentPassport: '父母护照照片',
    otherPhotos: '其他照片',

    grade: '年级',
    class: '班级',
    course: '课程',

    birthday: '出生日期',

    school: '学校',
    schoolEn: '学校英文名',

    hobby: '兴趣爱好',
    hobbyEn: '英文兴趣爱好',
    intro: '简介',
    introEn: '英文简介',

    entranceTime: '入学时间',
    graduationTime: '毕业时间',

    // 学校基本设置
    semesterName: '学期名称',
    startTime: '开始时间',
    to: '至',
    endTime: '结束时间',

    classroomName: '教室名称',
    classroomType: '教室类型',
    seating: '座位数',
    containClass: '容纳班级数',

    classType: '班级类型',
    classFixed: '教室是否固定',

    classroom: '教室',
    className: '班级名称',
    classNameEn: '班级英文名',

    simplename: '部门名',
    simplenameEn: '部门英文名',
    // 年级设置
    gradeName: '年级',
    gradeNameEn: '年级英文名',

    classTeacher: '班主任',
    courseCategory: '课程分类',
    courseType: '课程类型',
    examName: '考试名称',
    examNameEn: '考试英文名',
    student: '学生',
    score: '分值',

    // 成绩设置
    calculationRules: '课程分数计算规则',
    calculationRatio: '计算比例',
    conversionRules: '分数显示转换规则',
    startValue: '开始值',
    endValue: '结束值',

    // 课程表现
    learningState: '学习状态',
    classPerformance: '课堂表现',
    classAttendance: '课堂出勤',

    // 课程
    typeName: '课程分类',
    typeNameEn: '课程分类英文名',
    typeCName: '课程类型',
    typeCNameEn: '课程类型英文名',

    courseName: '课程名称',
    courseNameEn: '课程英文名',
    courseCover: '课程封面',
    coursePlace: '上课地点',
    coursePlaceEn: '上课地点EN',
    courseTime: '课程时间',
    nameOfTeacher: '授课老师',
    detailPicture: '详情图片',
    courseContent: '课程内容',
    courseContentEn: '课程英文内容',
    period: '课时',
    periodName: '课时名称',
    periodIntro: '课时介绍',
    coursePrice: '价格',
    courseRefPrice: '优惠价',
    courseware: '课件',
    homework: '作业',
    dailyAssessment: '日常表现',

    // 课程评语感悟管理
    teacherComment: '老师评语',
    studentFeedback: '学生感悟',

    //
    selfFeeling: '感悟',
    selfFeelingEn: '英文感悟',
    teacherEvaluate: '评价',
    teacherEvaluateEn: '英文评价',

    capabilityName: '能力名称',
    capabilitychrose: '能力选择',
    abilityCategoryName: '能力类别名称',

    // 考勤
    attendance: '考勤',
    time: '时间',
    leaveType: '请假类型',

    // 评论
    comment: '评论',

    admissionTime: '入学时间',
    //
    liEntranceScore: '礼入学成绩', yueEntranceScore: '乐入学成绩', sheEntranceScore: '射入学成绩', yuEntranceScore: '御入学成绩', shuEntranceScore: '书入学成绩', shu1EntranceScore: '数入学成绩', sixArtsSummary: '六艺总结',

    //
    whetherEpq: 'EPQ课程'
  },
  operate: {
    actions: '操作',
    title: '标题',
    normal: '正常',

    search: '搜索',
    add: '添加',
    allList: '全部',
    myList: '我的列表',
    edit: '编辑',
    forbidden: '禁用',
    delete: '删除',
    recommend: '推荐',
    view: '查看',

    viewTwo: '查看下级分类',

    divide: '分班',

    viewStudentFiles: '查看学生档案',
    newStudentFiles: '新增学生档案',

    // classTypeM
    viewStu: '查看学生',
    viewTea: '查看老师',
    addTea: '添加老师',

    viewDept: '部门人员',

    // 学校课程设置
    viewCatalog: '栏目', // 查看 下级目录
    catalog: '目录',

    viewPeriod: '查看课时',
    viewPhoto: '查看照片',

    audit: '审核',

    viewEnroll: '查看报名',
    // assess
    pass: '通过',
    // course
    listManager: '目录管理'
  },
  msg: {
    empty: '暂无数据',
    loading: '给我一点时间',
    success: '成功',
    createSuccess: '创建成功',
    addSuccess: '添加成功',
    updateSuccess: '编辑成功',
    deleteSuccess: '删除成功',

    delete: '确定删除吗?',
    prompt: '提示',
    confirm: '确认',

    startTimePrompt: '开始时间必须小于结束时间',
    endTimePrompt: '结束时间必须大于开始时间',

    classTeacherMsg: '点击选择',

    ctminMsg: '至少选择一名',
    ctmaxMsg: '最多选择一名'

  },

  p: {// 具体接口 中英文 字段
    // 学校管理
    schoolName: 'schoolName', // schoolNameEn
    schoolAddress: 'schoolAddress', // schoolAddressEn
    detailedAddress: 'detailedAddress', // detailedAddressEn
    schoolProfiles: 'schoolProfiles', // schoolProfilesEn
    detailedAddressEn: 'detailedAddressEn', // detailedAddressEn
    schoolNameEn: 'schoolNameEn', // schoolNameEn
    adminPhone: 'adminPhone',

    // 老师管理
    userName: 'userName', // userNameEn
    studentName: 'studentName',
    teachingCourses: 'teachingCourses', // teachingCoursesEn
    // 学生管理
    nowGradeName: 'nowGradeName',
    nowClassName: 'nowClassName',

    school: 'school',

    // 学校基本设置
    gradeName: 'gradeName',
    className: 'className',
    classTeacher: 'classTeacher',
    teacherName: 'teacherName',
    simplename: 'simplename',

    // 学校课程管理
    typeName: 'typeName',
    dictName: 'dictName',

    categoryName: 'categoryName',
    courseName: 'courseName',
    detail: 'detail',
    courseTypeName: 'courseTypeName',
    userCourseName: 'userCourseName',

    // 成绩管理
    examName: 'examName',

    // 新闻管理
    title: 'title',

    // 评语
    teacherEvaluate: 'teacherEvaluate',
    selfFeeling: 'selfFeeling'
  },
  // attendence
  attendenceStatus: {
    one: 'hello'
  },

  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },

  table: {
    actions: '操作'
  }

}
