<template>
  <div class="bottom-nav">
    <div 
      v-for="item in navItems" 
      :key="item.name"
      :class="['nav-item', { active: currentRoute === item.route }]"
      @click="navigateTo(item.route)"
    >
      <i :class="['nav-icon', item.icon]"></i>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface NavItem {
  name: string
  label: string
  icon: string
  route: string
}

interface Props {
  items: NavItem[]
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.name as string)
const navItems = computed(() => props.items)

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>