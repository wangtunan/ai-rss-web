<template>
  <Teleport to="body">
    <TransitionGroup tag="div" class="toast-container" name="toast" :style="containerStyle">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="[`toast--${toast.type}`]"
        role="alert"
        @click="removeToast(toast.id)"
      >
        <span class="toast__icon" aria-hidden="true">
          <svg
            v-if="toast.type === 'success'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else-if="toast.type === 'error'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>
        <span class="toast__message">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useToast } from '@/hooks/useToast'

  type Position = 'top' | 'bottom'

  const props = withDefaults(
    defineProps<{
      position?: Position
    }>(),
    {
      position: 'top',
    },
  )

  const { toasts, removeToast } = useToast()

  const containerStyle = computed(() => {
    if (props.position === 'top') {
      return {
        top: '4rem',
        bottom: 'auto',
      }
    }
    return {
      bottom: '1.5rem',
      top: 'auto',
    }
  })
</script>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
  pointer-events: none;
  max-width: 100%;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  background: var(--surface-2);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  color: var(--text);
  font-size: 0.82rem;
  pointer-events: auto;
  cursor: pointer;

  &--success {
    border-color: color-mix(in oklab, var(--accent), transparent 60%);
    background: linear-gradient(
      135deg,
      color-mix(in oklab, var(--accent), transparent 90%),
      var(--surface-2)
    );

    .toast__icon {
      color: var(--accent);
    }
  }

  &--error {
    border-color: color-mix(in oklab, var(--danger), transparent 60%);

    .toast__icon {
      color: var(--danger);
    }
  }

  &--info {
    .toast__icon {
      color: var(--accent);
    }
  }

  &:hover {
    border-color: var(--accent);
  }
}

.toast__icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;

  svg {
    width: 100%;
    height: 100%;
  }
}

.toast__message {
  line-height: 1.2;
}

.toast-enter-active {
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.2s ease-out;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}

.toast-enter-from {
  transform: translateY(-100%);
}

.toast-leave-to {
  transform: translateY(20px);
}
</style>
