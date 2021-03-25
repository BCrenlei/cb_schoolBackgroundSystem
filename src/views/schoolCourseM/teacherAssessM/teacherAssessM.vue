<template>
  <div class="app-container calendar-list-container">

    <div v-if="configAdd()" class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleAllList" type="primary">{{$t('operate.allList')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleMyList" type="primary">{{$t('operate.myList')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.studentName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.grade')" :prop="renderlanguage(l_params.gradeName)">
      </el-table-column>

      <el-table-column width="130px" align="center" :label="$t('list.class')" :prop="renderlanguage(l_params.className)">
      </el-table-column>

      <el-table-column width="140px" align="center" :label="$t('list.course')" :prop="renderlanguage(l_params.userCourseName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.courseHour')" prop="classHourName">
      </el-table-column>

      <el-table-column show-overflow-tooltip width="220px" align="center" :label="$t('list.teacherComment')" :prop="renderlanguage('p.teacherEvaluate')">
      </el-table-column>

      <el-table-column show-overflow-tooltip width="220px" align="center" :label="$t('list.studentFeedback')" :prop="renderlanguage('p.selfFeeling')">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.createTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="configAdd()" align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="configOperation(scope.row)" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="configOperation(scope.row)" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
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

        <el-form-item :label="$t('new.grade')" prop="gradeId">
          <el-select :disabled="dialogStatus!='create'||teachingGradeId!=''" v-model="temp.gradeId" @change="onGradeChange">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.course')" prop="userCourseId">
          <el-select :disabled="dialogStatus!='create'||teachingCoursesId!=''" v-model="temp.userCourseId" @change="onCourseChange">
            <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.class')" prop="classId">
          <el-select :disabled="dialogStatus!='create'" v-model="temp.classId" @change="onClassChange">
            <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.period')" prop="classHourId">
          <el-select :disabled="dialogStatus!='create'" v-model="temp.classHourId">
            <el-option v-for="item in classHourOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.student')" prop="studentId">
          <el-select :disabled="dialogStatus!='create'" v-model="temp.studentId">
            <el-option v-for="item in stuOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.teacherEvaluate')" prop="teacherEvaluate">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入内容" v-model="temp.teacherEvaluate">
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('new.selfFeeling')" prop="selfFeeling">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入内容" v-model="temp.selfFeeling">
          </el-input>
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
import {
  listStEvaluation,
  myListStEvaluation,
  addTEvaluation,
  updateStEvaluation,
  deleteStEvaluation
} from '@/api/assessM'
import {
  selectClass,
  selectCourse,
  selectUserApplyById,
  selectClassHourByCourseId
} from '@/api/common'
import { listSysGrade } from '@/api/schoolSettingM'
import { listCourseAll } from '@/api/schoolCourseM'

export default {
  name: 'teacherAssessM',
  computed: {
    ...mapGetters(['teachingGradeId', 'teachingCoursesId'])
  },
  directives: {
    waves
  },
  data() {
    return {
      l_params: {
        // 中英文 属性
        username: 'p.userName',
        studentName: 'p.studentName',
        gradeName: 'p.gradeName',
        className: 'p.className',
        userCourseName: 'p.userCourseName'
      },

      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageRow: 20
      },
      isGetList: true,

      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      gradeOptions: [],
      classOptions: [],
      courseOptions: [],
      classHourOptions: [],
      stuOptions: [],

      rules: {}
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
      this.isGetList = true
      this.listLoading = true
      listStEvaluation(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
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
      myListStEvaluation(this.listQuery).then(response => {
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
        if (
          row.gradeId == this.teachingGradeId &&
                    row.userCourseId == this.teachingCoursesId
        ) {
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
              value: element.id + '',
              label: element.className
            }
            this.classOptions.push(e)
          }
        })
      }
      if (this.teachingCoursesId != '') {
        this.temp.userCourseId = this.teachingCoursesId

        this.courseOptions = []
        listCourseAll().then(res => {
          for (var i = 0; i < res.length; i++) {
            var element = res[i]
            const e = {
              value: element.id + '',
              label: element.courseName,
              courseTypeId: element.courseTypeId
            }
            this.courseOptions.push(e)
          }
        })

        const params = { courseId: this.temp.userCourseId }
        this.classHourOptions = []
        selectClassHourByCourseId(params).then(res => {
          for (var i = 0; i < res.length; i++) {
            var element = res[i]
            const e = {
              value: element.id,
              label: element.className
            }
            this.classHourOptions.push(e)
          }
        })
      }
    },
    onGradeChange() {},
    onCourseChange() {},
    onClassChange() {
      const p = {
        classId: this.temp.classId,
        courseId: this.temp.userCourseId
      }
      this.stuOptions = []
      selectUserApplyById(p).then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id,
            label: element.userName
          }
          this.stuOptions.push(e)
        }
      })
    },
    resetTemp() {
      this.temp = {
        gradeId: '',
        classId: '',
        userCourseId: '',
        classHourId: '',
        studentId: '',
        teacherEvaluate: '',
        selfFeeling: ''
      }
    },
    configTemp(row) {
      this.temp = {
        id: row.id,
        gradeId: row.gradeId,
        classId: row.classId,
        userCourseId: row.userCourseId,
        classHourId: row.classHourId,
        studentId: row.studentId,
        teacherEvaluate: row.teacherEvaluate,
        selfFeeling: row.selfFeeling
      }
    },
    // 添加 的时候 下拉框 需要的参数
    configAddOptions() {
      this.configPermission()
    },
    configEditOptions() {
      this.configAddOptions()

      const p = {
        classId: this.temp.classId,
        courseId: this.temp.userCourseId
      }
      this.stuOptions = []
      selectUserApplyById(p).then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id,
            label: element.userName
          }
          this.stuOptions.push(e)
        }
      })
    },

    handleCreate() {
      this.resetTemp()
      this.configAddOptions()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addTEvaluation(this.temp).then(() => {
            this.getTrueList()
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
    handleUpdate(row) {
      this.configTemp(row)
      this.configEditOptions()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateStEvaluation(this.temp).then(() => {
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
        deleteStEvaluation(params)
          .then(() => {
            _vue.getTrueList()
          })
          .catch(e => {})
      })
    }
  }
}
</script>




