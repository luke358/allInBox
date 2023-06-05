<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { defineModel, ref } from 'vue'
import type { Service } from '../types'

const modelValue = defineModel<boolean>('modelValue', { default: false })

const innerDrawer = ref(false)
const service = ref<Service | null>(null)
function openInnerDrawer(s: Service) {
  innerDrawer.value = true
  service.value = s
}
</script>

<template>
  <el-drawer
    v-bind="$attrs" v-model="modelValue" title="添加服务" size="80%"
    class="top-28px!"
  >
    <div>
      <slot :open-inner-drawer="openInnerDrawer" />
      <el-drawer
        v-model="innerDrawer" class="service-drawer top-28px!"
        :title="service?.name" :append-to-body="true" size="50%"
      >
        <template #header>
          <div flex items-center>
            <img w-40px h-40px src="../assets/vite.svg" alt="">
            <div ml-10px>
              {{ service?.name }}
            </div>
          </div>
        </template>
        <el-form label-position="top">
          <div mb-15px>
            Options
          </div>
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item>
                <el-checkbox label="enable app" name="type" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-checkbox label="allow sounds" name="type" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item text-wrap>
                <el-checkbox label="show app name in tab" name="type" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-checkbox label="allow notifications" name="type" />
              </el-form-item>
            </el-col>
          </el-row>

          <div my-15px>
            Unread counter
          </div>
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item text-wrap>
                <el-checkbox label="display in tab" name="type" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-checkbox label="include in global" name="type" />
              </el-form-item>
            </el-col>
          </el-row>

          <div mt-15px mb-10>
            Link handling
          </div>
          <el-form-item>
            <el-select label="include in global" name="type" />
          </el-form-item>

          <div mt-15px mb-10>
            Hibernate
          </div>
          <el-row>
            <el-form-item>
              <el-checkbox label="enable hibernate" name="type" />
            </el-form-item>
          </el-row>
          <el-form-item>
            <span mr-10px>After</span> <el-input inline-block class="w-50px!" /> <span ml-10px>minutes</span>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </el-drawer>
</template>

<style lang="scss">
.el-overlay {
  .service-drawer {
    .el-drawer__header {
      margin-bottom: 0px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-form {
  :deep() {
    .el-col {
      .el-form-item {
        margin-bottom: 0;

        .el-checkbox {
          align-items: flex-start;
          height: 28px;

          .el-checkbox__label {
            width: 100%;
            white-space: pre-wrap;
            color: #000;
            font-size: 16px;
          }
        }
      }
    }

  }
}
</style>
