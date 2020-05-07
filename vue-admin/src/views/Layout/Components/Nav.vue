<template>
  <div id="nav-wrap">
    <!-- <h1 class="logo"><img src="../../../assets/logo.png" alt="" /></h1> -->
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item, index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title" v-text="item.meta.name"></span>
          </template>
          <template v-for="subItem in item.children">
            <el-menu-item
              v-if="!subItem.hidden"
              :key="subItem.id"
              :index="subItem.path"
            >
              {{ subItem.meta.name }}
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "LayoutNav",
  data() {
    return {
      isCollapse: false,
      routers: []
    };
  },
  methods: {},
  created() {
    this.routers = this.$router.options.routes;
    console.log(this.routers);
  }
};
</script>

<style lang="scss" scoped>
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  .el-menu-vertical-demo {
    width: 100%;
  }
}
</style>
