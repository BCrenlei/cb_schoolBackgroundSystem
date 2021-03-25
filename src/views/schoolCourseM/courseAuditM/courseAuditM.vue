<template>
  <div class="app-container calendar-list-container">

    <div v-if="configAdd()" class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleAllList" type="primary">{{$t('operate.allList')}}</el-button>
      <el-button  class="filter-item" style="margin-left: 10px;" @click="handleMyList" type="primary">{{$t('operate.myList')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.name')" prop="userName">
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('list.phoneNumber')" prop="phone">
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('list.grade')" prop="gradeName">
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('list.class')" prop="className">
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('list.type')" prop="categoryName">
      </el-table-column>
      <el-table-column width="220px" align="center" :label="$t('list.courseName')" prop="courseName">
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('list.courseType')" prop="courseTypeName">
      </el-table-column>
      <!-- <el-table-column width="110px" align="center" :label="$t('list.price')" prop="coursePrice">
      </el-table-column> -->

      <!-- <el-table-column width="110px" align="center" :label="$t('list.status')" prop="status">
        <template slot-scope="scope">
          <span>{{scope.row.jobStatus | statusFilter}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="150px" align="center" :label="$t('list.createTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="configOperation(scope.row)" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column> -->

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.grade')" prop="grade">
          <el-select v-model="temp.gradeId" :disabled="teachingGradeId!=''" @change="onGradeChange" placeholder="请选择">
            <el-option v-for="item in gradeOptions" :key="item.value" 
            :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.category')" prop="category">
          <el-select v-model="temp.categoryId" :disabled="teachingCoursesId!=''" @change="onCategoryChange" placeholder="请选择">
            <el-option v-for="item in categoryOptions" :key="item.value" 
            :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.course')" prop="course">
          <el-select v-model="temp.courseId" :disabled="teachingCoursesId!=''" placeholder="请选择">
            <el-option v-for="item in courseOptions" :key="item.value" 
            :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('new.class')" prop="workingState">
          <el-select v-model="temp.classId"  @change="onClassChange" placeholder="请选择">
            <el-option v-for="item in classOptions"
             :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.student')" prop="workingState">
          <el-select v-model="temp.userId"  placeholder="请选择">
            <el-option v-for="item in studentOptions"
             :key="item.value" :label="item.label" :value="item.value">
             <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button> -->
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listCourseAll } from '@/api/schoolCourseM'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { listSysGrade } from '@/api/schoolSettingM'
import {
  listNewCategory,
  selectCourseByGradeId,
  selectClass,
  selectStudentByClassId
} from '@/api/common'
import {
  listUserCourse,
  myListUserApply,
  addUserApply,
  deleteUserApply
} from '@/api/courseAuditM'

export default {
  name: 'courseAuditM',
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
        username: 'p.username',
        teachingCourses: 'p.teachingCourses'
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

      roleOptions: [], // 角色
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
      categoryOptions: [], //
      classOptions: [],
      studentOptions: [],
      temp: {
        categoryId: '',
        gradeId: '',
        classId: '',
        userId: '',
        courseId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {},
      categoryModule: {
        module: '4'
      },
      courseParmes: {
        gradeId: '',
        categoryId: ''
      },
      classParmes: {
        gradeId: ''
      },
      studentParmes: {
        classId: ''
      }
    }
  },
  filters: {
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
      return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
    },
    getStatus(val) {
      return this.jobStatus[val.jobStatus]
    },
    getList() {
      this.isGetList = true
      this.listLoading = true
      listUserCourse(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
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
      myListUserApply(this.listQuery).then(response => {
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
      // 配置类别
      this.categoryOptions = []
      listNewCategory(this.categoryModule).then(res => {
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
      if (this.teachingGradeId != '') {
        this.temp.gradeId = this.teachingGradeId + ''

        this.classOptions = []
        this.classParmes.gradeId = this.temp.gradeId
        selectClass(this.classParmes).then(res => {
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
    resetTemp() {
      this.temp = {
        categoryId: '',
        gradeId: '',
        classId: '',
        userId: '',
        courseId: ''
      }
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
    // 添加 的时候 下拉框 需要的参数
    configAddOptions() {
      this.configPermission()
    },
    onGradeChange(id) {
    },
    onCategoryChange() {
    },
    onClassChange(id) {
      this.studentOptions = []
      this.studentParmes.classId = id
      selectStudentByClassId(this.studentParmes).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id,
            label: element.studentName,
            labelEn: element.studentNameEn
          }
          this.studentOptions.push(e)
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addUserApply(this.temp).then(() => {
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
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          id: val.id
        }
        deleteUserApply(params)
          .then(() => {
            _vue.getTrueList()
          })
          .catch(e => {})
      })
    }
  }
}
</script>




