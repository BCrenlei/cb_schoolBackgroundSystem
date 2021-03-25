<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('user:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.name')" prop="userName">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.userGroup')" prop="roleName">
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.registerTime')" prop="createTime">
        <!-- <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template> -->
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('user:update')">  
        <!-- 用户没有删除 -->
        <template slot-scope="scope">
            <el-button v-if="g_hasPerm('user:update') && scope.row.identity!=1 " type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
            </el-button>
            <!-- <el-button v-if="g_hasPerm('role:delete') && scope.row.userId !=userId" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
              {{$t('operate.delete')}}    g_hasPerm('user:update') &&
            </el-button> -->
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.name')">
          <el-input v-model="temp.userName"></el-input>
        </el-form-item>

                <el-form-item :label="$t('new.nickName')">
          <el-input v-model="temp.nickname"></el-input>
        </el-form-item>

                <el-form-item :label="$t('new.password')">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.userGroup')" prop="type">
          <el-select  v-model="temp.roleId" placeholder="Please select">
            <el-option v-for="item in  userGOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
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
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'

import { listUser, addUser, updateUser, listRole } from '@/api/roles'

export default {
  name: 'userM',
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
      userGOptions: [],
      temp: {
        userName: '',
        password: '',
        nickname: '',
        roleId: ''
      },
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
    this.getUserGList()
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
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
      this.listLoading = true
      listUser(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },

    getUserGList() {
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
    resetTemp() {
      this.temp = {
        userName: '',
        password: '',
        nickname: '',
        roleId: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addUser(this.temp).then(() => {
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
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        userId: item.userId,
        userName: item.userName,
        password: item.password,
        nickname: item.nickname,
        roleId: item.roleId
      }
    },
    handleUpdate(row) {
      this.configTemp(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateUser(this.temp).then(() => {
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
    }
  }
}
</script>




