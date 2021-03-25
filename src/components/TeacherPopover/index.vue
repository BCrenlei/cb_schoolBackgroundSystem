<template>
  <div style="width:400px; height:400px; position:relative;">
    <el-checkbox-group v-model="checkList" @change="checkboxGroup">
      <el-checkbox :label="item.name" v-for="item in teacherList"></el-checkbox>
    </el-checkbox-group>
    <div style="text-align:center; width:100%; position:absolute; left:0; bottom:0">
      <el-button size="mini" type="primary" @click="getResult">确认科目老师</el-button>
    </div>
  </div>
</template>
<script>
  import * as common from '@/utils/config'
  export default {
    name: 'TeacherPopover',
    data() {
      return {
        checkList: [],
        teacherListCache: null,
        teacherCourse: null,
        teacherData: [],
      }
    },
    props: {
      teacherList: {
        type: Array,
      }
    },
    mounted() {
      this.teacherCourse = {
        course: this.teacherList[0].course
      }
    },
    methods: {
      checkboxGroup(e) {
        // let result = e.toString();
        // //得到checkbox选中的老师
        // this.teacherListCache = result.split(',');
        //现在需要把所有的选中的老师 + 科目 + 基本信息 融合到一条数据里面，然后表格展示
        let teacherData = [];
        let extendArray;
        for (let i = 0; i < e.length; i++) {
          extendArray = common.extend(
            //科目
            this.teacherCourse,
            //名字
            {
              name: e[i]
            },
            //基本信息，
            {
              manyCourse: '', //每周几节课
              manyClass: '', //负责几个班
              backToBack: '', //连堂次数
              backToBacks: '', //一次连堂几节课
            }

          )
        //   console.log(extendArray);
          this.teacherData.push(extendArray)
        }
        console.log(this.teacherData);

      },
      getResult() {
        this.$emit('addteacher', {
          data: this.teacherData,
          insetIndex: 1 //在第几项后面开始加，因为添加科目列表是分语文数学排列的，如果是添加的数学老师，就应该是到表格的数学的最后面添加，这里的1只是模拟数据
        });
      }
    }
  }

</script>
