<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="g_hasPerm('role:add')" class="filter-item" style="margin-left: 10px;" @click="showCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>


    <el-table :data="list" v-loading.body="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row>
      <el-table-column align="center" :label="this.$t('list.id')" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('list.userGroup')" prop="roleName" width="150">
      </el-table-column>

      <el-table-column align="center" :label="$t('list.menu')" width="600">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roleName==adminName" type="success">全部</el-tag>
          <div v-else>
            <div v-for="menu in scope.row.menus"  style="text-align: left;margin:5px 0 5px 120px;">
              <span style=" width: 120px;display: inline-block;text-align: right ">{{menu.menuName}}</span>
              <el-tag v-for="perm in menu.permissions" :key="perm.permissionName" v-text="perm.permissionName" style="margin-right: 3px;" type="primary"></el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="220" v-if="g_hasPerm('role:update') ||g_hasPerm('role:delete') ">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)" v-if="g_hasPerm('role:update')">{{$t('operate.edit')}}
            </el-button>
            <el-button v-if="g_hasPerm('role:delete')" type="danger" icon="delete" @click="removeRole(scope.$index)">
              {{$t('operate.delete')}}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempRole" label-position="left" label-width="110px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('list.userGroup')" required>
          <el-input type="text" v-model="tempRole.roleName" style="width: 250px;">
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('list.menu')" required>
          <div v-for=" (menu,_index) in allPermission" :key="menu.menuName">
            <span style="width: 100px;display: inline-block;">
              <el-button :type="isMenuNone(_index)?'':(isMenuAll(_index)?'success':'primary')" size="mini" style="width:120px;" @click="checkAll(_index)">{{menu.menuName}}</el-button>
            </span>
            <div style="display: inline-block;margin-left:20px;">
              <el-checkbox-group v-model="tempRole.permissions">
                <el-checkbox v-for="perm in menu.permissions" :label="perm.id" @change="checkRequired(perm,_index)" :key="perm.id">
                  <span :class="{requiredPerm:perm.requiredPerm===1}">{{perm.permissionName}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <p style="color:#848484;">说明:红色权限为对应菜单内的必选权限</p>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createRole">{{$t('new.confirm')}}</el-button>
        <el-button type="primary" v-else @click="updateRole">{{$t('new.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

import { listAllPermission, listRole, addRole, updateRole, deleteRole } from '@/api/roles'
import waves from '@/directive/waves' // 水波纹指令
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i
  }
  return -1
}
Array.prototype.remove = function(val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

export default {
  directives: {
    waves
  },
  data() {
    return {
      list: [], // 表格的数据
      allPermission: [],
      listLoading: false, // 数据加载等待动画
      dialogStatus: 'create',
      dialogFormVisible: false,
      listQuery: {
        pageNum: 1,
        pageRow: 20,
        importance: undefined,
        title: undefined
      },
      textMap: {
        update: '编辑',
        create: '新建身份'
      },
      tempRole: {
        roleName: '',
        roleId: '',
        permissions: []
      },
      adminName: '管理员'
    }
  },
  created() {
    this.getList()
    this.getAllPermisson()
  },
  methods: {
    getAllPermisson() {
      // 查询所有权限
      listAllPermission().then(data => {
        this.allPermission = data.list
      })
    },
    getList() {
      // 查询列表
      this.listLoading = true
      listRole(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.list
        this.total = response.totalCount
      })
    },
    getIndex($index) {
      // 表格序号
      return (
        (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      )
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
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
    showCreate() {
      // 显示新增对话框
      this.tempRole.roleName = ''
      this.tempRole.roleId = ''
      this.tempRole.permissions = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    showUpdate($index) {
      const role = this.list[$index]
      this.tempRole.roleName = role.roleName
      this.tempRole.roleId = role.roleId
      this.tempRole.permissions = []

      for (let i = 0; i < role.menus.length; i++) {
        const perm = role.menus[i].permissions
        for (let j = 0; j < perm.length; j++) {
          this.tempRole.permissions.push(perm[j].permissionId)
        }
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    createRole() {
      if (!this.checkRoleNameUnique()) {
        return
      }
      if (!this.checkPermissionNum()) {
        return
      }

      // roleName,permissions,institution

      // 添加新用户组
      addRole(this.tempRole).then(() => {
        this.getList()
        this.dialogFormVisible = false
      })
    },
    updateRole() {
      if (!this.checkRoleNameUnique(this.tempRole.roleId)) {
        return
      }
      if (!this.checkPermissionNum()) {
        return
      }
      // 修改用户组
      updateRole(this.tempRole).then(() => {
        this.getList()
        this.dialogFormVisible = false

        this.$store.dispatch('ChangeRoles')
      })
    },
    checkPermissionNum() {
      // 校验至少有一种权限
      if (this.tempRole.permissions.length === 0) {
        this.$message.error('请至少选择一种权限')
        return false
      }
      return true
    },
    checkRoleNameUnique(roleId) {
      // 校验名称重复
      const roleName = this.tempRole.roleName
      if (!roleName) {
        this.$message.error('请填写身份名称')
        return false
      }
      const roles = this.list
      let result = true
      for (let j = 0; j < roles.length; j++) {
        if (
          roles[j].roleName === roleName &&
                    (!roleId || roles[j].roleId !== roleId)
        ) {
          this.$message.error('身份名称已存在')
          result = false
          break
        }
      }
      return result
    },
    removeRole($index) {
      const _vue = this
      this.$confirm('确定删除此身份?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const role = _vue.list[$index]
        const params = {
          roleId: role.roleId
        }
        deleteRole(params).then(() => {
          _vue.getList()
        })
          .catch(e => {})
      })
    },
    isMenuNone(_index) {
      // 判断本级菜单内的权限是否一个都没选
      const menu = this.allPermission[_index].permissions
      let result = true
      for (let j = 0; j < menu.length; j++) {
        if (this.tempRole.permissions.indexOf(menu[j].id) > -1) {
          result = false
          break
        }
      }
      return result
    },
    isMenuAll(_index) {
      // 判断本级菜单内的权限是否全选了
      const menu = this.allPermission[_index].permissions
      let result = true
      for (let j = 0; j < menu.length; j++) {
        if (this.tempRole.permissions.indexOf(menu[j].id) < 0) {
          result = false
          break
        }
      }
      return result
    },
    checkAll(_index) {
      // 点击菜单   相当于全选按钮
      const v = this
      if (v.isMenuAll(_index)) {
        // 如果已经全选了,则全部取消
        v.noPerm(_index)

        // 学生新增编辑 老师新增编辑 学生档案新增编辑
        if ((_index === 2) || (_index === 3) || (_index === 4)) {
          this.tempRole.permissions.remove(815)
          this.noPerm(6)
        }

        // 班级新增编辑
        if ((_index === 7)) {
          // 需要年级、类型和教室的列表权限
          this.tempRole.permissions.remove(815)
          this.noPerm(6)
          //
          this.tempRole.permissions.remove(812)
          this.noPerm(5)
          //
          this.tempRole.permissions.remove(827)
          this.noPerm(9)
        }

        // 课程新增编辑
        if ((_index === 10)) {
          // 需要年级、类型和老师的列表权限
          this.tempRole.permissions.remove(815)
          this.noPerm(6)
          //
          this.tempRole.permissions.remove(812)
          this.noPerm(5)
          //
          this.tempRole.permissions.remove(803)
          this.noPerm(3)
        }

        // 学习详情新增编辑 能力新增编辑   成绩新增编辑
        if ((_index === 12) || (_index === 13) || (_index === 11)) {
          // 需要年级、类型的列表权限
          this.tempRole.permissions.remove(815)
          this.noPerm(6)
          //
          this.tempRole.permissions.remove(812)
          this.noPerm(5)
        }

        // 能力分类新增编辑
        if ((_index === 14)) {
          // 需要类型的列表权限
          this.tempRole.permissions.remove(812)
          this.noPerm(5)
        }
      } else {
        // 如果尚未全选,则全选
        v.allPerm(_index)
        
        // 学生新增编辑 老师新增编辑 学生档案新增编辑
        if ((_index === 2) || (_index === 3) || (_index === 4)) {
          // 年级 列表
          v.tempRole.permissions.push(815)
          v.makeReuqiredPermissionChecked(6)
          v.tempRole.permissions = v.unique(v.tempRole.permissions)
        }

        // 班级新增编辑
        if ((_index === 7)) {
          // 需要年级、类型和教室的列表权限
          v.tempRole.permissions.push(815)
          v.makeReuqiredPermissionChecked(6)
          //
          v.tempRole.permissions.push(812)
          v.makeReuqiredPermissionChecked(5)
          //
          v.tempRole.permissions.push(827)
          v.makeReuqiredPermissionChecked(9)
          v.tempRole.permissions = v.unique(v.tempRole.permissions)
        }

        // 课程新增编辑
        if ((_index === 10)) {
          // 需要年级、类型和老师的列表权限
          v.tempRole.permissions.push(815)
          v.makeReuqiredPermissionChecked(6)
          //
          v.tempRole.permissions.push(812)
          v.makeReuqiredPermissionChecked(5)
          //
          v.tempRole.permissions.push(803)
          v.makeReuqiredPermissionChecked(3)
          v.tempRole.permissions = v.unique(v.tempRole.permissions)
        }

        // 学习详情新增编辑   能力新增编辑   成绩新增编辑
        if ((_index === 12) || (_index === 13) || (_index === 11)) {
          // 需要年级、类型的列表权限
          v.tempRole.permissions.push(815)
          v.makeReuqiredPermissionChecked(6)
          //
          v.tempRole.permissions.push(812)
          v.makeReuqiredPermissionChecked(5)
          v.tempRole.permissions = v.unique(v.tempRole.permissions)
        }

        // 能力分类新增编辑
        if ((_index === 14)) {
          // 需要类型的列表权限
          v.tempRole.permissions.push(812)
          v.makeReuqiredPermissionChecked(5)
          v.tempRole.permissions = v.unique(v.tempRole.permissions)
        }
      }
    },
    allPerm(_index) {
      // 全部选中
      const menu = this.allPermission[_index].permissions
      for (let j = 0; j < menu.length; j++) {
        this.addUnique(menu[j].id, this.tempRole.permissions)
      }
    },
    noPerm(_index) {
      // 全部取消选中
      const menu = this.allPermission[_index].permissions
      for (let j = 0; j < menu.length; j++) {
        const idIndex = this.tempRole.permissions.indexOf(menu[j].id)
        if (idIndex > -1) {
          this.tempRole.permissions.splice(idIndex, 1)
        }
      }
    },
    addUnique(val, arr) {
      // 数组内防重复地添加元素
      const _index = arr.indexOf(val)
      if (_index < 0) {
        arr.push(val)
      }
    },
    unique(arr) { // 数组去重
      var hash = []
      for (var i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) === -1) {
          hash.push(arr[i])
        }
      }
      return hash
    },
    checkRequired(_perm, _index) {
      // 本方法会在勾选状态改变之后触发
      const permId = _perm.id

      if (this.tempRole.permissions.indexOf(permId) > -1) {
        // 学生新增编辑 老师新增编辑 学生档案新增编辑
        if ((permId === 800 || permId === 801) || (permId === 804 || permId === 805) || (permId === 809 || permId === 810)) {
          // 年级 列表
          this.tempRole.permissions.push(815)
          this.makeReuqiredPermissionChecked(6)
          this.tempRole.permissions = this.unique(this.tempRole.permissions)
        }

        // 班级新增编辑
        if ((permId === 820 || permId === 821)) {
          // 需要年级、类型和教室的列表权限
          this.tempRole.permissions.push(815)
          this.makeReuqiredPermissionChecked(6)
          //
          this.tempRole.permissions.push(812)
          this.makeReuqiredPermissionChecked(5)
          //
          this.tempRole.permissions.push(827)
          this.makeReuqiredPermissionChecked(9)
          this.tempRole.permissions = this.unique(this.tempRole.permissions)
        }

        // 课程新增编辑
        if ((permId === 833 || permId === 832)) {
          // 需要年级、类型和老师的列表权限
          this.tempRole.permissions.push(815)
          this.makeReuqiredPermissionChecked(6)
          //
          this.tempRole.permissions.push(812)
          this.makeReuqiredPermissionChecked(5)
          //
          this.tempRole.permissions.push(803)
          this.makeReuqiredPermissionChecked(3)
          this.tempRole.permissions = this.unique(this.tempRole.permissions)
        }

        // 学习详情新增编辑   能力新增编辑   成绩新增编辑
        if ((permId === 840 || permId === 841) || (permId === 853 || permId === 854) || (permId === 836 || permId === 837)) {
          // 需要年级、类型的列表权限
          this.tempRole.permissions.push(815)
          this.makeReuqiredPermissionChecked(6)
          //
          this.tempRole.permissions.push(812)
          this.makeReuqiredPermissionChecked(5)
          this.tempRole.permissions = this.unique(this.tempRole.permissions)
        }

        // 能力分类新增编辑
        if ((permId === 857 || permId === 858)) {
          // 需要类型的列表权限
          this.tempRole.permissions.push(812)
          this.makeReuqiredPermissionChecked(5)
          this.tempRole.permissions = this.unique(this.tempRole.permissions)
        }

        // 选中事件
        // 如果之前未勾选本权限,现在勾选完之后,tempRole里就会包含本id
        // 那么就要将必选的权限勾上
        this.makeReuqiredPermissionChecked(_index)
      } else {
        // 学生新增编辑 老师新增编辑 学生档案新增编辑
        if ((this.noTwo(permId, 800, 801)) || (this.noTwo(permId, 804, 805)) || (this.noTwo(permId, 809, 810))) {
          this.tempRole.permissions.remove(815)
          this.noPerm(6)
        }

        // 班级新增编辑
        if ((this.noTwo(permId, 820, 821))) {
          // 需要年级、类型和教室的列表权限
          this.tempRole.permissions.remove(815)
          this.noPerm(6)
          //
          this.tempRole.permissions.remove(812)
          this.noPerm(5)
          //
          this.tempRole.permissions.remove(827)
          this.noPerm(9)
        }

        // 课程新增编辑
        if ((this.noTwo(permId, 833, 832))) {
          // 需要年级、类型和老师的列表权限
          this.tempRole.permissions.remove(815)
          this.noPerm(6)
          //
          this.tempRole.permissions.remove(812)
          this.noPerm(5)
          //
          this.tempRole.permissions.remove(803)
          this.noPerm(3)
        }

        // 学习详情新增编辑 能力新增编辑   成绩新增编辑
        if ((this.noTwo(permId, 840, 841)) || (this.noTwo(permId, 853, 854)) || (this.noTwo(permId, 836, 837))) {
          // 需要年级、类型的列表权限
          this.tempRole.permissions.remove(815)
          this.noPerm(6)
          //
          this.tempRole.permissions.remove(812)
          this.noPerm(5)
        }

        // 能力分类新增编辑
        if ((this.noTwo(permId, 857, 858))) {
          // 需要类型的列表权限
          this.tempRole.permissions.remove(812)
          this.noPerm(5)
        }
        // 取消选中事件
        if (_perm.requiredPerm === 1) {
          // 如果是必勾权限,就把本菜单的权限全部移出
          // (其实也可以提示用户本权限是菜单里的必选,请先取消勾选另外几个权限,交互太麻烦,此处就直接全部取消选中了)
          this.noPerm(_index)
        }
      }
    },
    noTwo(id, val1, var2) {
      if ((id === val1 && this.tempRole.permissions.indexOf(var2) === -1) || (id === var2 && this.tempRole.permissions.indexOf(val1) === -1)) {
        return true
      } else {
        return false
      }
    },
    makeReuqiredPermissionChecked(_index) {
      // 将本菜单必选的权限勾上
      const menu = this.allPermission[_index].permissions
      for (let j = 0; j < menu.length; j++) {
        const perm = menu[j]
        if (perm.requiredPerm === 1) {
          // 找到本菜单的必选权限,将其勾上
          this.addUnique(perm.id, this.tempRole.permissions)
        }
      }
    }
  }
}
</script>
<style scoped>
.requiredPerm {
    color: #ff0e13;
}
.el-tag--medium{
  height: 24px;
  line-height: 24px;
}
</style>




// {
//     "returnCode": "100",
//     "returnMsg": "请求成功",
//     "returnData": {
//         "list": [{
//             "permissions": [{
//                 "requiredPerm": 2,
//                 "id": 789,
//                 "permissionName": "新增"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 790,
//                 "permissionName": "修改"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 791,
//                 "permissionName": "删除"
//             }],
//             "menuName": "用户组管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 795,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 796,
//                 "permissionName": "新增"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 797,
//                 "permissionName": "修改"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 798,
//                 "permissionName": "删除"
//             }],
//             "menuName": "角色管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 799,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 800,
//                 "permissionName": "新增"        需要年级的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 801,
//                 "permissionName": "修改"        需要年级的列表权限   
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 802,
//                 "permissionName": "删除"
//             }],
//             "menuName": "学生管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 803,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 804,
//                 "permissionName": "新增"      需要年级的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 805,
//                 "permissionName": "修改"      需要年级的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 806,
//                 "permissionName": "删除"
//             }],
//             "menuName": "老师管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 2,
//                 "id": 808,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 809,
//                 "permissionName": "新增"      需要年级的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 810,
//                 "permissionName": "修改"      需要年级的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 811,
//                 "permissionName": "删除"
//             }],
//             "menuName": "学生档案"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 812,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 813,
//                 "permissionName": "新增"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 814,
//                 "permissionName": "修改"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 851,
//                 "permissionName": "删除"
//             }],
//             "menuName": "分类管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 815,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 816,
//                 "permissionName": "新增"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 817,
//                 "permissionName": "修改"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 818,
//                 "permissionName": "删除"
//             }],
//             "menuName": "年级管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 819,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 820,
//                 "permissionName": "新增"        需要年级、类型和教室的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 821,
//                 "permissionName": "修改"        需要年级、类型和教室的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 822,
//                 "permissionName": "删除"
//             }],
//             "menuName": "班级管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 823,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 824,
//                 "permissionName": "新增"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 825,
//                 "permissionName": "修改"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 826,
//                 "permissionName": "删除"
//             }],
//             "menuName": "学期管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 827,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 828,
//                 "permissionName": "新增"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 829,
//                 "permissionName": "修改"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 830,
//                 "permissionName": "删除"
//             }],
//             "menuName": "教室管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 831,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 832,
//                 "permissionName": "新增"          需要年级、类型和老师的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 833,
//                 "permissionName": "修改"          需要年级、类型和老师的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 834,
//                 "permissionName": "删除"
//             }],
//             "menuName": "课程管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 835,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 836,
//                 "permissionName": "新增"          需要年级、类型的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 837,
//                 "permissionName": "修改"          需要年级、类型的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 838,
//                 "permissionName": "删除"
//             }],
//             "menuName": "成绩管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 839,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 840,
//                 "permissionName": "新增"        需要年级、类型的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 841,
//                 "permissionName": "修改"        需要年级、类型的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 842,
//                 "permissionName": "删除"
//             }],
//             "menuName": "学习详情管"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 846,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 847,
//                 "permissionName": "新增"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 848,
//                 "permissionName": "修改"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 849,
//                 "permissionName": "删除"
//             }],
//             "menuName": "活动管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 852,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 853,
//                 "permissionName": "新增"     需要年级、类型的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 854,
//                 "permissionName": "修改"      需要年级、类型的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 855,
//                 "permissionName": "删除"
//             }],
//             "menuName": "能力管理"
//         },
//         {
//             "permissions": [{
//                 "requiredPerm": 1,
//                 "id": 856,
//                 "permissionName": "列表"
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 857,
//                 "permissionName": "新增"     需要类型的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 858,
//                 "permissionName": "修改"      需要类型的列表权限
//             },
//             {
//                 "requiredPerm": 2,
//                 "id": 859,
//                 "permissionName": "删除"
//             }],
//             "menuName": "能力分类管理"
//         }]
//     }
// }