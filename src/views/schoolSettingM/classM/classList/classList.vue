<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('class:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <div class="div_selectSix">
      <div v-for="(item, i) in gradeTypeOptions" v-bind:key="i" :class="i==btn_select?'div_sixBtnSelect':'div_sixBtn'" @click="handleClickType(item, i)">{{item.label}}</div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.className')" :prop="renderlanguage(l_params.className)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.gradeName')" :prop="renderlanguage(l_params.gradeName)">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.classroomName')" prop="classroomName">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.stuNum')" prop="studentcount">
        <template slot-scope="scope">
          <div v-if="scope.row.studentcount == '0'" class="text-no">{{scope.row.studentcount}}</div>
          <div v-else class="text-underline" @click="handleViewStu(scope.row)">{{scope.row.studentcount}}</div>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.headmaster')" :prop="renderlanguage(l_params.classTeacher)">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.teachers')" prop="teachercount">
        <template slot-scope="scope">
          <div v-if="scope.row.teachercount == '0'" class="text-no">{{scope.row.teachercount}}</div>
          <div v-else class="text-underline" @click="handleViewTea(scope.row)">{{scope.row.teachercount}}</div>
        </template>
      </el-table-column>

      <!-- <el-table-column width="110px" align="center" :label="$t('list.workingState')" prop="jobStatus">
        <template slot-scope="scope">
          <span>{{scope.row.jobStatus | statusFilter}}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="150px" align="center" :label="$t('list.registerTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="300" class-name="small-padding fixed-width" v-if="g_hasPerm('class:update') ||g_hasPerm('class:delete') ">
        <template slot-scope="scope">
          <!-- <el-button type="primary" @click="handleShowAddTea(scope.row)">{{$t('operate.addTea')}}
          </el-button> -->

          <el-button v-if="g_hasPerm('class:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('class:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加 编辑 班级 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="temp" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.grade')" prop="gradeId">
          <el-select v-model="temp.gradeId">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.className')" prop="className">
          <el-input v-model="temp.className"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.classNameEn')" prop="classNameEn">
          <el-input v-model="temp.classNameEn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.classroom')" prop="classroomId">
          <el-select v-model="temp.classroomId">
            <el-option v-for="item in classroomOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.classTeacher')" prop="classTeacherId">
          <el-button @click="handleShowClassTeacher"> {{this.classTeacherSelect}} </el-button>
        </el-form-item>

        <el-form-item label="任课老师" prop="instructorId">
          <el-tag :key="item.id"  v-for="item in dynamicTags" closable :disable-transitions="false" @close="handleClose(item)">
            {{item.userName}}
          </el-tag>
          <el-button @click="handleShowAddTea"> 添加 </el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 选择 班主任 -->
    <el-dialog width="1000px" :visible.sync="dialogAddClassTeacher" title="选择班主任">

      <el-table ref="classTeacherTable" :data="classTeacherTable" v-loading="classTeacherLoading" @selection-change="handleSelectionChange" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 1200px">

        <el-table-column type="selection" width="55">
        </el-table-column>

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

      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleClassTeacherTableSizeChange" @current-change="handleClassTeacherTableCurrentChange" :current-page="classTeacherQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="classTeacherQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="classTeacherTotal">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleSelection()">{{$t('new.cancel')}}</el-button>
        <el-button type="primary" @click="handleAddClassTeacher">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

    <!-- 查看 任课老师 -->
    <el-dialog width="1000px" :visible.sync="dialogViewTea" title="任课老师">

      <el-table ref="teaTable" :data="teaTable" v-loading="teaLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">

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

      </el-table>

    </el-dialog>

    <!-- 查看 班级学生 -->
    <el-dialog width="1000px" :visible.sync="dialogViewStu" title="班级学生">

      <el-table ref="stuTable" :data="stuTable" v-loading="stuLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" :label="$t('list.id')" width="65">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.studentName)">
        </el-table-column>

        <el-table-column width="150px" align="center" :label="$t('list.phoneNumber')" prop="mobile">
        </el-table-column>

        <el-table-column width="150px" align="center" :label="$t('list.registerTime')" prop="createTime">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" icon="edit" @click="handleDivide(scope.row)">{{$t('operate.divide')}}
            </el-button>
            <el-button type="danger" icon="delete" @click="handleDelStu(scope.$index,scope.row)">
              {{$t('operate.delete')}}
            </el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-dialog>

    <!-- 学生 分班 -->
    <el-dialog width="1000px" :visible.sync="dialogViewClassTable" title="所有班级">

      <el-table ref="classTable" :data="classTable" v-loading="classTableLoading" @selection-change="handleClassSelectionChange" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">

        <el-table-column type="selection" width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('list.id')" width="65">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.gradeName')" :prop="renderlanguage(l_params.gradeName)">
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.className')" :prop="renderlanguage(l_params.className)">
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.classroomName')" prop="classroomName">
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.stuNum')" prop="studentcount">
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.headmaster')" :prop="renderlanguage(l_params.classTeacher)">
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.teachers')" prop="studentcount">
        </el-table-column>

        <!-- <el-table-column width="110px" align="center" :label="$t('list.workingState')" prop="jobStatus">
        <template slot-scope="scope">
          <span>{{scope.row.jobStatus | statusFilter}}</span>
        </template>
      </el-table-column> -->

        <el-table-column width="150px" align="center" :label="$t('list.registerTime')" prop="createTime">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>

      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleClassTableSizeChange" @current-change="handleClassTableCurrentChange" :current-page="classTableQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="classTableQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="classTableTotal">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleClassSelection()">{{$t('new.cancel')}}</el-button>
        <el-button type="primary" @click="handleDevidClass">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

    <!-- 添加 任课老师 -->
    <el-dialog width="1000px" :visible.sync="dialogAddTea" title="添加任课老师">

      <el-table ref="addTeaTable" :data="addTeaTable" v-loading="addTeaLoading" @selection-change="handleAddTeaSelectionChange" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">

        <el-table-column type="selection" width="55">
        </el-table-column>

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

      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleAddTeaTableSizeChange" @current-change="handleAddTeaTableCurrentChange" :current-page="addTeaQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="addTeaQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="addTeaTotal">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleAddTeaSelection()">{{$t('new.cancel')}}</el-button>
        <el-button type="primary" @click="handleAddTea">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { parseTime, transformStrArrWithComma, isIncludeItem, removeArrItem, removeArrItemWithId, uniqueObjArr } from '@/utils'
import {
  listSysClass,
  addSysClass,
  updateSysClass,
  deleteSysClass,
  listClassType,
  listSysClassroom,
  listSysGrade,
  listSysGradeAll
} from '@/api/schoolSettingM'
import {
  listTeacherUser,
  listTeacherUserAll,
  updateStudentUser
} from '@/api/schoolMembersM'
import {
  selectClass,
  selectTea,
  selectStu,
  delTeaByClassId
} from '@/api/common'

export default {
  name: 'classList',
  directives: {
    waves
  },
  data() {
    return {
      l_params: {
        // 中英文 属性
        gradeName: 'p.gradeName',
        className: 'p.className',
        classTeacher: 'p.classTeacher',

        userName: 'p.userName',
        teachingCourses: 'p.teachingCourses',

        // stu
        studentName: 'p.studentName',

        // tea
        teacherName: 'p.teacherName'
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageRow: 20
      },

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
      classTypeOptions: [], // 类型
      classroomOptions: [], // 教室

      courseOptions: [], // 课程

      gradeTypeOptions: [], // 年级分类
      btn_select: 0, // 默认选中 第一个 全部按钮
      id_select: '', // 选中的id

      temp: {
        id: '',
        gradeId: '',
        gradeName: '',
        gradeNameEn: '',

        className: '',
        classNameEn: '',

        classTypeId: '',
        classType: '',

        classroomId: '',
        classroom: '',

        teacherId: '',
        classTeacher: '',
        classTeacherEn: '',

        studentcount: '',
        teachercount: '',
        instructorId: ''
      },

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
        password: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        dictId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        jobStatus: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        teachingGradeId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        teachingCoursesId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        email: [{ required: true, message: '必填项', trigger: 'blur' }],
        intro: [{ required: true, message: '必填项', trigger: 'blur' }],
        icon: [{ required: true, message: '必填项', trigger: 'blur' }]
      },

      // 添加 班主任
      dialogAddClassTeacher: false,
      classTeacherTableKey: 0,
      classTeacherTable: null,
      classTeacherTotal: null,
      classTeacherLoading: true,
      classTeacherQuery: {
        pageNum: 1,
        pageRow: 20
      },

      classTeacherSelect: 'select',
      classTeacherSelection: [],

      dialogViewTea: false,
      teaTable: null,
      teaLoading: true,
      selectClassViewTea: null, // 查看老师时选的班级

      dialogViewStu: false,
      stuTable: null,
      stuLoading: true,
      selectClassViewStu: null, // 查看学生时选的班级

      dialogViewClassTable: false,
      classTable: null,
      classTableTotal: null,
      classTableLoading: true,
      classTableQuery: {
        pageNum: 1,
        pageRow: 20
      },
      classSelection: [],
      divideStu: null,

      // 添加 任课老师
      dialogAddTea: false,
      addTeaTable: null,
      addTeaTotal: null,
      addTeaLoading: true,
      addTeaQuery: {
        pageNum: 1,
        pageRow: 20
      },
      dynamicTags: [], // 展示 几个任课老师
      isUpdatePage: false, // 选择任课老师  是否翻页 或者 筛选
      addTeaAddOptions: [], // 选择任课老师 加的项 可能有重复 需去重
      addTeaDeleteOptions: [], // 选择任课老师 删的项
      addTeaSelection: [], // 记录老师当前页的上一次选中状态
      addTeaTemporary: [] // 展示 几个任课老师 的中间过渡数组  为了选的时候不让界面变换  确定了才赋值给dynamicTags改变界面
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
    this.configGradeOptions()
  },
  methods: {
    renderlanguage(string) {
      return this.$t(string)
    },
    getStatus(val) {
      return this.jobStatus[val.jobStatus]
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
      this.updateList()
    },
    handleSizeChange(val) {
      // 改变每页数量
      this.listQuery.pageRow = val
      this.updateList()
    },
    configGradeOptions() {
      this.gradeTypeOptions = []
      var ele = {
        value: '',
        label: '全部'
      }
      this.gradeTypeOptions.push(ele)
      listSysGradeAll().then(res => {
        var item = this.$route.query.item
        if (item != null) {
          this.id_select = item.id
        }

        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id + '',
            label: element.gradeName
          }
          this.gradeTypeOptions.push(e)

          if (this.id_select != '') {
            if (e.value == this.id_select) {
              this.btn_select = i + 1
            }
          }
        }
        this.configList()
      })
    },
    handleClickType(item, i) {
      this.btn_select = i
      this.id_select = item.value

      this.configList()
    },
    configList() {
      if (this.btn_select == 0) {
        this.listQuery = {
          pageNum: 1,
          pageRow: 20
        }
      } else {
        this.listQuery = {
          pageNum: 1,
          pageRow: 20,
          gradeId: this.id_select
        }
      }
      this.updateList()
    },
    updateList() {
      if (this.btn_select == 0) {
        this.handleAllList()
      } else {
        this.handleMyList()
      }
    },
    handleAllList() {
      this.listLoading = true
      listSysClass(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },
    handleMyList() {
      this.listLoading = true
      selectClass(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        className: '',
        classNameEn: '',
        gradeId: '',
        classTypeId: '1',
        teacherId: '',
        classroomId: '',
        instructorId: ''
      }
      this.classTeacherSelect = 'select'
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        className: item.className,
        classNameEn: item.classNameEn,
        gradeId: item.gradeId,
        // classTypeId: item.classTypeId,
        classTypeId: '1',
        teacherId: item.teacherId,
        classroomId: item.classroomId,
        instructorId: item.instructorId
      }
      this.classTeacherSelect = item.classTeacher

      // 编辑 添加 选中项
      this.dynamicTags = []
      const p = {
        classId: item.id
      }
      selectTea(p).then(response => {
        this.dynamicTags = response
      })
    },

    // 添加 的时候 下拉框 需要的参数
    configAddOptions() {
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
      // 配置类型
      this.classTypeOptions = []
      listClassType().then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id,
            label: element.dictName
          }
          this.classTypeOptions.push(e)
        }
      })
      // 配置教室
      this.classroomOptions = []
      listSysClassroom().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id,
            label: element.name
          }
          this.classroomOptions.push(e)
        }
      })
    },
    // 添加 界面出来
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })

      this.configAddOptions()
    },
    // 展示添加班主任的界面
    handleShowClassTeacher(row) {
      this.dialogAddClassTeacher = true
      // this.classTeacherSelect = 'select'
      this.getClassTeacherList()
    },

    getClassTeacherList() {
      this.classTeacherLoading = true
      var params = {
        pageNum: this.classTeacherQuery.pageNum,
        pageRow: this.classTeacherQuery.pageRow
      }
      listTeacherUser(params).then(response => {
        this.classTeacherTable = response.list
        this.classTeacherTotal = response.totalCount
        this.classTeacherLoading = false
      })
    },
    handleClassTeacherTableCurrentChange(val) {
      // 改变页码
      this.classTeacherQuery.pageNum = val
      this.getClassTeacherList()
    },
    handleClassTeacherTableSizeChange(val) {
      // 改变每页数量
      this.classTeacherQuery.pageRow = val
      this.getClassTeacherList()
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.classTeacherTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.classTeacherTable.clearSelection()
        this.dialogAddClassTeacher = false
      }
    },
    handleSelectionChange(val) {
      this.classTeacherSelection = val
    },

    handleAddClassTeacher() {
      if (this.classTeacherSelection.length > 1) {
        this.$notify({
          message: this.$t('msg.ctmaxMsg'),
          type: 'warning'
        })
      } else if (this.classTeacherSelection.length == 1) {
        const e = this.classTeacherSelection[0]
        this.temp.teacherId = e.id

        this.classTeacherSelect = e.userName
        this.dialogAddClassTeacher = false
      } else {
        this.$notify({
          message: this.$t('msg.ctminMsg'),
          type: 'warning'
        })
      }
    },
    createData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          var arr = []
          for (let i = 0; i < this.dynamicTags.length; i++) {
            const ele = this.dynamicTags[i]
            arr.push(ele.id)
          }
          this.temp.instructorId = transformStrArrWithComma(arr)
          addSysClass(this.temp).then(() => {
            // 更新添加的list   在全部 则不跳转   在高一列表  添加高二的 跳转到高二去   全部从头刷新
            this.configAddList(this.temp.gradeId)

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
    configAddList(id) {
      if (this.btn_select == 0) {
        this.configList()
      } else {
        for (let i = 0; i < this.gradeTypeOptions.length; i++) {
          const e = this.gradeTypeOptions[i]
          if (id == e.gradeId) {
            this.btn_select = i
            this.id_select = id
          }
        }
        this.configList()
      }
    },
    // 编辑 界面出来
    handleUpdate(row) {
      this.configTemp(row)

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })

      this.configAddOptions()
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          var arr = []
          for (let i = 0; i < this.dynamicTags.length; i++) {
            const ele = this.dynamicTags[i]
            arr.push(ele.id)
          }
          this.temp.instructorId = transformStrArrWithComma(arr)
          updateSysClass(this.temp).then(() => {
            this.updateList()
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
        deleteSysClass(params)
          .then(() => {
            _vue.updateList()
          })
          .catch(e => {})
      })
    },

    handleViewStu(row) {
      this.dialogViewStu = true
      this.selectClassViewStu = row
      this.getStuList()
    },
    getStuList() {
      const p = {
        classId: this.selectClassViewStu.id
      }
      selectStu(p).then(response => {
        this.stuTable = response
        this.stuLoading = false
      })
    },
    handleDelStu(row, val) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          // 传0代表把学生信息更新  删除出该班级
          id: val.id,
          nowClassId: '0'
        }
        updateStudentUser(params)
          .then(() => {
            _vue.getStuList()
          })
          .catch(e => {})
      })
    },
    handleDivide(row) {
      this.dialogViewClassTable = true
      this.divideStu = row
      this.getClassList()
    },
    getClassList() {
      this.classTableLoading = true
      listSysClass(this.classTableQuery).then(response => {
        this.classTable = response.list
        this.classTableTotal = response.totalCount
        this.classTableLoading = false
      })
    },
    handleClassTableCurrentChange(val) { // 改变页码
      this.classTableQuery.pageNum = val
      this.getClassList()
    },
    handleClassTableSizeChange(val) { // 改变每页数量
      this.classTableQuery.pageRow = val
      this.getClassList()
    },

    toggleClassSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.classTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.classTable.clearSelection()
        this.dialogViewClassTable = false
      }
    },
    handleClassSelectionChange(val) {
      this.classSelection = val
    },
    handleDevidClass() {
      if (this.classSelection.length > 1) {
        this.$notify({
          message: this.$t('msg.ctmaxMsg'),
          type: 'warning'
        })
      } else if (this.classSelection.length === 1) {
        const e = this.classSelection[0]
        const params = {
          id: this.divideStu.id,
          nowClassId: e.id
        }
        updateStudentUser(params)
          .then(() => {
            this.dialogViewClassTable = false
            this.getStuList()
            this.updateList()

            this.$notify({
              title: this.$t('msg.success'),
              message: this.$t('msg.updateSuccess'),
              type: 'success',
              duration: 2000
            })
          })
          .catch(e => {})
      } else {
        this.$notify({
          message: this.$t('msg.ctminMsg'),
          type: 'warning'
        })
      }
    },

    handleViewTea(row) {
      this.dialogViewTea = true
      this.selectClassViewTea = row
      this.getTeaList()
    },
    getTeaList() {
      const p = {
        classId: this.selectClassViewTea.id
      }
      selectTea(p).then(response => {
        this.teaTable = response
        this.teaLoading = false
      })
    },
    handleDelTea(row, val) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          classId: this.selectClassViewTea.id,
          teacherId: val.id
        }
        delTeaByClassId(params)
          .then(() => {
            _vue.getTeaList()
            _vue.updateList()
          })
          .catch(e => {})
      })
    },
    // 展示  老师列表  添加任课老师
    handleShowAddTea() {
      this.dialogAddTea = true
      this.isUpdatePage = false
      this.addTeaQuery = {
        pageNum: 1,
        pageRow: 20
      },
      this.getAddTeaList()
      this.addTeaAddOptions = []
      this.addTeaDeleteOptions = [] // 选择任课老师 删的项
      this.addTeaSelection = []
      this.addTeaTemporary = []
    },
    getAddTeaList() {
      this.classTeacherLoading = true
      var params = {
        pageNum: this.addTeaQuery.pageNum,
        pageRow: this.addTeaQuery.pageRow
      }
      listTeacherUser(params).then(response => {
        this.addTeaTable = response.list
        this.addTeaTotal = response.totalCount
        this.addTeaLoading = false

        var arr = []
        for (let i = 0; i < response.list.length; i++) {
          const ele = response.list[i]
          for (let j = 0; j < this.dynamicTags.length; j++) {
            const e = this.dynamicTags[j]
            if (ele.id == e.id) {
              arr.push(ele)
            }
          }
        }
        console.log('9999' + arr)
        // 编辑 添加 选中项
        this.$nextTick(function() {
          if (arr.length > 0) {
            console.log('xxxxxxxxxxx' + arr)
            this.toggleAddTeaSelection(arr)
          }
        })
      })
    },
    handleAddTeaTableCurrentChange(val) { // 改变页码
      this.isUpdatePage = true
      this.addTeaQuery.pageNum = val
      this.getAddTeaList()
    },
    handleAddTeaTableSizeChange(val) { // 改变每页数量
      this.isUpdatePage = true
      this.addTeaQuery.pageRow = val
      this.getAddTeaList()
    },
    toggleAddTeaSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.addTeaTable.toggleRowSelection(row, true)
        })
      } else {
        // this.$refs.addTeaTable.clearSelection()
        this.dialogAddTea = false
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    handleAddTeaSelectionChange(val) {
      if (this.isUpdatePage) { // 翻页更新的val  不考虑 不属于手动改变选项       第一次到选项界面会传该页的所有选项第一次不拦截
        this.isUpdatePage = false
        console.log('0')
      } else {
        if (this.addTeaSelection.length == 0) { // 上一次为空 说明 没添加过  
          for (let i = 0; i < val.length; i++) {
            const e = val[i]
            this.addTeaAddOptions.push(e)// 传过来的值全添加入add数组
            if (isIncludeItem(this.addTeaDeleteOptions, e)) { // 把添加的项从 delete 数组 中的删去  去重
              this.addTeaDeleteOptions = removeArrItem(this.addTeaDeleteOptions, e)
            }
          }
          console.log('1')
        } else if (val.length == 0) { // val 里为空  说明删除了该页所有项  delete数组加删除项  add数组去除删除项
          for (let i = 0; i < this.addTeaSelection.length; i++) {
            const e = this.addTeaSelection[i]
            this.addTeaDeleteOptions.push(e) // 把界面上一次 选项都加入delete数组
            if (isIncludeItem(this.addTeaAddOptions, e)) {
              this.addTeaAddOptions = removeArrItem(this.addTeaAddOptions, e)
            }
          }
          console.log('2')
        } else { // 上一次 数组不为空  且 val 数组不为空
          for (let i = 0; i < this.addTeaSelection.length; i++) { // 找出在上一次数组中的 不在val 数组中的项   说明删了这项
            const ele = this.addTeaSelection[i]
            if (!isIncludeItem(val, ele)) {
              this.addTeaDeleteOptions.push(ele) // 加入delete数组  并从 add数组中删除
              if (isIncludeItem(this.addTeaAddOptions, ele)) {
                this.addTeaAddOptions = removeArrItem(this.addTeaAddOptions, ele)
              }
            }
          }

          for (let i = 0; i < val.length; i++) { // 找出在val数组中的 不在上一次 数组中的项
            const e = val[i]
            if (!isIncludeItem(this.addTeaSelection, e)) {
              this.addTeaAddOptions.push(e) // 说明加了这项 加入add数组  并从 delete数组中删除
              if (isIncludeItem(this.addTeaDeleteOptions, e)) {
                this.addTeaDeleteOptions = removeArrItem(this.addTeaDeleteOptions, e)
              }
            }
          }
          console.log('3')
        }
        this.isUpdatePage = false // 说明没翻页
      }
      console.log(this.addTeaSelection.length + '----4----' + val.length)
      this.addTeaSelection = val // val  赋值给上一次界面数组 开始下一次循环
      this.configDynamicTags()
    },
    handleAddTea() {
      this.isUpdatePage = false
      if (this.addTeaTemporary.length === 0) {
        this.$notify({
          message: this.$t('msg.ctminMsg'),
          type: 'warning'
        })
      } else {
        this.dialogAddTea = false
        this.$nextTick(function() {
          if (this.addTeaTemporary.length > 0) {
            this.dynamicTags = this.addTeaTemporary
            console.log('888888' + this.dynamicTags)
          }
        })
      }
    },
    configDynamicTags() { // 把 add数组中  与以前选择项加到一起  去重后   删除delete中项   得到最终选了哪些项
      var arr = []
      for (let i = 0; i < this.dynamicTags.length; i++) {
        const e = this.dynamicTags[i]
        arr.push(e)
      }

      for (let i = 0; i < this.addTeaAddOptions.length; i++) {
        const e = this.addTeaAddOptions[i]
        arr.push(e)
      }
      arr = uniqueObjArr(arr)
      for (let i = 0; i < this.addTeaDeleteOptions.length; i++) {
        const e = this.addTeaDeleteOptions[i]
        arr = removeArrItemWithId(arr, e)
      }

      this.addTeaTemporary = arr
    }

  }
}
</script>


<style>
.el-dialog {
    min-width: 500px;
}

.text-underline {
    text-decoration: underline;
    color: #409eff;
    cursor: pointer;
}

.text-no {
    color: #606266;
}

.div_selectSix {
    height: 60px;
    padding-left: 10px;
    background-color: rgb(247, 248, 249);
}
.div_sixBtnSelect {
    width: 70px;
    height: 36px;
    font-size: 18px;
    line-height: 36px;
    margin: 12px 0px 12px 10px;
    text-align: center;
    display: inline-block;
    cursor: pointer;

    color: #fff;
    background-color: #409eff;
    border-radius: 18px;
}

.div_sixBtn {
    width: 70px;
    height: 36px;
    font-size: 18px;
    color: #333;
    line-height: 36px;
    margin: 12px 0px 12px 10px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
}

.div_sixBtn:hover {
    color: #fff;
    background-color: #409eff;
    border-radius: 18px;
}
</style>




