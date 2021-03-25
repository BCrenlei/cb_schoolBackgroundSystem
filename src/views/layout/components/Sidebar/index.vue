<template>
  <scroll-bar>
          <div class="title-container">
        <div style="text-align:center">
          <img class="img-logo" :src="img_logo">
          <!-- <span style="display:inline-block; vertica-align:middle">
            <span class="title-main">CB测评系统</span>
            <span class="title-vice">ASSESSMENT SYSTEM</span>
          </span> -->
        </div>
      </div>
    <el-menu  mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#30334c" text-color="#bfcbd9" active-text-color="#5c9ef8">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

import img_logo from '@/assets/images/logo_inside.png'
export default {
  data() {
    return {
      img_logo
    }
  },

  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>
.title-container {
    position: relative;
    background-color: #30334c;
    padding: 10px  0px;
}
    .img-logo {
        /* vertica-align: middle; */
        width: 90%;
        /* margin: 0px 10px 0px 0px; */
    }
    .title-main {
        font-size: 14px;
        display: block;
        font-weight: 400;
        color: #fff;
        text-align: left;
        font-weight: bold;
    }
    .title-vice {
        font-size: 12px;
        display: block;
        font-weight: 400;
        color: #fff;
        text-align: left;
    }

</style>

