<template>
  <div class="subscription-modal__overlay" @click.self="emits('close')">
    <section
      class="subscription-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
    >
      <header class="subscription-modal__header">
        <div>
          <p class="subscription-modal__eyebrow">Subscription</p>
          <h2 id="subscription-modal-title" class="subscription-modal__title">管理订阅</h2>
        </div>
        <button class="subscription-modal__close" type="button" aria-label="关闭" @click="emits('close')">
          ×
        </button>
      </header>

      <div class="subscription-modal__body">
        <section
          v-for="group in groups"
          :key="group.key"
          class="subscription-modal__group"
        >
          <h3 class="subscription-modal__group-title">{{ group.label }}</h3>
          <div class="subscription-modal__options">
            <label
              v-for="category in group.categories"
              :key="category.key"
              class="subscription-modal__option"
            >
              <input
                class="subscription-modal__checkbox"
                type="checkbox"
                :checked="draftSelectedIds.has(category.key)"
                @change="toggleCategory(category.key)"
              />
              <img
                class="subscription-modal__option-icon"
                :src="category.icon"
                :alt="category.label"
              />
              <span class="subscription-modal__option-title">{{ category.label }}</span>
            </label>
          </div>
        </section>
      </div>

      <footer class="subscription-modal__footer">
        <span class="subscription-modal__selected">已选择 {{ draftSelectedIds.size }} 个分类</span>
        <div class="subscription-modal__actions">
          <button class="subscription-modal__button" type="button" @click="emits('close')">取消</button>
          <button
            class="subscription-modal__button subscription-modal__button--primary"
            type="button"
            @click="save"
          >
            确认订阅
          </button>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  import { NAV_LIST } from '@/constants/nav'
  import { CATEGORY_META } from '@/constants/news'
  import { NavType } from '@/types/nav'
  import type { SubscriptionCategory } from '@/types/subscription'

  interface IProps {
    /** 已选择分类 ID */
    selectedIds: string[]
  }

  interface IEmits {
    (e: 'close'): void
    (e: 'save', ids: string[]): void
  }

  interface SubscriptionGroup {
    /** 导航分组唯一标识 */
    key: NavType
    /** 导航分组显示名称 */
    label: string
    /** 分组内可订阅分类 */
    categories: SubscriptionCategory[]
  }

  defineOptions({
    name: 'SubscriptionModal',
  })

  const props = defineProps<IProps>()
  const emits = defineEmits<IEmits>()

  const draftSelectedIds = ref(new Set(props.selectedIds))

  const groups = computed<SubscriptionGroup[]>(() =>
    NAV_LIST.filter((nav) => ![NavType.Selected, NavType.Subscription].includes(nav.key))
      .map((nav) => ({
        ...nav,
        categories: Object.entries(CATEGORY_META)
          .filter(([, meta]) => meta.belong_to?.includes(nav.key))
          .map(([key, meta]) => ({ ...meta, key })),
      }))
      .filter((group) => group.categories.length > 0)
  )

  const toggleCategory = (key: string) => {
    const nextSelectedIds = new Set(draftSelectedIds.value)

    if (nextSelectedIds.has(key)) {
      nextSelectedIds.delete(key)
    } else {
      nextSelectedIds.add(key)
    }

    draftSelectedIds.value = nextSelectedIds
  }

  const save = () => {
    emits('save', Array.from(draftSelectedIds.value))
  }

  watch(
    () => props.selectedIds,
    (selectedIds) => {
      draftSelectedIds.value = new Set(selectedIds)
    }
  )
</script>

<style scoped src="./index.scss" lang="scss"></style>
