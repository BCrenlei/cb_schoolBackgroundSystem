<template>
  <transition name="fade" mode="out-in">
    <div class="app-container calendar-list-container">
      <div class="filter-container">
        <el-button v-if="g_hasPerm('abilityCategory:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
          icon="el-icon-edit">{{$t('operate.add')}}</el-button>
        <div class="table-area">
          <el-table ref="multipleTable" class="table" :highlightCurrentRow="true" :data="dataTotal.dataSource" border :empty-text="$t('msg.empty')"
            tooltip-effect="dark" show-overflow-tooltip="true" style="width: 100%;">

            <el-table-column align="center" v-for="(label,index) in dataTotal.labelArr" :prop="renderlanguage(dataTotal.propArr[index])" :label="renderlanguage(label)"
              :key="index" headerAlign="center" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('abilityCategory:update') ||g_hasPerm('abilityCategory:delete') ">
              <template slot-scope="scope">
                <el-button v-if="g_hasPerm('abilityCategory:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
                </el-button>
                <el-button v-if="g_hasPerm('abilityCategory:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
                  {{$t('operate.delete')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form ref="temp" :model="temp" label-position="right" label-width="130px" style='width:500px;margin-left:50px;'>
            <el-form-item :label="$t('new.categoryName')">
              <el-select v-model="temp.categoryId" >
                <el-option v-for="item in  typeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('new.abilityCategoryName')">
              <el-input v-model="temp.abilityCategoryName"></el-input>
            </el-form-item>
          </el-form>
          <div v-if="dialogStatus!='Look'" slot="footer" class="dialog-footer">
            <el-button @click="cancelDia">{{$t('new.cancel')}}</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
            <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </transition>
</template>

<script>
  import moment from 'moment'
import {
    listNewCategory,
    listAbilityCategory,
    deleteAbilityCategory,
    updateAbilityCategory,
    addAbilityCategory
  } from '@/api/ability'
  export default {
    name: 'abilityClassifyList',
    data() {
      return {
        dataTotal: {
          labelArr: [
            'list.id',
            'list.categoryName', // 类别
            'list.abilityName', // 能力分类名称
            'list.createTime', // 发布时间
            // 'list.deleteStatus' // 状态
          ],
          propArr: [
            'id',
            'categoryName',
            'abilityCategoryName',
            'createTime',
            // 'deleteStatus'
          ],
          operateArr: [
            'operate.allow'
          ],
          operateHandleClassArr: ['edit', 'disabled', 'delete'],
          listLoading: true,
          dataSource: []
        },
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        temp: {},
        dialogStatus: '',
        dialogFormVisible: false,
        typeOptions: [],
        abilityOptions: [],
        abilityObject: ''
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 翻译
      renderlanguage(string) {
        return this.$t(string)
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
        listAbilityCategory(this.listQuery).then(res => {
          var data = res

          data.forEach(function(value, index, array) {
            value.createTime = moment(value.createTime).format('YYYY-MM-DD').toString()
          })
          this.dataTotal.dataSource = data
        })
      },
      resetTemp() {
        this.temp = {
          categoryId: '', // 类别id
          abilityCategoryName: ''
        }
        this.typeOptions = []
        this.abilityOptions = []
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.resetTemp()
        this.dialogFormVisible = true
        this.configAddOptions()
      },
      configAddOptions() {
        // 配置类别
        const p = {
          module: '4'
        }
        // 分类接口
        listNewCategory(p).then(res => {
          const data = res.list || res
          for (var i = 0; i < data.length; i++) {
            this.typeOptions.push({
              value: data[i].id,
              label: data[i].typeName
            })
          }
        })
      },
      createData() {
        addAbilityCategory(this.temp).then(res => {
          this.$notify({
            title: this.$t('msg.success'),
            message: this.$t('msg.deleteSuccess'),
            type: 'success',
            duration: 1000
          })
          this.getList()
          this.dialogFormVisible = false
        })
      },
      updateData() {
        updateAbilityCategory(this.temp).then(res => {
          this.$notify({
            title: this.$t('msg.success'),
            message: this.$t('msg.updateSuccess'),
            type: 'success',
            duration: 1000
          })
          this.getList()
          this.dialogFormVisible = false
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.resetTemp()
        this.configTemp(row)
      },
      // 删除能力记录
      handleDelete(index, row) {
        deleteAbilityCategory({ id: row.id }).then(res => {
          this.resetTemp()
          this.$notify({
            title: this.$t('msg.success'),
            message: this.$t('msg.deleteSuccess'),
            type: 'success',
            duration: 1000
          })
          this.getList()
          this.dialogFormVisible = false
        })
      },
      // 编辑的时候配置参数
      configTemp(item) {
        this.configAddOptions()
        this.temp.id = item.id

        this.temp.categoryId = item.categoryId
        this.temp.abilityCategoryName = item.abilityCategoryName
      },
      cancelDia() {
        this.dialogFormVisible = false
      }
    }
  }

</script>
