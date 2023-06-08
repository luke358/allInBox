<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'
import { useVModel } from '@vueuse/core'
import type { Service } from '../types'
import { LinkHandling } from '../types'
import { useServiceStore } from '../store/services'
import { createInitialService, getDomain } from '../utils'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = useVModel(props, 'modelValue', emit)

const services = useServiceStore()

const innerDrawer = ref(false)

const service = ref<Service>(cloneDeep(createInitialService()))
function openInnerDrawer(s?: Service) {
  innerDrawer.value = true
  service.value = cloneDeep(s || createInitialService())
}

const rules = reactive<FormRules>({
  url: [
    { required: true, message: 'Please input url', trigger: 'change' },
    { validator: isUrl, trigger: 'change' },
  ],
})

const formRef = ref<FormInstance>()

async function submit(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate((valid) => {
    if (!valid)
      return

    // visible.value = false
    // setTimeout(() => {
    //   innerDrawer.value = false
    // }, 1000)
    services.addService(service.value)
  })
}

function isUrl(rule: any, value: any, callback: any) {
  // 定义正则表达式
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  // 对输入字符串进行匹配
  if (!pattern.test(value))
    callback(new Error('Please input a valid url'))
  else
    callback()
}
</script>

<template>
  <el-drawer
    v-model="visible" title="添加服务" size="70%"
    class="pt-28px!"
  >
    <template #header>
      <div flex items-center justify-between>
        <div>
          添加服务
        </div>
        <div>
          <el-button
            type="primary" class="bg-hex-469398! px-5px! pr-7px!"
            @click="() => openInnerDrawer()"
          >
            <div class="i-carbon-add " w-25px h-25px /> Add custom app
          </el-button>
        </div>
      </div>
    </template>
    <div>
      <slot :open-inner-drawer="openInnerDrawer" />
      <el-drawer
        v-model="innerDrawer" class="service-drawer pt-28px!"
        :title="service?.name" size="40%"
      >
        <template #header>
          <div flex items-center>
            <img
              w-40px h-40px
              :src="`https://api.iowen.cn/favicon/${getDomain(service.url)}.png`"
              alt=""
            >
            <div ml-10px>
              {{ service?.name }}
            </div>
          </div>
        </template>
        <el-form
          ref="formRef" class="service-form" label-position="top"
          :model="service" :rules="rules"
        >
          <el-form-item label="Url" prop="url">
            <el-input
              v-model="service.url" placeholder="https://example.com"
              label="enable app" name="type"
            />
          </el-form-item>
          <div mb-15px>
            Options
          </div>
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item>
                <el-checkbox
                  v-model="service.enable" label="enable app"
                  name="type"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-checkbox
                  v-model="service.isSoundsEnabled"
                  label="allow sounds" name="type"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item text-wrap>
                <el-checkbox
                  v-model="service.isShowNameInTabEnabled"
                  label="show app name in tab" name="type"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-checkbox
                  v-model="service.isNotificationEnabled"
                  label="allow notifications" name="type"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <div my-15px>
            Unread counter
          </div>
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item text-wrap>
                <el-checkbox
                  v-model="service.isUnreadInTabEnabled"
                  label="display in tab" name="type"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-checkbox
                  v-model="service.isUnreadInGlobalEnabled"
                  label="include in global" name="type"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <div mt-15px mb-10px>
            Link handling
          </div>
          <el-form-item>
            <el-select
              v-model="service.linkHandling" label="include in global"
              name="type"
            >
              <el-option
                v-for="([key, value]) in Object.entries(LinkHandling).filter(([key, value]) => typeof value === 'number')"
                :key="value" :value="value" :label="key"
              />
            </el-select>
          </el-form-item>

          <div mt-15px mb-10px>
            Hibernate
          </div>
          <el-row>
            <el-form-item>
              <el-checkbox
                v-model="service.isHibernateEnabled"
                label="enable hibernate" name="type"
              />
            </el-form-item>
          </el-row>
          <el-form-item>
            <span mr-10px>After</span>
            <el-popover
              placement="top-start" trigger="hover" width="180"
              :disabled="service.isHibernateEnabled"
              :content="!service.isHibernateEnabled ? 'Please enable Hibernate!' : ''"
            >
              <template #reference>
                <el-input
                  v-model="service.timer"
                  :disabled="!service.isHibernateEnabled" inline-block
                  class="w-50px!"
                />
              </template>
            </el-popover>

            <span ml-10px>minutes</span>
          </el-form-item>

          <div absolute bottom-0 left-0 right-0 z-100 grid="~ cols-2">
            <!-- <el-button type="danger" class="rd-0!  h-40px!">
              Remove
            </el-button>
            <el-button type="primary" class="ml-0! rd-0! h-40px!">
              Save
            </el-button> -->
          </div>
          <div absolute bottom-0 left-0 right-0 z-100 grid="~ cols-1">
            <el-button
              type="primary" class="ml-0! rd-0! h-40px!"
              @click="submit(formRef)"
            >
              Add
            </el-button>
          </div>

          <div h-40px w-0 />
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
    .el-form-item__label {
      margin-bottom: 10px;
      color: #000;
      font-size: 16px;
    }

    .el-row {
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
