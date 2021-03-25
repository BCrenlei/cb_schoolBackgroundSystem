<template>
  <div class="app-container calendar-list-container">

    <div v-if="configAdd()" class="filter-container">
      <el-button  class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleAllList" type="primary">{{$t('operate.allList')}}</el-button>
      <el-button  class="filter-item" style="margin-left: 10px;" @click="handleMyList" type="primary">{{$t('operate.myList')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('list.grade')" prop="gradeName">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.class')" prop="className">
      </el-table-column>
      
      <el-table-column width="220px" align="center" :label="$t('list.course')" prop="courseName">
      </el-table-column>
      
      <el-table-column width="110px" align="center" :label="$t('list.courseHour')" prop="classHourName">
      </el-table-column>
      
      <el-table-column width="110px" align="center" :label="$t('list.name')" prop="studentName">
      </el-table-column>

      <!-- <el-table-column width="110px" align="center" :label="$t('list.dailyAssessment')" prop="dailyAssessment">
      </el-table-column> -->

      <el-table-column width="150px" align="center" :label="$t('list.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="configAdd()" align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button v-if="configOperation(scope.row)" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="configOperation(scope.row)"  type="danger" icon="delete" @click="handleDelete(scope.row)">
              {{$t('operate.delete')}}
            </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog width="70%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px" style='width: 70%'>

        <el-form-item :label="$t('new.grade')" prop="gradeId">
          <el-select v-model="temp.gradeId" :disabled="teachingGradeId!=''" @change="onGradeChange">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('new.course')" prop="courseId">
          <el-select v-model="temp.courseId" :disabled="teachingCoursesId!=''" @change="onCourseChange">
            <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.class')" prop="classId">
          <el-select v-model="temp.classId" @change="onClassChange">
            <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item :label="$t('new.period')" prop="classHourId">
          <el-select v-model="temp.classHourId">
            <el-option v-for="item in classHourOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.student')" prop="studentId">
          <el-select v-model="temp.studentId" >
            <el-option v-for="item in stuOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item :label="$t('new.dailyAssessment')">
          <el-input v-model="temp.dailyAssessment"></el-input>
        </el-form-item> -->

        <el-form-item :label="$t('new.category')">
          <el-radio-group v-model="temp.category" >
            <el-radio v-for="ele in typeOptions" :key='ele' :label="ele"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('new.score')">
          <el-radio-group v-model="temp.score" >
            <el-radio v-for="ele in scoreOptions" :key='ele' :label="ele"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('new.learningState')">
          <el-radio-group v-model="temp.learningState" >
            <el-radio v-for="ele in learningStateOptions" :key='ele' :label="ele"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('new.classPerformance')" prop="comment">
          <el-checkbox-group v-model="commentOptions" >
            <el-checkbox  v-for="ele in classPerformanceOptions" :key='ele' :label="ele" name="type"></el-checkbox>
          </el-checkbox-group>
          <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.comment"></el-input> -->
        </el-form-item>
        

        <el-form-item :label="$t('new.classAttendance')">
          <el-radio-group v-model="temp.attendance">
            <el-radio v-for="ele in classAttendanceOptions" :key='ele' :label="ele"></el-radio>
          </el-radio-group>
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
import { listCourseAll } from '@/api/schoolCourseM'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

import {
  listClassPerformance,
  myListClassPerformance,
  deleteClassPerformance,
  updateClassPerformance,
  addClassPerformance
} from '@/api/classPerformanceM'

import { selectClass, selectCourse, selectUserApplyById, selectClassHourByCourseId } from '@/api/common'
import { listSysGrade } from '@/api/schoolSettingM'

export default {
  name: 'classPerformanceM',
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
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageRow: 20
      },
      isGetList: true,
      gradeOptions: [],
      classOptions: [],
      courseOptions: [],
      classHourOptions: [],
      stuOptions: [],

      typeOptions: ['家庭作业', '随堂考试', '实验'],
      scoreOptions: ['A', 'B', 'C', 'D', 'U', 'Absent'],
      learningStateOptions: ['较好', '良好', '一般', '欠佳'],
      classPerformanceOptions: [
        '发言积极',
        '态度认真',
        '勤于思考',
        '善于实践',
        '敢于探索',
        '善于创新',
        '大胆想象',
        '思维敏捷',
        '逻辑清晰',
        '拓展进取',
        '分工协作',
        '勤学好问',
        '反应灵敏',
        '友好合作',
        '善于互动',
        '审美艺术',
        '敢于表现',
        '多才多艺',
        '有倦怠感',
        '注意力不集中',
        '情绪焦虑',
        '学习有压力',
        '进度跟进困难',
        '不善于沟通'
      ],
      classAttendanceOptions: ['正常', '迟到', '早退', '缺勤'],
      temp: {
        gradeId: '',
        courseId: '',
        classId: '',
        classHourId: '',
        studentId: '',
        learningState: '',
        category: '',
        score: '',
        comment: '',
        commentType: '',
        attendance: '',
        dailyAssessment: '' // 日常考核
      },
      commentOptions: [],

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        // type: [
        //   {
        //     required: true,
        //     message: 'type is required',
        //     trigger: 'change'
        //   }
        // ]
      }
    }
  },
  filters: {},
  created() {
    this.getList()
  },
  methods: {
    getIndex($index) { // 表格序号
      return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
    },
    handleSizeChange(val) {
      this.listQuery.pageRow = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    getList() {
      this.isGetList = true
      this.listLoading = true
      listClassPerformance(this.listQuery).then(response => {
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
      myListClassPerformance(this.listQuery).then(response => {
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
      if (this.teachingGradeId != '') {
        this.temp.gradeId = this.teachingGradeId
        // 班级列表
        this.classOptions = []
        const p = {
          gradeId: this.temp.gradeId
        }
        selectClass(p).then(res => {
          for (var i = 0; i < res.length; i++) {
            var element = res[i]
            const e = {
              value: element.id + '',
              label: element.className,
              labelEn: element.classNameEn
            }
            this.classOptions.push(e)
          }
        })
      }
      if (this.teachingCoursesId != '') {
        this.temp.courseId = this.teachingCoursesId

        // 课程列表
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
          }
        })

        // 课时列表
        const params = { courseId: this.temp.courseId }
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
    onGradeChange() {

    },
    onCourseChange() {

    },
    onClassChange() {
      const p = {
        classId: this.temp.classId,
        courseId: this.temp.courseId
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
        courseId: '',
        classId: '',
        classHourId: '',
        studentId: '',
        learningState: '',
        category: '',
        score: '',
        comment: '',
        commentType: '',
        attendance: '',
        dailyAssessment: ''
      }
      this.commentOptions = []
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        gradeId: item.gradeId,
        courseId: item.courseId + '',
        classId: item.classId + '',
        classHourId: item.classHourId,
        studentId: item.studentId,
        learningState: item.learningState,
        category: item.category,
        score: item.score,
        comment: item.comment,
        commentType: item.commentType,
        attendance: item.attendance,
        dailyAssessment: item.dailyAssessment
      }
      this.commentOptions = item.commentType.split(';')
    },

    // 添加 的时候 下拉框 需要的参数
    configAddOptions() {
      this.configPermission()
    },
    configEditOptions() {
      this.configPermission()

      // 学生
      const p = {
        classId: this.temp.classId,
        courseId: this.temp.courseId
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      this.configAddOptions()
    },
    createData() {
      this.temp.commentType = this.commentOptions.join(';')
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addClassPerformance(this.temp).then(() => {
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      this.configEditOptions()
    },
    updateData() {
      this.temp.commentType = this.commentOptions.join(';')
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateClassPerformance(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getTrueList()
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
    handleDelete(row) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteClassPerformance(params)
          .then(() => {
            _vue.getTrueList()
          })
          .catch(e => {})
      })
    }

  }
}
</script>




