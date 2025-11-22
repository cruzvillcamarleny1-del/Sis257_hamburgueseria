<template>
  <div class="cart-icon-container">
    <router-link to="/cart" class="cart-link">
      <div class="cart-icon-wrapper">
        <i class="pi pi-shopping-cart cart-icon"></i>
        <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores'

const cartStore = useCartStore()

// Unwrap to primitive number for template
const totalItems = computed(() => Number(cartStore.totalItems))
</script>

<style scoped>
.cart-icon-container {
  position: relative;
}

.cart-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 190, 51, 0.1);
  transition: all 0.3s ease;
}

.cart-icon-wrapper:hover {
  background: rgba(255, 190, 51, 0.2);
  transform: scale(1.1);
}

.cart-icon {
  font-size: 1.2rem;
  color: #ffbe33;
  transition: color 0.3s ease;
}

.cart-icon-wrapper:hover .cart-icon {
  color: #ffa500;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff5722, #e57373);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .cart-icon-wrapper {
    width: 35px;
    height: 35px;
  }

  .cart-icon {
    font-size: 1.1rem;
  }

  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.65rem;
    top: -6px;
    right: -6px;
  }
}
</style>
