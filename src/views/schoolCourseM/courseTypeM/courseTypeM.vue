<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('category:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.courseTypeName')" :prop="renderlanguage(l_params.dictName)">
      </el-table-column>


      <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('category:update') ||g_hasPerm('category:delete') ">
        <template slot-scope="scope">
          <el-button  v-if="g_hasPerm('category:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('category:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="temp" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.typeCName')" prop="dictName">
          <el-input v-model="temp.dictName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.typeCNameEn')" prop="dictNameEn">
          <el-input v-model="temp.dictNameEn"></el-input>
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
import {
  listCourseType,
  addCourseType,
  updateDict,
  deleteDict
} from '@/api/schoolCourseM'

export default {
  name: 'courseCategoryM',
  directives: {
    waves
  },
  data() {
    return {
      l_params: {
        // 中英文 属性
        dictName: 'p.dictName'
      },
      tableKey: 0,
      list: null,
      listLoading: true,

      temp: {
        id: '',
        dictName: '',
        dictNameEn: '',
        pid: '0'
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
    getList() {
      this.listLoading = true
      const p = {
        module: '4'
      }
      listCourseType(p).then(response => {
        this.list = response.list
        this.listLoading = false
      })
    },
    getIndex($index) { // 表格序号
      return ($index + 1)
    },
    resetTemp() {
      this.temp = {
        pid: '0',
        dictName: '',
        dictNameEn: ''
      }
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        dictName: item.dictName,
        dictNameEn: item.dictNameEn,
        pid: '0'
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
          addCourseType(this.temp).then(() => {
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
          updateDict(this.temp).then(() => {
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
        deleteDict(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    }
  }
}
</script>









