<template>
  <div class="relative bg-white dark:bg-gray-800 px-4 pt-5 pb-2 shadow-sm">
  <!-- Gradient left border -->
  <div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-500 via-pink-500 to-yellow-500 rounded-l-md"></div>

  <input
    :id="id"
    :value="modelValue"
    :type="type"
    :required="required"
    placeholder=" "
    class="peer w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-transparent text-base py-2 pl-2"
    @input="$emit('update:modelValue', $event.target.value)"
  />
  <label
    :for="id"
    class="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-red-600"
  >
    {{ label }}
  </label>
</div>

</template>

<script setup>
defineProps({
  id: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  label: String,
  required: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>