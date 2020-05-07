<template>
  <div>
    <LayoutHeader></LayoutHeader>
    <LayoutMain></LayoutMain>
    <LayoutNav></LayoutNav>
  </div>
</template>

<script>
import LayoutHeader from "./Components/Header";
import LayoutMain from "./Components/Main";
import LayoutNav from "./Components/Nav";
export default {
  name: "Layout",
  components: { LayoutHeader, LayoutMain, LayoutNav },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
