<template>
  <div class="form-group">
    <label v-if="label" class="form-label">
      <i v-if="icon" :class="[icon, 'mr-2', iconColor]"></i>
      {{ label }}
    </label>
    <div class="input-wrapper" :class="{ 'has-suffix': hasSuffix }">
      <input
        :type="inputType"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="['form-input', { 'error': hasError }]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div v-if="hasSuffix" class="input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  icon?: string
  iconColor?: string
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  iconColor: 'text-green-600'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const slots = useSlots()

const inputType = computed(() => props.type)
const hasError = computed(() => !!props.errorMessage)
const hasSuffix = computed(() => !!slots.suffix)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.input-wrapper {
  position: relative;
}

.input-wrapper.has-suffix .form-input {
  padding-right: 48px;
}

.input-suffix {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.form-input.error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  margin-top: 8px;
  font-size: 14px;
  color: var(--error-color);
}
</style>