<template>
  <div style="height:500px; width:700px;">
    <el-table :data="tableData.classTime" style="width: 100%" :span-method="objectSpanMethod">

      <el-table-column prop="class" label="节次" min-width="20%">
          <template slot-scope="scope">
            <div v-if="scope.row.publicFlag">
                <span>公共时间名称:</span>
                <el-input style="width:100px;margin-right:20px;" v-model="scope.row.name" size="mini"></el-input>
                <span>开始/结束:</span>
                <el-time-select placeholder="开始" size="mini" v-model="scope.row.startTime" style="width:100px" :picker-options="{
                            start: '06:00',
                            step: '00:05',
                            end: '18:30'
                            }">
          </el-time-select>
          <el-time-select placeholder="结束" size="mini" v-model="scope.row.endTime" style="width:100px;margin-right:20px;" :picker-options="{
                            start: '06:00',
                            step: '00:05',
                            end: '18:30',
                            minTime: scope.row.startTime
                            }">
          </el-time-select>
             <span>操作:</span>
             
             <el-button size="mini"  type="danger" @click="deletePublicTime(scope)">删除</el-button> 
            </div>
            <div v-else>{{scope.row.class}}</div>
        </template>
      </el-table-column>
      <el-table-column label="开始时间/结束时间" min-width="40%">
        <template slot-scope="scope">
          <el-time-select placeholder="开始" size="mini" v-model="scope.row.startTime" style="width:100px" :picker-options="{
                            start: '06:00',
                            step: '00:05',
                            end: '18:30'
                            }">
          </el-time-select>
          <el-time-select placeholder="结束" size="mini" v-model="scope.row.endTime" style="width:100px" :picker-options="{
                            start: '06:00',
                            step: '00:05',
                            end: '18:30',
                            minTime: scope.row.startTime
                            }">
          </el-time-select>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="40%">
        <template slot-scope="scope">
          <el-button size="mini" @click="insetPubliTime(scope)">
            在本节课之后添加公共时间段
          </el-button>
           <!-- <el-button size="mini"  type="danger">删除</el-button> --> 
        </template>
      </el-table-column>
    </el-table>
    <div style=" margin-top:20px;text-align: center">
      <el-button type="primary" size="small">保存设置</el-button>
    </div>

  </div>

</template>
<script>
  export default {
    name: 'svg-icon',
    data() {
      return {
        tableData: {
            classTime:[{
                class: '1节',
                starTime: '',
                endTime: '',
                publicTime:false,
                }, {
                class: '2节',
                starTime: '',
                endTime: '',
                publicTime:false,
                },{
                class: '3节',
                starTime: '',
                endTime: '',
                publicTime:false,
                }, {
                class: '4节',
                starTime: '',
                endTime: '',
                publicTime:true,
                }, {
                    publicFlag:true,
                    name: '课间操',
                    startTime: '09:30',
                    endTime: '10:00',
                }, {
                class: '5节',
                starTime: '',
                endTime: '',
                publicTime:false,
                }, {
                class: '6节',
                starTime: '',
                endTime: '',
                publicTime:false,
                }, {
                class: '7节',
                starTime: '',
                endTime: '',
                publicTime:false,
            }]
        }
      }
    },
    props: {},
    mounted() {
        
        // this.tableData.classTime.splice(3,0,this.tableData.classTime[2].publicObj)
    }
    ,
    methods: {
      //删除一条公共时间段
      deletePublicTime(scope) {
          let row = scope.$index;
          this.tableData.classTime.splice(row,1);
          this.tableData.classTime[row-1].publicTime = false;  
      },
      //新增一条公共时间段
      insetPubliTime(scope) {
        let row = scope.$index;
        console.log(row);
        if(this.tableData.classTime[row].publicTime){
            this.$message({
                message: '这节课后已经设置了公共时间段',
                type: 'warning'
            });
            return;
        }
        let publicObj = {
            publicFlag:true,
            name: '',
            startTime: '',
            endTime: '',
        }
        this.tableData.classTime.splice(row+1,0,publicObj)
        this.tableData.classTime[row].publicTime = true;  
      },
        objectSpanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (columnIndex === 0) {
                if(row.publicFlag){
                    return {
                            rowspan: 1,
                            colspan: 3
                        }
                }
                
            } 
        }
    }
    
  }

</script>
