<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('dept:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.simplename)">
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="420" class-name="small-padding fixed-width" v-if="g_hasPerm('dept:update') ||g_hasPerm('dept:delete') ">
        <template slot-scope="scope">
          
          <el-button  type="primary" icon="edit" @click="handleView(scope.row)">{{$t('operate.viewDept')}}
          </el-button>
          <el-button v-if="g_hasPerm('dept:add')" type="primary" icon="edit" @click="handleAdd(scope.row)">{{$t('operate.add')}}
          </el-button>
          <el-button v-if="g_hasPerm('dept:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('dept:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="temp" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.simplename')" prop="simplename">
          <el-input v-model="temp.simplename"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.simplenameEn')" prop="simplenameEn">
          <el-input v-model="temp.simplenameEn"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

        <!-- 查看 部门人员 -->
    <el-dialog :visible.sync="dialogViewDept">

      <el-table ref="deptList" :data="deptList" v-loading="deptListLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" :label="$t('list.id')" width="65">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.userName)">
      </el-table-column>

        <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
          <template slot-scope="scope">
          <el-button v-if="g_hasPerm('dept:delete')" type="danger" icon="delete" @click="handleDelDeptUser(scope.row)">
            {{$t('operate.delete')}}
          </el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-dialog>

    <!-- 添加 部门人员 -->
    <el-dialog :visible.sync="dialogAddDept">

      <el-table ref="addDeptList" :data="addDeptList" v-loading="addDeptLoading" @selection-change="handleAddDeptSelectionChange" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">

        <el-table-column type="selection" width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('list.id')" width="65">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>

        <el-table-column width="110px" align="center" :label="$t('list.name')" prop="userName">
        </el-table-column>

      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleAddDeptSizeChange" @current-change="handleAddDeptCurrentChange" :current-page="addDeptQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="addDeptQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="addDeptTotal">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleAddDeptSelection()">{{$t('new.cancel')}}</el-button>
        <el-button type="primary" @click="handleAddDept">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import {
  listDept,
  addDept,
  updateDept,
  deleteDept,
  addUserByDeptId,
  deleteUserByDeptId,
  selectUserByDeptId
} from '@/api/schoolSettingM'

import { listUser } from '@/api/roles' // 管理员
import { listTeacherUser } from '@/api/schoolMembersM' // 教师

export default {
  name: 'deptM',
  directives: {
    waves
  },
  data() {
    return {
      l_params: {
        // 中英文 属性
        simplename: 'p.simplename',
        userName: 'p.userName'
      },
      tableKey: 0,
      list: [],
      listLoading: true,

      temp: {
        id: '',
        simplename: '',
        simplenameEn: ''
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
        ]
      },

      dialogViewDept: false,
      deptList: [],
      deptListLoading: false,
      viewDeptRow: null,

      // 添加 部门人员
      dialogAddDept: false,
      addDeptList: null,
      addDeptTotal: null,
      addDeptLoading: true,
      addDeptQuery: {
        pageNum: 1,
        pageRow: 10
      },
      selectAddDept: null, // 添加部门人员时选的部门
      addDeptSelection: []
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
      this.list = []
      listDept().then(response => {
        this.list = response.list
        this.listLoading = false
      })
    },
    getIndex($index) {
      // 表格序号
      return ($index + 1)
    },
    resetTemp() {
      this.temp = {
        pid: '0',
        simplename: '',
        simplenameEn: ''
      }
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        pid: '0',
        simplename: item.simplename,
        simplenameEn: item.simplenameEn
      }
    },

    // 添加 界面出来
    handleCreate() {
      this.resetTemp()

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },

    createData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          addDept(this.temp).then(() => {
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

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          updateDept(this.temp).then(() => {
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
        deleteDept(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    },

    // 查看部门人员
    handleView(row) {
      this.dialogViewDept = true
      this.viewDeptRow = row
      this.getDeptList()
    },
    getDeptList() {
      this.deptListLoading = true
      this.deptList = []
      const p = {
        deptId: this.viewDeptRow.id
      }
      selectUserByDeptId(p).then(response => {
        var arr = response.userList
        arr = arr.concat(response.teacherList)

        this.deptList = arr
        this.deptListLoading = false
      })
    },

    handleDelDeptUser(row) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        var params = {
          deptId: this.viewDeptRow.id,
          adminId: ' ',
          teacherId: ' '
        }
        if (row.userId != null) {
          params.adminId = row.userId
        } else {
          params.teacherId = row.id
        }

        deleteUserByDeptId(params)
          .then(() => {
            _vue.getDeptList()
          })
          .catch(e => {})
      })
    },

    // 添加 部门人员
    handleAdd(row) {
      this.dialogAddDept = true
      this.selectAddDept = row

      this.getAddDeptPeo()
    },

    getAddDeptPeo() {
      this.addDeptLoading = true
      this.addDeptList = []

      listTeacherUser(this.addDeptQuery).then(response => {
        var arr = response.list

        listUser(this.addDeptQuery).then(res => {
          arr = arr.concat(res.list)
          this.addDeptList = arr
          this.addDeptTotal = this.addDeptList.length

          this.addDeptLoading = false
        })
      })
    },

    handleAddDeptCurrentChange(val) {
      // 改变页码
      this.addDeptQuery.pageNum = val
      this.getAddDeptPeo()
    },
    handleAddDeptSizeChange(val) {
      // 改变每页数量
      this.addDeptQuery.pageRow = val
      this.getAddDeptPeo()
    },
    toggleAddDeptSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.addDeptList.toggleRowSelection(row)
        })
      } else {
        this.$refs.addDeptList.clearSelection()
        this.dialogAddDept = false
      }
    },
    handleAddDeptSelectionChange(val) {
      this.addDeptSelection = val
    },
    handleAddDept() {
      if (this.addDeptSelection.length === 0) {
        this.$notify({
          message: this.$t('msg.ctminMsg'),
          type: 'warning'
        })
      } else {
        this.dialogAddDept = false

        const arr_tea = []
        const arr_admin = []
        for (let i = 0; i < this.addDeptSelection.length; i++) {
          const e = this.addDeptSelection[i]
          if (e.userId != null) {
            arr_admin.push(e.userId)
          } else {
            arr_tea.push(e.id)
          }
        }
        const params = {
          deptId: this.selectAddDept.id,
          adminId: arr_admin.join(','),
          teacherId: arr_tea.join(',')
        }
        if (arr_admin.length == '0') {
          params.adminId = ' '
        }
        if (arr_tea.length == '0') {
          params.teacherId = ' '
        }

        addUserByDeptId(params).then(response => {
          this.getList()
          this.dialogAddTea = false
          this.$notify({
            title: this.$t('msg.success'),
            message: this.$t('msg.addSuccess'),
            type: 'success',
            duration: 2000
          })
        })
      }
    }

  }
}
</script>









