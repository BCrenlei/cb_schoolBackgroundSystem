<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('teacher:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.userName)">
      </el-table-column>

      <el-table-column width="65px" align="center" :label="$t('list.sex')" prop="sex">
        <template slot-scope="scope">
          <span>{{scope.row.sex | sexFilter}}</span>
        </template>
      </el-table-column>

            <el-table-column width="150px" align="center" :label="$t('list.userGroup')" prop="roleName">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.grade')" prop="teachingGrade">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.professorsCourses')" :prop="renderlanguage(l_params.teachingCourses)">
      </el-table-column>

            <el-table-column width="150px" align="center" :label="$t('list.phoneNumber')" prop="phone">
      </el-table-column>

            <el-table-column width="180px" align="center" :label="$t('list.email')" prop="email">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.workingState')" prop="jobStatus">
        <template slot-scope="scope">
          <span>{{scope.row.jobStatus | statusFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('teacher:update') ||g_hasPerm('teacher:delete') ">
        <template slot-scope="scope">
          <el-button v-if="g_hasPerm('teacher:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('teacher:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="temp" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.name')" prop="userName">
          <el-input v-model="temp.userName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.nameEn')" prop="userNameEn">
          <el-input v-model="temp.userNameEn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.nickName')" prop="nickName">
          <el-input v-model="temp.nickName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.sex')" prop="sex">
          <el-select v-model="temp.sex">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.phoneNumber')" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.password')" prop="password">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>

        <!-- <el-form-item :label="$t('new.role')" prop="dictId">
          <el-select v-model="temp.dictId" @change="onDictChange">
            <el-option v-for="item in  roleOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        
        <el-form-item :label="$t('new.userGroup')" prop="roleId">
          <el-select  v-model="temp.roleId">
            <el-option v-for="item in  userGOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.workingState')" prop="jobStatus">
          <el-select v-model="temp.jobStatus">
            <el-option v-for="item in wolkingStatusOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.grade')" prop="teachingGradeId">
          <el-select v-model="temp.teachingGradeId" @change="onGradeChange">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.professorsCourses')" prop="teachingCoursesId">
          <el-select v-model="temp.teachingCoursesId" @change="onCourseChange">
            <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.email')" prop="email">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.intro')" prop="introduceMyself">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}"  v-model="temp.introduceMyself"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.headPortrait')" prop="icon">
          <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList" :show-file-list="true" :limit="1" list-type="picture-card" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload" :data="form">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import {
  listTeacherUser,
  addTeacherUser,
  updateTeacherUser,
  deleteTeacherUser,
  listDict
} from '@/api/schoolMembersM'
import { listRole } from '@/api/roles' // 用户组
import { listSysGrade } from '@/api/schoolSettingM'
import { selectCourse, getToken } from '@/api/common'
// test
import moment from 'moment'
import { validateEmail, validatePhone } from '@/utils/validate'
export default {
  name: 'teacherM',
  computed: {
    ...mapGetters([
      'teachingGradeId',
      'teachingCoursesId'
    ])
  },
  directives: {
    waves
  },

  data() {
    const isValidateEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(
          this.$message({
            message: '请输入正确的邮箱',
            type: 'warning'
          })
        )
      } else {
        callback()
      }
    }
    const isValidatePhone = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(
          this.$message({
            message: '请输入正确的号码',
            type: 'warning'
          })
        )
      } else {
        callback()
      }
    }
    return {
      l_params: {
        // 中英文 属性
        userName: 'p.userName',
        teachingCourses: 'p.teachingCourses'
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageRow: 20
      },

      roleOptions: [], // 角色
      userGOptions: [], // 用户组
      wolkingStatusOption: [
        // 在职状态
        {
          value: '1',
          label: '在职'
        },
        {
          value: '2',
          label: '离职'
        }
      ],
      gradeOptions: [], // 年级
      courseOptions: [], // 课程
      sexOptions: [
        { value: '0', label: this.renderlanguage('new.male') },
        { value: '1', label: this.renderlanguage('new.female') }
      ],

      temp: {
        id: '',
        roleId: '',
        userName: '',
        userNameEn: '',
        phone: '',
        password: '',
        nickName: '',
        nickNameEn: '',
        icon: '',
        email: '',
        jobStatus: '',
        dictId: '',
        dictName: '',
        teachingCoursesId: '',
        teachingCourses: '',
        teachingCoursesEn: '',
        teachingGradeId: '',
        introduceMyself: ''
      },

      // 缺少必填参数:userName  userNameEn  phone  password  nickName  nickNameEn  icon  email  dictId  teachingCoursesId  teachingCourses  teachingCoursesEn  teachingGradeId"
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        userName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        userNameEn: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '必填项', type: Number, trigger: 'blur', validator: isValidatePhone }],
        password: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        dictId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        jobStatus: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        // teachingGradeId: [
        //   { required: true, message: '必填项', trigger: 'change' }
        // ],
        roleId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        // teachingCoursesId: [
        //   { required: true, message: '必填项', trigger: 'change' }
        // ],
        email: [{ required: true, message: '必填项', trigger: 'blur', validator: isValidateEmail }],
        intro: [{ required: true, message: '必填项', trigger: 'blur' }],
        icon: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      // update file

      // test
      isUploadShow: false,
      supportWebp: false,
      upToken: '',
      bucketHost: '',
      key: '',
      token: '',
      address: '',
      updateIcon: '',
      form: {},

      listObj: {},
      fileList: []
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': '在职',
        '2': '离职'
      }
      return statusMap[status]
    },
    sexFilter(status) {
      const statusMap = {
        '0': '男',
        '1': '女'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    renderlanguage(string) {
      return this.$t(string)
    },
    getList() {
      this.listLoading = true
      listTeacherUser(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },
    getUserGList() {
      this.userGOptions = []
      listRole().then(response => {
        const arr = response.list
        for (var i = 0; i < arr.length; i++) {
          var ele = arr[i]
          const e = {
            value: ele.roleId,
            label: ele.roleName
          }
          this.userGOptions.push(e)
        }
      })
    },
    getIndex($index) {
      // 表格序号
      return (
        (this.listQuery.pageNum - 1) * this.listQuery.pageRow +
                $index +
                1
      )
    },

    handleCurrentChange(val) {
      // 改变页码
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      // 改变每页数量
      this.listQuery.pageRow = val
      this.getList()
    },

    getStatus(val) {
      return this.jobStatus[val.jobStatus]
    },
    resetTemp() {
      this.temp = {
        roleId: '',
        userName: '',
        userNameEn: '',
        phone: '',
        sex: '',
        password: '',
        nickName: '',
        nickNameEn: '',
        icon: '',
        email: '',
        jobStatus: '',
        dictId: '',
        dictName: '',
        teachingCoursesId: '',
        teachingCourses: '',
        teachingCoursesEn: '',
        teachingGradeId: '',
        introduceMyself: ''
      }
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        roleId: item.roleId,
        userName: item.userName,
        userNameEn: item.userNameEn,
        phone: item.phone,
        sex: item.sex,
        password: item.password,
        nickName: item.nickName,
        nickNameEn: item.nickNameEn,
        icon: item.icon,
        email: item.email,
        jobStatus: item.jobStatus,
        dictId: item.dictId,
        dictName: item.dictName,
        teachingCoursesId: item.teachingCoursesId,
        teachingCourses: item.teachingCourses,
        teachingCoursesEn: item.teachingCoursesEn,
        teachingGradeId: item.teachingGradeId,
        introduceMyself: item.introduceMyself
      }
    },
    // 添加 的时候 下拉框 需要的参数
    configAddOptions() {
      this.getUserGList()
      // 配置角色
      this.roleOptions = []
      listDict().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id + '',
            label: element.dictName
          }
          this.roleOptions.push(e)
        }
      })

      // 配置年级
      this.gradeOptions = []
      listSysGrade().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id,
            label: element.gradeName
          }
          this.gradeOptions.push(e)
        }
      })
    },
    // 编辑 的时候 下拉框 需要的参数
    configEditOptions() {
      // 配置角色 和 年级
      this.configAddOptions()
      // 配置 年级对应的课程
      this.courseOptions = []
      if (this.temp.teachingGradeId != null) {
        const params = { gradeId: this.temp.teachingGradeId }
        selectCourse(params).then(res => {
          for (var i = 0; i < res.length; i++) {
            var element = res[i]
            const e = {
              value: element.id + '',
              label: element.courseName
            }
            this.courseOptions.push(e)
          }
        })
      }
    },

    // 改动角色
    onDictChange(id) {
      let obj = {}
      obj = this.roleOptions.find(item => {
        if (item.value === id) {
          return true
        }
      })
      this.temp.dictName = obj.label
    },
    // 改动年级
    onGradeChange(id) {
      // 清空课程
      this.courseOptions = []
      this.temp.teachingCoursesId = ''
      this.temp.teachingCourses = ''
      this.temp.teachingCoursesEn = ''

      // 根据年级找课程
      const params = { gradeId: id }
      selectCourse(params).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id,
            label: element.courseName,
            labelEn: element.courseNameEn
          }
          this.courseOptions.push(e)
        }
      })
    },
    // 改动课程
    onCourseChange(id) {
      if (id !== '') {
        let obj = {}
        obj = this.courseOptions.find(item => {
          if (item.value === id) {
            return true
          }
        })
        this.temp.teachingCourses = obj.label
        this.temp.teachingCoursesEn = obj.labelEn
      }
    },
    // 添加 界面出来
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
        // clean image cache
        this.$refs.upload.clearFiles()
        this.iconAddress = ''
      })

      this.configAddOptions()
    },

    createData() {
      var iconAddress = this.address + this.updateIcon
      if (iconAddress) {
        this.temp.icon = iconAddress
      }
      this.$refs['temp'].validate(valid => {
        if (valid) {
          console.log(this.temp)
          addTeacherUser(this.temp).then(() => {
            // 更新list
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('msg.success'),
              message: this.$t('msg.createSuccess'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑 界面出来
    handleUpdate(row) {
      this.configTemp(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })

      this.configEditOptions()
      // icon
      this.fileList = []
      const e = {
        // value: element.id,
        // label: element.courseName,
        // labelEn: element.courseNameEn
        url: row.icon
      }
      this.fileList.push(e)
    },
    updateData() {
      // update icon
      var iconAddress = this.address + this.updateIcon
      if (iconAddress) {
        this.temp.icon = iconAddress
      }
      this.$refs['temp'].validate(valid => {
        if (valid) {
          updateTeacherUser(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('msg.success'),
              message: this.$t('msg.updateSuccess'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, val) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          id: val.id
        }
        deleteTeacherUser(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    },
    // update file
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      this.updateIcon = response.key
    },
    handleRemove() {},
    handlePreview(file) {},
    handleError(err, response, file) {
      console.log('----handleError')
      if (err.status === 401) {
        this.$message.error('图片上传失败，请求中未附带Token')
      } else {
        this.$message.error(JSON.stringify(err))
      }
    },
    beforeUpload(file) {
      const curr = moment()
        .format('YYYYMMDD')
        .toString()
      const prefix = moment(file.lastModified)
        .format('HHmmss')
        .toString()
      const suffix = file.name
      const key = encodeURI(`${curr}${prefix}`)
      return getToken().then(response => {
        this.address = response.address
        this.token = response.token
        this.form = {
          key,
          token: this.token
        }
      })
    }
  }
}
</script>





