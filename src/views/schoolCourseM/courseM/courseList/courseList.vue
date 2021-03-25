<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('course:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.courseName')" :prop="renderlanguage(l_params.courseName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.categoryName')" :prop="renderlanguage(l_params.categoryName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.gradeName')" :prop="renderlanguage(l_params.gradeName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.courseHour')" prop="courseHour">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.courseTypeName')" :prop="renderlanguage(l_params.courseTypeName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.whetherEpq')" prop="whetherEpq">
        <template slot-scope="scope">
          <span>{{scope.row.whetherEpq | statusEPQFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.coursePrice')" prop="coursePrice">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.courseRefPrice')" prop="courseRefPrice">
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="300" class-name="small-padding fixed-width" v-if="g_hasPerm('course:update') ||g_hasPerm('course:delete') ">
        <template slot-scope="scope">

          <!-- <router-link :to="{path:'/courseM/catalogM/catalogM',query: {courseId: scope.row.id}}">
            <el-button type="primary" icon="edit">{{$t('operate.catalog')}}
            </el-button>
          </router-link> -->
          <el-button type="primary" icon="edit" @click="handlePeriod(scope.row)">{{$t('operate.viewPeriod')}}
          </el-button>
          <el-button v-if="g_hasPerm('course:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('course:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="temp" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.courseCategory')" prop="categoryId">
          <el-select v-model="temp.categoryId">
            <el-option v-for="item in  categoryOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.courseType')" prop="courseTypeId">
          <el-select v-model="temp.courseTypeId">
            <el-option v-for="item in  courseTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.courseName')" prop="courseName">
          <el-input v-model="temp.courseName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.courseNameEn')" prop="courseNameEn">
          <el-input v-model="temp.courseNameEn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.courseCover')" prop="coursePage">
          <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList3" :show-file-list="true" :limit="1" list-type="picture-card" :on-remove="handleRemove3" :on-success="handleSuccess3" :before-upload="beforeUpload2" :data="form2">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('new.whetherEpq')" prop="inMenu">
          <el-switch v-model="temp.whetherEpq"  active-value="1" inactive-value="0"></el-switch>
        </el-form-item>

        <el-form-item :label="$t('new.grade')" prop="gradeId">
          <el-select v-model="temp.gradeId">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.score')" prop="courseScore">
          <el-input v-model="temp.courseScore"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.courseTime')" prop="tempTime">
          <el-date-picker v-model="tempTime" type="daterange" :range-separator="$t('new.to')" :start-placeholder="$t('new.startTime')" :end-placeholder="$t('new.endTime')" value-format="yyyy/MM/dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('new.coursePlace')" prop="classAddress">
          <el-input v-model="temp.classAddress"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.coursePlaceEn')" prop="classAddressEn">
          <el-input v-model="temp.classAddressEn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.nameOfTeacher')" prop="teacherId">
          <el-select v-model="temp.teacherId">
            <el-option v-for="item in teaOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.detailPicture')" prop="detailPicture">
          <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList4" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove4" :on-success="handleSuccess4" :before-upload="beforeUpload3" :data="form2">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('new.period')" prop="courseHour">
          <el-input v-model="temp.courseHour"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.coursePrice')" prop="coursePrice">
          <el-input v-model="temp.coursePrice"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.courseRefPrice')" prop="courseRefPrice">
          <el-input v-model="temp.courseRefPrice"></el-input>
        </el-form-item>

        <el-form-item  :label="$t('new.courseContent')" prop="courseSummary">
          <el-input type="textarea" :maxlength="150"  :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.courseSummary"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.courseContentEn')" prop="courseSummaryEn">
          <el-input type="textarea" :maxlength="150" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.courseSummaryEn"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

    <!-- 课时列表 -->
    <el-dialog width="60%" :visible.sync="dialogPeriodVisible">

      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreatePeriod" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
      </div>

      <el-table :key='tableKey' :data="table" v-loading="tableLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%" show-overflow-tooltip="true">

        <el-table-column align="center" :label="$t('list.id')" width="65">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.periodName')" prop="className">
        </el-table-column>

        <el-table-column show-overflow-tooltip width="220px" align="center" :label="$t('list.content')" prop="classIntroduction">
        </el-table-column>

        <el-table-column show-overflow-tooltip width="150px" align="center" :label="$t('list.courseware')" prop="courseware">
          <template slot-scope="scope">
            <span>{{scope.row.courseware | statusFilter}}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip width="150px" align="center" :label="$t('list.homework')" prop="homework">
          <template slot-scope="scope">
            <span>{{scope.row.homework | statusFilter}}</span>
          </template>
        </el-table-column>

        <el-table-column width="150px" align="center" :label="$t('list.registerTime')" prop="createTime">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" icon="edit" @click="handleUpdatePeriod(scope.row)">{{$t('operate.edit')}}
            </el-button>
            <el-button type="danger" icon="delete" @click="handleDeletePeriod(scope.row)">{{$t('operate.delete')}}
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleTableSizeChange" @current-change="handleTableCurrentChange" :current-page="tableQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="tableQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total_table">
        </el-pagination>
      </div>
    </el-dialog>

    <!-- 新增 编辑课时 -->
    <el-dialog :title="textMap[dialogTableStatus]" :visible.sync="dialogTableVisible">
      <el-form :rules="tableRules" ref="tableTemp" :model="tableTemp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.period')" prop="periodName">
          <el-select v-model="tableTemp.className">
            <el-option v-for="item in classHourOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.periodIntro')" prop="classIntroduction">
          <el-input type="textarea" :maxlength="150" :autosize="{ minRows: 2, maxRows: 6}" v-model="tableTemp.classIntroduction"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.courseware')">
          <el-upload :limit="1" :on-exceed="handleExceed" class="upload-demo" action="http://upload.qiniup.com" :file-list="fileList1" :on-success="handleSuccess1" :before-upload="beforeUpload1" :on-remove="handleRemove1" :data="form1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('new.homework')">
          <el-upload class="upload-demo" :limit="1" :on-exceed="handleExceed" action="http://upload.qiniup.com" :file-list="fileList2" :on-success="handleSuccess2" :before-upload="beforeUpload1" :on-remove="handleRemove2" :data="form1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogTableStatus=='create'" type="primary" @click="createPeriodData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updatePeriodData">{{$t('new.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import moment from 'moment'
import { parseTime, configImgSuffix } from '@/utils'
import {
  listCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  listNewCategory,
  listCourseType,
  listClassHour,
  addClassHour,
  updateClassHour,
  deleteClassHour
} from '@/api/schoolCourseM'

import { getToken } from '@/api/common'
import { listSysGrade } from '@/api/schoolSettingM'
import { listTeacherUser } from '@/api/schoolMembersM'

export default {
  name: 'courseCategoryM',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      if (status) {
        var obj = JSON.parse(status) ? JSON.parse(status) : status
        return obj.url
      } else {
        return ' '
      }
    },
    statusEPQFilter(status) {
      const statusMap = {
        0: '不是',
        1: '是'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      l_params: {
        // 中英文 属性
        categoryName: 'p.categoryName',
        gradeName: 'p.gradeName',
        courseName: 'p.courseName',
        courseTypeName: 'p.courseTypeName'
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageRow: 20
      },

      temp: {},
      tempTime: [], // 开始 结束 时间

      categoryOptions: [],
      courseTypeOptions: [],
      gradeOptions: [],
      teaOptions: [],

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
        ]
      },

      dialogPeriodVisible: false,
      courseId: '',
      courseHourNum: '',

      table: null,
      total_table: null,
      tableLoading: true,
      tableQuery: {
        pageNum: 1,
        pageRow: 20
      },

      classHourOptions: [],

      dialogTableVisible: false,
      dialogTableStatus: '',
      tableTemp: {},
      tableRules: {},

      address: '',
      form1: {},
      form2: {},
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: []
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
      // 表格序号
      return (
        (this.listQuery.pageNum - 1) * this.listQuery.pageRow +
                $index +
                1
      )
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
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
    getList() {
      this.listLoading = true
      listCourse(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },

    resetTemp() {
      this.temp = {
        categoryId: '',
        courseName: '',
        courseNameEn: '',
        teacherId: '',
        gradeId: '',
        coursePage: '',
        courseImages: '',
        coursePrice: '',
        courseRefPrice: '',
        courseHour: '',
        courseTypeId: '',
        courseScore: '',
        courseStartTime: '',
        courseEndTime: '',
        classAddress: '',
        classAddressEn: '',
        courseSummary: '',
        courseSummaryEn: '',
        whetherEpq: '0' // 是否是EPQ 0：不是 1：是
      }
      this.fileList3 = []
      this.fileList4 = []
      this.tempTime = []
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        categoryId: item.categoryId,
        courseName: item.courseName,
        courseNameEn: item.courseNameEn,
        teacherId: item.teacherId,
        gradeId: item.gradeId,
        coursePage: item.coursePage,
        courseImages: item.courseImages,
        coursePrice: item.coursePrice,
        courseRefPrice: item.courseRefPrice,
        courseHour: item.courseHour,
        courseTypeId: item.courseTypeId,
        courseScore: item.courseScore,
        courseStartTime: item.courseStartTime,
        courseEndTime: item.courseEndTime,
        classAddress: item.classAddress,
        classAddressEn: item.classAddressEn,
        courseSummary: item.courseSummary,
        courseSummaryEn: item.courseSummaryEn,
        whetherEpq: item.whetherEpq
      }
      this.fileList3 = this.configFileList(this.temp.coursePage)
      this.fileList4 = this.configImg(this.temp.courseImages)

      // if (item.courseImages != null) {
      //   var arr = JSON.parse(item.courseImages)
      //   for (let i = 0; i < arr.length; i++) {
      //     const ele = arr[i]
      //     this.fileList4.push({ url: ele.imageUrl })
      //   }
      // }

      this.tempTime = [item.courseStartTime, item.courseEndTime]
    },
    configFileList(str) {
      var arr = []
      if (str) {
        var array = str.split(';')
        for (let i = 0; i < array.length; i++) {
          const ele = array[i]
          arr.push({ url: ele })
        }
      }
      return arr
    },
    configImg(array) {
      var arr = []
      if (array) {
        for (let i = 0; i < array.length; i++) {
          const ele = array[i]
          arr.push({ url: ele.imageUrl })
        }
      }
      return arr
    },
    // 添加 的时候 下拉框 需要的参数
    configAddOptions() {
      // 配置类别
      this.categoryOptions = []
      const p = {
        module: '4'
      }
      listNewCategory(p).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id,
            label: element.typeName,
            labelEn: element.typeNameEn
          }
          this.categoryOptions.push(e)
        }
      })
      // 配置类型
      this.courseTypeOptions = []
      listCourseType().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id,
            label: element.dictName,
            labelEn: element.dictNameEn
          }
          this.courseTypeOptions.push(e)
        }
      })
      // 配置年级
      this.gradeOptions = []
      listSysGrade().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id,
            label: element.gradeName,
            labelEn: element.gradeNameEn
          }
          this.gradeOptions.push(e)
        }
      })
      // 配置老师
      this.teaOptions = []
      listTeacherUser().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id,
            label: element.userName,
            labelEn: element.userNameEn
          }
          this.teaOptions.push(e)
        }
      })
    },

    // 添加 界面出来
    handleCreate() {
      this.resetTemp()
      this.configAddOptions()

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },

    createData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.temp.courseStartTime = this.tempTime[0]
          this.temp.courseEndTime = this.tempTime[1]

          addCourse(this.temp).then(() => {
            // 更新list
            this.dialogFormVisible = false
            this.getList()
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
      this.configAddOptions()

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.temp.courseStartTime = this.tempTime[0]
          this.temp.courseEndTime = this.tempTime[1]

          updateCourse(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
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
        deleteCourse(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    },
    handlePeriod(row) {
      this.dialogPeriodVisible = true
      this.courseId = row.id
      this.courseHourNum = row.courseHour

      this.getPeriodList()
    },
    handleTableCurrentChange(val) {
      // 改变页码
      this.tableQuery.pageNum = val
      this.getProfileList()
    },
    handleTableSizeChange(val) {
      // 改变每页数量
      this.tableQuery.pageRow = val
      this.getProfileList()
    },
    getPeriodList() {
      this.tableLoading = true
      var params = {
        pageNum: this.tableQuery.pageNum,
        pageRow: this.tableQuery.pageRow,
        courseId: this.courseId
      }
      this.table = []
      listClassHour(params).then(response => {
        this.table = response.list
        this.total_files = response.totalCount
        this.tableLoading = false
      })
    },

    resetTableTemp() {
      this.tableTemp = {
        courseId: this.courseId,

        className: '',
        classIntroduction: '',
        courseware: '', // 课件
        homework: '' // 作业
      }
      this.fileList1 = []
      this.fileList2 = []

      this.classHourOptions = []
      for (let i = 1; i <= parseInt(this.courseHourNum); i++) {
        const e = {
          value: '第' + i + '课时',
          label: '第' + i + '课时'
        }
        this.classHourOptions.push(e)
      }
    },
    configTableTemp(item) {
      this.tableTemp = {
        id: item.id,
        courseId: this.courseId,

        className: item.className,
        classIntroduction: item.classIntroduction,
        courseware: item.courseware, // 课件
        homework: item.homework // 作业
      }
      this.fileList1 = []
      if (item.courseware != '') {
        this.fileList1.push(JSON.parse(item.courseware))
      }
      this.fileList2 = []
      if (item.homework != '') {
        this.fileList2.push(JSON.parse(item.homework))
      }

      this.classHourOptions = []
      for (let i = 1; i <= parseInt(this.courseHourNum); i++) {
        const e = {
          value: '第' + i + '课时',
          label: '第' + i + '课时'
        }
        this.classHourOptions.push(e)
      }
    },
    // 添加 界面出来
    handleCreatePeriod() {
      this.resetTableTemp()

      this.dialogTableStatus = 'create'
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs['tableTemp'].clearValidate()
      })

      // this.configTableAddOptions()
    },
    createPeriodData() {
      this.$refs['tableTemp'].validate(valid => {
        if (valid) {
          addClassHour(this.tableTemp).then(() => {
            // 更新list
            this.getPeriodList()
            this.dialogTableVisible = false
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
    handleUpdatePeriod(row) {
      this.configTableTemp(row)

      this.dialogTableStatus = 'update'
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs['tableTemp'].clearValidate()
      })
    },
    updatePeriodData() {
      this.$refs['tableTemp'].validate(valid => {
        if (valid) {
          updateClassHour(this.tableTemp).then(() => {
            this.getPeriodList()
            this.dialogTableVisible = false
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
    handleDeletePeriod(row) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteClassHour(params)
          .then(() => {
            _vue.getPeriodList()
          })
          .catch(e => {})
      })
    },

    // update file
    beforeUpload1(file) {
      const curr = moment()
        .format('YYYYMMDD')
        .toString()
      const prefix = moment(file.lastModified)
        .format('HHmmss')
        .toString()
      const suffix = decodeURIComponent(file.name)
      // const key = encodeURI(`${curr}${prefix}_${suffix}`)//_${suffix}
      const key = `${curr}${prefix}_${suffix}` // _${suffix}

      return getToken().then(response => {
        this.address = response.address
        this.form1 = {
          key,
          token: response.token
        }
      })
    },
    beforeUpload2(file) { // 课程封面 相关
      const curr = moment()
        .format('YYYYMMDD')
        .toString()
      const prefix = moment(file.lastModified)
        .format('HHmmss')
        .toString()
      const suffix = configImgSuffix(decodeURIComponent(file.name))
      const key = encodeURI(`coursePage/${curr}${prefix}${suffix}`) // _${suffix}

      return getToken().then(response => {
        this.address = response.address
        this.form2 = {
          key,
          token: response.token
        }
      })
    },
    beforeUpload3(file) { // 课程详情 相关
      const curr = moment()
        .format('YYYYMMDD')
        .toString()
      const prefix = moment(file.lastModified)
        .format('HHmmss')
        .toString()
      const suffix = configImgSuffix(decodeURIComponent(file.name))
      const key = encodeURI(`course/${curr}${prefix}${suffix}`) // _${suffix}

      return getToken().then(response => {
        this.address = response.address
        this.form2 = {
          key,
          token: response.token
        }
      })
    },
    handleSuccess1(response, file, fileList) {
      this.tableTemp.courseware = this.configStr(fileList)
    },
    handleRemove1(file, fileList) {
      this.tableTemp.courseware = this.configFile(fileList)
    },
    handleSuccess2(response, file, fileList) {
      this.tableTemp.homework = this.configStr(fileList)
    },
    handleRemove2(file, fileList) {
      this.tableTemp.homework = this.configFile(fileList)
    },
    handleSuccess3(response, file, fileList) {
      this.temp.coursePage = this.configFile(fileList)
    },
    handleRemove3(file, fileList) {
      this.temp.coursePage = this.configFile(fileList)
    },
    handleSuccess4(response, file, fileList) {
      var arr = []
      for (let i = 0; i < fileList.length; i++) {
        const ele = fileList[i]
        var e
        if (ele.response) {
          e = {
            imageUrl: this.address + ele.response.key,
            imageTitle: ' '
          }
        } else {
          e = {
            imageUrl: ele.url,
            imageTitle: ' '
          }
        }
        arr.push(e)
      }
      this.temp.courseImages = JSON.stringify(arr)
    },
    handleRemove4(file, fileList) {
      var arr = []
      for (let i = 0; i < fileList.length; i++) {
        const ele = fileList[i]
        const e = {
          imageUrl: ele.url,
          imageTitle: ' '
        }
        arr.push(e)
      }
      this.temp.courseImages = JSON.stringify(arr)
    },
    configStr(arr) {
      var str = ''
      var ele = arr[0]
      const e = {
        name: ele.name,
        url: this.address + ele.response.key
      }
      str = JSON.stringify(e)
      return str
    },
    configFile(arr) {
      var str = ''
      for (var i = 0; i < arr.length; i++) {
        const ele = arr[i]
        if (i === arr.length - 1) {
          if (ele.hasOwnProperty('name')) {
            str += this.address + ele.response.key
          } else {
            str += ele.url
          }
        } else {
          if (ele.hasOwnProperty('name')) {
            str += this.address + ele.response.key + ';'
          } else {
            str += ele.url + ';'
          }
        }
      }
      return str
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能选择 1 个文件`)
    }
    // // 目录
    // handleViewCatalog() {
    //   this.$router.push({ path: '/courseM/catalogM/catalogM' })
    // }
  }
}
</script>

<style>

</style>








