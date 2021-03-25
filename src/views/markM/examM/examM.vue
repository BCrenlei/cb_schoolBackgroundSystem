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

      <el-table-column width="110px" align="center" :label="$t('list.type')" prop="courseCategoryName">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.course')" prop="courseName">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.grade')" prop="gradeName">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.examName')" prop="examName">
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.examTime')" prop="examTime">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.score')" prop="score">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.createTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="configAdd()"  align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="g_hasPerm('score:update')&&configOperation(scope.row)" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button type="danger" v-if="g_hasPerm('score:delete')&&configOperation(scope.row)" icon="delete" @click="handleDelete(scope.$index,scope.row)">
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
          <el-select v-model="temp.gradeId" :disabled="teachingGradeId!=''" @change="onGradeChange">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.typeName')" prop="categoryId">
          <el-select v-model="temp.categoryId" :disabled="teachingCoursesId!=''" @change="onCategoryChange">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.course')" prop="courseId">
          <el-select v-model="temp.courseId" :disabled="teachingCoursesId!=''">
            <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.examName')" prop="examName">
          <el-input v-model="temp.examName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.examTime')" prop="examTime">
          <el-date-picker v-model="temp.examTime" type="datetime" value-format="yyyy/MM/dd HH/ss">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('new.score')" prop="score">
          <el-input v-model="temp.score"></el-input>
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
import { listSysGrade } from '@/api/schoolSettingM' // 年级
import { listNewCategory, selectCourse } from '@/api/common' // 课程分类 课程
import {
  listExamManage,
  myListExamManage,
  addExamManage,
  updateExamManage,
  deleteExamManage
} from '@/api/examM'

export default {
  name: 'examM',
  computed: {
    ...mapGetters(['teachingGradeId', 'teachingCoursesId'])
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

      gradeOptions: [], // 年级
      categoryOptions: [], // 类型
      courseOptions: [], // 课程

      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
      }
    }
  },
  filters: {},
  created() {
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageRow = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    getIndex($index) {
      // 表格序号
      return (
        (this.listQuery.pageNum - 1) * this.listQuery.pageRow +
                $index +
                1
      )
    },
    getList() {
      this.isGetList = true
      this.listLoading = true
      listExamManage(this.listQuery).then(response => {
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
      myListExamManage(this.listQuery).then(response => {
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
            value: element.id + '',
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
        this.temp.gradeId = this.teachingGradeId
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
              this.temp.categoryId = element.categoryId + ''
            }
          }
        })
      }
    },
    resetTemp() {
      this.temp = {
        gradeId: '',
        categoryId: '',
        courseId: '',
        examName: '',
        examTime: '',
        score: ''
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.configAddOptions()
    },
    // 改动年级
    onGradeChange(id) {
    },
    // 改动 分类
    onCategoryChange(id) {
    },

    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addExamManage(this.temp).then(() => {
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
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        gradeId: item.gradeId,
        categoryId: item.courseCategoryId + '',
        courseId: item.courseId,
        examName: item.examName,
        examTime: item.examTime,
        score: item.score
      }
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateExamManage(this.temp).then(() => {
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
        deleteExamManage(params)
          .then(() => {
            _vue.getTrueList()
          })
          .catch(e => {})
      })
    }
  }
}
</script>




