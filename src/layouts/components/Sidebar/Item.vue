<script setup>
import { isExternal } from "@@/utils/validate"
import path from "path-browserify"
import Link from "./Link.vue"

const { item, basePath = "" } = defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ""
  }
})

/** 鏄惁濮嬬粓鏄剧ず鏍硅彍鍗? */
const alwaysShowRootMenu = computed(() => item.meta?.alwaysShow)

/** 鏄剧ず鐨勫瓙鑿滃崟 */
const showingChildren = computed(() => item.children?.filter(child => !child.meta?.hidden) ?? [])

/** 鏄剧ず鐨勫瓙鑿滃崟鏁伴噺 */
const showingChildNumber = computed(() => showingChildren.value.length)

/** 鍞竴鐨勫瓙鑿滃崟椤? */
const theOnlyOneChild = computed(() => {
  const number = showingChildNumber.value
  switch (true) {
    case number > 1:
      return null
    case number === 1:
      return showingChildren.value[0]
    default:
      return { ...item, path: "" }
  }
})

/** 瑙ｆ瀽璺緞 */
function resolvePath(routePath) {
  switch (true) {
    case isExternal(routePath):
    case isExternal(basePath):
    default:
      return path.resolve(basePath, routePath)
  }
}
</script>

<template>
  <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
    <Link v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
      <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
        <SvgIcon v-if="theOnlyOneChild.meta.svgIcon" :name="theOnlyOneChild.meta.svgIcon" class="svg-icon" />
        <component v-else-if="theOnlyOneChild.meta.elIcon" :is="theOnlyOneChild.meta.elIcon" class="el-icon" />
        <template v-if="theOnlyOneChild.meta.title" #title>
          <span class="title">{{ theOnlyOneChild.meta.title }}</span>
        </template>
      </el-menu-item>
    </Link>
  </template>
  <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
    <template #title>
      <SvgIcon v-if="item.meta?.svgIcon" :name="item.meta.svgIcon" class="svg-icon" />
      <component v-else-if="item.meta?.elIcon" :is="item.meta.elIcon" class="el-icon" />
      <span v-if="item.meta?.title" class="title">{{ item.meta.title }}</span>
    </template>
    <template v-if="item.children">
      <Item
        v-for="child in showingChildren"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </template>
  </el-sub-menu>
</template>

<style lang="scss" scoped>
@import "@@/assets/styles/mixins.scss";

.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

.el-icon {
  width: 1em !important;
  margin-right: 12px !important;
  font-size: 18px;
}

.title {
  @extend %ellipsis;
}
</style>
