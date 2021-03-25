<template>
  <div class="app-container calendar-list-container">

    <div v-if="configAdd()" class="filter-container">
      <el-button v-if="g_hasPerm('details:add')"  class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleAllList" type="primary">{{$t('operate.allList')}}</el-button>
      <el-button  class="filter-item" style="margin-left: 10px;" @click="handleMyList" type="primary">{{$t('operate.myList')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.name')" prop="studentName">
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('list.grade')" prop="gradeName">
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('list.class')" prop="className">
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('list.courseSort')" prop="categoryName">
      </el-table-column>
      <el-table-column width="220px" align="center" :label="$t('list.course')" prop="courseName">
      </el-table-column>
      <el-table-column show-overflow-tooltip width="210px" align="center" :label="$t('new.photo')" prop="imageUrl">
        <template slot-scope="scope">
          <img style=" display: inline-block; height: auto;max-width: 100%;"  :src="scope.row.imageUrl" alt="">
          </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('list.createTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="configAdd()" align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button v-if="g_hasPerm('details:update')&&configOperation(scope.row)" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('details:delete')&&configOperation(scope.row)" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
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
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('list.courseSort')" prop="categoryName">
          <el-select v-model="temp.categoryId"  :disabled="teachingCoursesId!=''" @change="onCategoryChange" placeholder="请选择">
            <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.grade')" prop="grade">
          <el-select v-model="temp.gradeId" :disabled="teachingGradeId!=''" @change="onGradeChange" placeholder="请选择">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('list.course')" prop="course">
          <el-select v-model="temp.courseId" :disabled="teachingCoursesId!=''" @change="onCourseChange" placeholder="请选择">
            <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.class')" prop="workingState">
          <el-select v-model="temp.classId" @change="onClassChange" placeholder="请选择">
            <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.student')" prop="workingState">
          <el-select v-model="temp.userId" placeholder="请选择">
            <el-option v-for="item in studentOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.photo')" prop="photo">
          <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="true" :file-list="fileList" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove" :on-success="handleSuccess" :on-exceed="handleFileLimit" :before-upload="beforeUpload" :data="form">
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
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { listSysGrade } from '@/api/schoolSettingM'
import {
  listLearningDetails,
  myLearningDetails,
  addLearningDetails,
  updateLearningDetails,
  deleteLearningDetails
} from '@/api/learnDetailM'
import {
  listNewCategory,
  selectClass,
  selectStudentByClassId,
  selectUserApplyById,
  selectCourseByGradeId,
  getToken
} from '@/api/common'
// file update
import moment from 'moment'
import { listCourseAll } from '@/api/schoolCourseM'

export default {
  name: 'userM',
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
    return {
      l_params: {
        // 中英文 属性
        username: 'p.userName',
        teachingCourses: 'p.teachingCourses',
        studentName: 'p.studentName',
        gradeName: 'p.gradeName',
        className: 'p.className',
        detail: 'p.detail',
        userCourseName: 'p.userCourseName'
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageRow: 20,
        title: undefined
      },
      isGetList: true,

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {},
      temp: {},
      gradeOptions: [],
      classOptions: [],
      studentOptions: [],
      courseOptions: [],
      sortOptions: [],
      classParams: {
        classId: '',
        courseId: ''
      },
      courseParams: {
        gradeId: '',
        categoryId: ''
      },
      studentParmes: {
        classId: ''
      },
      startTime: '',
      endTime: '',
      reason: '',
      // file update
      token: '',
      form: {},
      address: '',
      listObj: {},
      fileList: [],
      imageUrl: '',
      updateImage: {
        id: '',
        imageUrl: ''
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': 'waiting',
        '1': '在职',
        '2': '离职'
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
    getIndex($index) {
      return (
        (this.listQuery.pageNum - 1) * this.listQuery.pageRow +
                $index +
                1
      )
    },
    getStatus(val) {
      return this.jobStatus[val.jobStatus]
    },
    getList() {
      this.isGetList = true
      this.listLoading = true
      listLearningDetails(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      // 改变每页数量
      this.listQuery.pageRow = val
      this.getList()
    },
    handleCurrentChange(val) {
      // 改变页码
      this.listQuery.pageNum = val
      this.getList()
    },
    handleAllList() {
      this.listQuery = {
        pageNum: 1,
        pageRow: 20
      }
      this.getList()
    },
    handleMyList() {
      this.isGetList = false
      this.listQuery = {
        pageNum: 1,
        pageRow: 20
      }
      this.listLoading = true
      myLearningDetails(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },
    getTrueList() {
      if (this.isGetList) {
        this.getList()
      } else {
        this.handleMyList()
      }
    },
    configAdd() {
      var judge = false
      if (this.teachingGradeId != '' && this.teachingCoursesId != '') {
        judge = true
      }
      return judge
    },
    configOperation(row) {
      var judge = false
      if (this.teachingGradeId == '' && this.teachingCoursesId == '') {
        judge = true
      }
      if (this.teachingGradeId != '' && this.teachingCoursesId == '') {
        if (row.gradeId == this.teachingGradeId) {
          judge = true
        }
      }
      if (this.teachingGradeId != '' && this.teachingCoursesId != '') {
        if (row.gradeId == this.teachingGradeId && row.courseId == this.teachingCoursesId) {
          judge = true
        }
      }
      return judge
    },
    configPermission() {
      // 配置年级
      this.gradeOptions = []
      listSysGrade().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id + '',
            label: element.gradeName
          }
          this.gradeOptions.push(e)
        }
      })
      // 分类
      this.sortOptions = []
      const p = {
        module: '4'
      }
      listNewCategory(p).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id,
            label: element.typeName
          }
          this.sortOptions.push(e)
        }
      })
      if (this.teachingGradeId != '') {
        this.temp.gradeId = this.teachingGradeId

        this.classOptions = []
        const p = {
          gradeId: this.temp.gradeId
        }
        selectClass(p).then(res => {
          for (var i = 0; i < res.length; i++) {
            var element = res[i]
            const e = {
              value: element.id,
              label: element.className,
              labelEn: element.classNameEn
            }
            this.classOptions.push(e)
          }
        })
      }
      if (this.teachingCoursesId != '') {
        this.temp.courseId = this.teachingCoursesId

        this.courseOptions = []
        listCourseAll().then(res => {
          for (var i = 0; i < res.length; i++) {
            var element = res[i]
            const e = {
              value: element.id + '',
              label: element.courseName,
              labelEn: element.courseNameEn,
              courseTypeId: element.courseTypeId
            }
            this.courseOptions.push(e)
            if (element.id + '' == this.teachingCoursesId) {
              this.temp.categoryId = element.categoryId
            }
          }
        })
      }
    },
    // controller
    resetTemp() {
      this.temp = {
        userId: '',
        gradeId: '',
        classId: '',
        courseId: '',
        imageUrl: '',
        categoryId: ''
      }
      this.fileList = []
    },
    onCategoryChange() {},
    onGradeChange() {},
    onCourseChange() {},
    onClassChange() {
      this.studentOptions = []
      this.classParams.classId = this.temp.classId
      this.classParams.courseId = this.temp.courseId
      // this.courseParams.categoryId = this.temp.categoryId;
      selectUserApplyById(this.classParams).then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id,
            label: element.userName,
            labelEn: element.userNameEn
          }
          this.studentOptions.push(e)
        }
      })
    },
    configAddOptions() {
      this.configPermission()
    },
    configEditOptions(row) {
      this.configPermission()
    },
    // add button,show add view
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.configAddOptions()
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        userId: item.userId,
        gradeId: item.gradeId,
        classId: item.classId,
        courseId: item.courseId,
        imageUrl: item.imageUrl,
        categoryId: item.categoryId
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(valid)
          addLearningDetails(this.temp).then(() => {
            this.getTrueList()
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
    updateData() {
      updateLearningDetails(this.updateImage).then(() => {
        this.getTrueList()
        this.dialogFormVisible = false
        this.$notify({
          title: this.$t('msg.success'),
          message: this.$t('msg.updateSuccess'),
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row, val) {
      this.configTemp(row)
      this.fileList = []
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.updateImage.id = row.id
      var tempList = []
      tempList = row.imageUrl.split(';')
      for (var i = 0; i < tempList.length; i++) {
        if (tempList[i] != '') {
          const e = {
            url: tempList[i]
          }
          this.fileList.push(e)
        }
      }

      this.configEditOptions()
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
        deleteLearningDetails(params)
          .then(() => {
            _vue.getTrueList()
          })
          .catch(e => {})
      })
    },

    // file update
    // update file
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      this.updateIcon = response.key
      this.updateImage.imageUrl = ''
      for (var i = 0; i < fileList.length; i++) {
        const element = fileList[i]

        if (i === fileList.length - 1) {
          if (element.hasOwnProperty('name')) {
            this.updateImage.imageUrl +=
                            this.address + element.response.key
          } else {
            this.updateImage.imageUrl += element.url
          }
        } else {
          if (element.hasOwnProperty('name')) {
            this.updateImage.imageUrl +=
                            this.address + element.response.key + ';'
          } else {
            this.updateImage.imageUrl += element.url + ';'
          }
        }
      }
      this.temp.imageUrl = this.updateImage.imageUrl
    },
    handleFileLimit(files, fileList) {},
    handleRemove(file, fileList) {
      this.updateImage.imageUrl = ''
      for (var i = 0; i < fileList.length; i++) {
        const element = fileList[i]
        if (i === fileList.length - 1) {
          if (element.hasOwnProperty('name')) {
            this.updateImage.imageUrl +=
                            this.address + element.response.key
          } else {
            this.updateImage.imageUrl += element.url
          }
        } else {
          if (element.hasOwnProperty('name')) {
            this.updateImage.imageUrl +=
                            this.address + element.response.key + ';'
          } else {
            this.updateImage.imageUrl += element.url + ';'
          }
        }
      }
      this.temp.imageUrl = this.updateImage.imageUrl
    },
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
      // let suffix = file.name
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