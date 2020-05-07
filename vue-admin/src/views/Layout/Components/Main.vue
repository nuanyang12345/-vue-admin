<template>
  <div id="main-wrap">
    <!-- <el-card class="main-card"> -->
    <router-view />
    <!-- </el-card> -->
  </div>
</template>

<script>
export default {
  name: "LayoutMain",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
#main-wrap {
  position: fixed;
  left: $navMenu;
  top: 75px;
  right: 0;
  bottom: 0;
  border: 30px solid #f7f7f7;
  border-bottom: none;
  box-sizing: border;
  // position: fixed;
  // height: 100%;
  // width: 100%;
  // top: 75px;
  // left: $navMenu;
  // right: 0;
  // box-sizing: border;
  // background: #f7f7f7;
  // .main-card {
  //   height: 100%;
  //   width: 100%;
  //   margin: 30px;
  //   margin-bottom: 0;
  //   background-color: #fff;
  // }
}
</style>
