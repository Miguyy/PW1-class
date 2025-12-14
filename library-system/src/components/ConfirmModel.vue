<template>
  <!-- Modal de confirmação para ações destrutivas (ex: remover livro) -->
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>

      <div class="modal-actions">
        <button @click="$emit('cancel')" class="btn btn-secondary">Cancel</button>
        <button @click="$emit('confirm')" class="btn btn-danger">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',

  props: {
    title: {
      type: String,
      default: 'Confirm Action',
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
  },

  emits: ['confirm', 'cancel'],
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-soft);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.modal-content h3 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
  font-size: var(--font-size-lg);
}

.modal-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.btn {
  font-family: inherit;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-primary);
}

.btn-secondary {
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

.btn-danger {
  border-color: var(--color-danger);
}

.btn-danger:hover {
  background: var(--color-danger);
}
</style>
