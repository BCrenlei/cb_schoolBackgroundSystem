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

      <el-table-column width="110px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.typeName)">
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('category:update') ||g_hasPerm('category:delete') ">
        <template slot-scope="scope">
          
          <el-button  type="primary" icon="edit" @click="handleView(scope.row)">{{$t('operate.viewCatalog')}}
          </el-button>
          <el-button v-if="g_hasPerm('category:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('category:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="temp" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.name')" prop="typeName">
          <el-input v-model="temp.typeName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.nameEn')" prop="typeNameEn">
          <el-input v-model="temp.typeNameEn"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

        <!-- 查看 栏目 -->
    <el-dialog :visible.sync="dialogViewCata">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('category:add')" class="filter-item" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

      <el-table ref="deptList" :data="deptList" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" :label="$t('list.id')" width="65">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.typeName)">
      </el-table-column>

        <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            
            <el-button v-if="g_hasPerm('category:update')" type="primary" icon="edit" @click="handleUpdateCata(scope.row)">
            {{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('category:delete')" type="danger" icon="delete" @click="handleDelCata(scope.row)">
            {{$t('operate.delete')}}
          </el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-dialog>

    <!-- 添加 栏目 -->
    <el-dialog :title="textMap[dialogCataStatus]" :visible.sync="dialogAddCata">

      <el-form :rules="cataRules" ref="cataTemp" :model="cataTemp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.name')" prop="typeName">
          <el-input v-model="cataTemp.typeName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.nameEn')" prop="typeNameEn">
          <el-input v-model="cataTemp.typeNameEn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.nameEn')" prop="courseware">
          <el-input v-model="cataTemp.courseware"></el-input>
        </el-form-item>

                <el-form-item :label="$t('new.nameEn')" prop="exercise">
          <el-input v-model="cataTemp.exercise"></el-input>
        </el-form-item>
        <!-- courseware,exercise -->

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCata = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogCataStatus=='create'" type="primary" @click="createCataData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateCataData">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import {
  listCatalog,
  addCatalog,
  updateCatalog,
  deleteCatalog
} from '@/api/schoolCourseM'

export default {
  name: 'catalogM',
  directives: {
    waves
  },
  data() {
    return {
      l_params: {
        // 中英文 属性
        typeName: 'p.typeName'
      },
      tableKey: 0,
      list: [],
      allList: [],
      listLoading: false,

      temp: {
        id: '',
        typeName: '',
        typeNameEn: '',
        courseId: this.$route.query.courseId,
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
      },

      // 查看 栏目
      dialogViewCata: false,
      deptList: [],
      viewCataRow: null, // 查看栏目时选的父项目

      updateCataRow: null, // 编辑栏目时选的本身项目

      // 添加 栏目
      dialogAddCata: false,
      dialogCataStatus: '',
      cataTemp: {
        id: '',
        typeName: '',
        typeNameEn: '',
        pid: '',
        courseware: '',
        exercise: '',
        courseId: ''
      },
      cataRules: {
        userName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        userNameEn: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  // created() {
  //   this.getList()
  // },
  // mounted() {
  //   this.getList()
  //   // alert('dsdsdsds')
  // },
  activated() {
    this.getList()
  },
  methods: {
    renderlanguage(string) {
      return this.$t(string)
    },
    getIndex($index) {
      // 表格序号
      return ($index + 1)
    },
    getList() {
      if (this.$route.query.courseId != null) {
        this.listLoading = true
        this.list = []
        const p = {
          courseId: this.$route.query.courseId
        }
        listCatalog(p).then(response => {
          this.allList = response.list
          for (let i = 0; i < this.allList.length; i++) {
            const e = this.allList[i]
            if (e.pid === 0) {
              this.list.push(e)
            }
          }
          this.listLoading = false

          this.getCatatList()
        })
      }
    },
    resetTemp() {
      this.temp = {
        courseId: this.$route.query.courseId,
        typeName: '',
        typeNameEn: '',
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
          if (this.$route.query.courseId != null) {
            addCatalog(this.temp).then(() => {
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
        }
      })
    },

    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        courseId: this.$route.query.courseId,

        id: item.id,
        typeName: item.typeName,
        typeNameEn: item.typeNameEn,
        pid: '0'
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
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          if (this.$route.query.courseId != null) {
            updateCatalog(this.temp).then(() => {
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
        deleteCatalog(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    },

    // 栏目列表
    handleView(row) {
      this.dialogViewCata = true
      this.viewCataRow = row
      this.getCatatList()
    },
    getCatatList() {
      this.deptList = []
      if (this.viewCataRow != null) {
        for (let i = 0; i < this.allList.length; i++) {
          const e = this.allList[i]
          if (e.pid === this.viewCataRow.id) {
            this.deptList.push(e)
          }
        }
      }
    },

    // 添加 栏目
    handleAdd(row) {
      this.dialogAddCata = true
      this.dialogCataStatus = 'create'

      this.cataTemp = {
        courseId: this.$route.query.courseId,

        typeName: '',
        typeNameEn: '',
        pid: this.viewCataRow.id,
        courseware: '1',
        exercise: '111'
      }
      this.$nextTick(() => {
        this.$refs['cataTemp'].clearValidate()
      })
    },

    createCataData() {
      this.$refs['cataTemp'].validate(valid => {
        if (valid) {
          if (this.$route.query.courseId != null) {
            addCatalog(this.cataTemp).then(() => {
            // 更新list
              this.dialogAddCata = false
              this.getList()
              this.$notify({
                title: this.$t('msg.success'),
                message: this.$t('msg.createSuccess'),
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
    },

    // 编辑 栏目
    handleUpdateCata(row) {
      this.dialogAddCata = true
      this.dialogCataStatus = 'update'
      this.updateCataRow = row

      this.cataTemp = {
        courseId: this.$route.query.courseId,

        id: row.id,
        typeName: row.typeName,
        typeNameEn: row.typeNameEn,
        pid: row.pid,
        courseware: row.courseware,
        exercise: row.exercise
      }

      this.$nextTick(() => {
        this.$refs['cataTemp'].clearValidate()
      })
    },

    updateCataData() {
      this.$refs['cataTemp'].validate(valid => {
        if (valid) {
          if (this.$route.query.courseId != null) {
            updateCatalog(this.cataTemp).then(() => {
              this.dialogAddCata = false
              this.getList()
              this.$notify({
                title: this.$t('msg.success'),
                message: this.$t('msg.updateSuccess'),
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
    },

    handleDelCata(row) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteCatalog(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    }

  }
}
</script>









