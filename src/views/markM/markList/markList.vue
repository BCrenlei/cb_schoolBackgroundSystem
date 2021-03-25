<template>
  <div class="app-container calendar-list-container">
    
    <div v-if="configAdd()" class="filter-container">
      <el-button v-if="g_hasPerm('score:add')"  class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleAllList" type="primary">{{$t('operate.allList')}}</el-button>
      <el-button  class="filter-item" style="margin-left: 10px;" @click="handleMyList" type="primary">{{$t('operate.myList')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.userName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.gradeName')" :prop="renderlanguage(l_params.gradeName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.className')" :prop="renderlanguage(l_params.className)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.categoryName')" :prop="renderlanguage(l_params.categoryName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.courseTypeName')" :prop="renderlanguage(l_params.courseTypeName)">
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.courseName')" :prop="renderlanguage(l_params.courseName)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.examName')" prop="examName">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.score')" prop="score">
      </el-table-column>

      <el-table-column width="160px" align="center" :label="$t('list.examTime')" prop="examTime">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.createTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="configAdd()" align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button v-if="g_hasPerm('score:update')&&configOperation(scope.row)" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('score:delete')&&configOperation(scope.row)" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
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
      <el-form :rules="rules" ref="batchTemp" :model="batchTemp" label-position="right" label-width="130px" style='width:500px; margin-left:50px;'>

        <el-form-item :label="$t('new.typeName')" prop="categoryId">
          <el-select v-model="batchTemp.categoryId" :disabled="teachingCoursesId!=''" @change="onCategoryChange">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.grade')" prop="gradeId">
          <el-select v-model="batchTemp.gradeId" :disabled="teachingGradeId!=''" @change="onGradeChange">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.course')" prop="courseId">
          <el-select v-model="batchTemp.courseId" :disabled="teachingCoursesId!=''" @change="onCourseChange">
            <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.class')" prop="classId">
          <el-select v-model="batchTemp.classId" @change="onClassChange">
            <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.examName')" prop="examId">
          <el-select v-model="batchTemp.examId">
            <el-option v-for="item in examOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item :label="$t('new.examTime')" prop="examTime">
          <el-date-picker v-model="examTime" value-format="yyyy/MM/dd HH:mm" type="datetime" placeholder="select">
          </el-date-picker>
        </el-form-item> -->

        <el-form-item v-if="dialogStatus=='Edit'" :label="$t('new.student')" prop="userId">
          <el-select v-model="batchTemp.userId">
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogStatus=='Edit'" :label="$t('new.score')" prop="score">
          <el-input v-model="batchTemp.score"></el-input>
        </el-form-item>

        <el-form-item style="margin-left:-130px" v-if="dialogStatus=='Create'" :rules="rules" ref="temp" :model="temp" label-position="right" label-width="130px">

          <div v-for="(domain, index) in temp" :key="index">

            <div class="batch-operation-div">

              <el-form-item class="batch-operation-stu" :label="$t('new.student')" prop="userId">
                <el-select v-model="domain.userId">
                  <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-button class="batch-operation-del" v-if="dialogStatus=='Create'" type="danger" icon="delete" @click.prevent="removeDomain(domain)">{{$t('operate.delete')}}
              </el-button>
            </div>

            <el-form-item class="batch-operation-score" :label="$t('new.score')" prop="score">
              <el-input v-model="domain.score"></el-input>
            </el-form-item>

          </div>

          <el-form-item class="batch-operation-add">
            <el-button v-if="dialogStatus=='Create'" type="primary" icon="edit" @click="addDomain">{{$t('operate.add')}}</el-button>
          </el-form-item>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='Create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
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
  listCourseScore,
  myListCourseScore,
  batchAddCourseScore,
  updateCourseScore,
  deleteCourseScore
} from '@/api/markM'
import { selectExamManageByCourseId } from '@/api/examM' // 年级

import { listSysGrade } from '@/api/schoolSettingM' // 年级
import {
  listNewCategory,
  selectClass,
  selectUserApplyById
} from '@/api/common' // 课程分类 课程 班级  课程+班级查学生
import { listCourseAll } from '@/api/schoolCourseM'
export default {
  name: 'markList',
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
        userName: 'p.userName',
        gradeName: 'p.gradeName',
        className: 'p.className',
        categoryName: 'p.categoryName',
        courseTypeName: 'p.courseTypeName',
        courseName: 'p.courseName',
        examName: 'p.examName'
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

      temp: [],
      batchTemp: {},
      examTime: '',

      categoryOptions: [],
      gradeOptions: [],
      courseOptions: [],
      classOptions: [],
      userOptions: [],

      examOptions: [],

      categoryName: '',
      typeName: '',

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
        sex: [{ required: true, message: '必填项', trigger: 'blur' }],
        phone: [{ required: true, message: '必填项', trigger: 'blur' }],
        jobStatus: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
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
      listCourseScore(this.listQuery).then(response => {
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
      myListCourseScore(this.listQuery).then(response => {
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
                    row.courseId == this.teachingCoursesId
        ) {
          judge = true
        }
      }
      return judge
    },
    configPermission() {
      // 配置分类
      this.categoryOptions = []
      const p = { module: '4' }
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
      // 配置年级
      this.gradeOptions = []
      listSysGrade().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id + '',
            label: element.gradeName,
            labelEn: element.gradeNameEn
          }
          this.gradeOptions.push(e)
        }
      })
      if (this.teachingGradeId != '') {
        this.batchTemp.gradeId = this.teachingGradeId

        // 根据年级查班级
        const p1 = { gradeId: this.teachingGradeId }
        selectClass(p1).then(res => {
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
        this.batchTemp.courseId = this.teachingCoursesId

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
              this.batchTemp.categoryId = element.categoryId
              this.batchTemp.courseTypeId = element.courseTypeId
            }
          }
        })
      }
      // 清空 考试
      this.examOptions = []
      const p3 = { gradeId: this.teachingGradeId, courseId: this.teachingCoursesId }
      selectExamManageByCourseId(p3).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id,
            label: element.examName
          }
          this.examOptions.push(e)
        }
      })
    },
    resetTemp() {
      this.temp = [
        {
          categoryId: '',
          courseTypeId: '',
          courseId: '',
          gradeId: '',
          classId: '',
          userId: '',
          score: '',
          examId: ''
        }
      ]
      this.batchTemp = {
        categoryId: '',
        courseTypeId: '',
        courseId: '',
        gradeId: '',
        classId: '',
        userId: '',
        score: '',
        examId: ''
      }

      this.courseOptions = []
      this.classOptions = []
      this.userOptions = []
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.batchTemp = {
        id: item.id,
        categoryId: parseInt(item.categoryId),
        courseTypeId: parseInt(item.courseTypeId),
        courseId: parseInt(item.courseId),
        gradeId: parseInt(item.gradeId),
        classId: parseInt(item.classId),
        userId: parseInt(item.userId),
        score: item.score,
        examId: parseInt(item.examId)
      }
    },

    // 添加 的时候 下拉框 需要的参数
    configAddOptions() {
      this.configPermission()
    },
    // 编辑 的时候 下拉框 需要的参数
    configEditOptions() {
      this.configPermission()
    },

    // 改动 分类
    onCategoryChange(id) {
    },
    // 改动年级
    onGradeChange(id) {
    },
    // 改动课程
    onCourseChange(id) {
    },
    // 改动班级
    onClassChange(id) {
      // 清空学生
      this.userOptions = []
      this.batchTemp.userId = ''

      if (this.batchTemp.courseId !== '') {
        const p = { classId: id, courseId: this.batchTemp.courseId }
        selectUserApplyById(p).then(res => {
          for (var i = 0; i < res.list.length; i++) {
            var element = res.list[i]
            const e = {
              value: element.id,
              label: element.userName,
              labelEn: element.userNameEn
            }
            this.userOptions.push(e)
          }
        })
      }
    },

    removeDomain(item) {
      var index = this.temp.indexOf(item)
      if (index !== -1) {
        this.temp.splice(index, 1)
      }
    },
    addDomain() {
      this.temp.push({
        categoryId: '',
        courseTypeId: '',
        courseId: '',
        gradeId: '',
        classId: '',
        userId: '',
        score: '',
        examId: ''
      })
    },

    // 添加 界面出来
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'Create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['batchTemp'].clearValidate()
      })

      this.configAddOptions()
    },

    createData() {
      this.$refs['batchTemp'].validate(valid => {
        if (valid) {
          for (let i = 0; i < this.temp.length; i++) {
            const e = this.temp[i]
            e.categoryId = this.batchTemp.categoryId
            e.courseTypeId = this.batchTemp.courseTypeId
            e.courseId = this.batchTemp.courseId
            e.gradeId = this.batchTemp.gradeId
            e.classId = this.batchTemp.classId
            e.examId = this.batchTemp.examId
          }

          batchAddCourseScore(this.temp).then(() => {
            // 更新list
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
    // 编辑 界面出来
    handleUpdate(row) {
      this.dialogStatus = 'Edit'

      this.configTemp(row)
      this.configEditOptions()

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['batchTemp'].clearValidate()
      })
    },
    updateData() {
      this.$refs['batchTemp'].validate(valid => {
        if (valid) {
          updateCourseScore(this.batchTemp).then(() => {
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
        deleteCourseScore(params)
          .then(() => {
            _vue.getTrueList()
          })
          .catch(e => {})
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.batch-operation-div {
    display: flex;
    margin-top: 20px;
    flex-direction:row;

    .batch-operation-stu {
        // margin-top: 20px;
    }

    .batch-operation-del {
        margin-left: 20px;
    }
}

.batch-operation-score{
  width: 265px;
  margin-top: 5px;
}

.batch-operation-add{
  margin-top: 5px;
  margin-left: 130px;
}

</style>




