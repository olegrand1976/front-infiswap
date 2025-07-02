<template>
    <span :class="cn('loader', colorClass)" />
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils';

type Variant = 'primary' | 'secondary' | 'success' | 'white' | 'dark';

const props = defineProps<{
    variant?: Variant;
}>();

const colorClass = computed(() => {
    switch (props.variant ?? 'primary') {
        case 'primary':
            return 'text-primary';
        case 'secondary':
            return 'text-secondary';
        case 'success':
            return 'text-success';
        case 'white':
            return 'text-white';
        case 'dark':
            return 'text-black';
        default:
            return 'text-blue-500';
    }
});
</script>

<style>
span.loader {
  box-sizing: border-box;
  animation: shadowRolling 2s linear infinite;
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 100%;
}

@keyframes shadowRolling {
  0% {
    box-shadow:
      0px 0 rgba(224, 6, 6, 0),
      0px 0 rgba(0, 0, 0, 0),
      0px 0 rgba(0, 0, 0, 0),
      0px 0 rgba(0, 0, 0, 0);
  }
  12% {
    box-shadow:
      100px 0 currentColor,
      0px 0 rgba(0,0,0,0),
      0px 0 rgba(0,0,0,0),
      0px 0 rgba(0,0,0,0);
  }
  25% {
    box-shadow:
      110px 0 currentColor,
      100px 0 currentColor,
      0px 0 rgba(0,0,0,0),
      0px 0 rgba(0,0,0,0);
  }
  36% {
    box-shadow:
      120px 0 currentColor,
      110px 0 currentColor,
      100px 0 currentColor,
      0px 0 rgba(0,0,0,0);
  }
  50% {
    box-shadow:
      130px 0 currentColor,
      120px 0 currentColor,
      110px 0 currentColor,
      100px 0 currentColor;
  }
  62% {
    box-shadow:
      200px 0 rgba(0,0,0,0),
      130px 0 currentColor,
      120px 0 currentColor,
      110px 0 currentColor;
  }
  75% {
    box-shadow:
      200px 0 rgba(0,0,0,0),
      200px 0 rgba(0,0,0,0),
      130px 0 currentColor,
      120px 0 currentColor;
  }
  87% {
    box-shadow:
      200px 0 rgba(0,0,0,0),
      200px 0 rgba(0,0,0,0),
      200px 0 rgba(0,0,0,0),
      130px 0 currentColor;
  }
  100% {
    box-shadow:
      200px 0 rgba(0,0,0,0),
      200px 0 rgba(0,0,0,0),
      200px 0 rgba(0,0,0,0),
      200px 0 rgba(0,0,0,0);
  }
}
</style>
