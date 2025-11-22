<template>
  <div class="cart-container">
    <!-- Header -->
    <div class="cart-header">
      <div class="header-content">
        <div class="title-wrapper">
          <i class="pi pi-shopping-cart header-icon"></i>
          <h1 class="main-title">Mi Carrito</h1>
          <p class="subtitle">Revisa y gestiona tus productos</p>
        </div>
        <div class="action-wrapper">
          <router-link to="/" class="continue-shopping-btn">
            <i class="pi pi-arrow-left"></i>
            Continuar Comprando
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="cart-content">
      <div class="cart-wrapper">
        <template v-if="!isEmpty">
          <!-- Cart Items -->
          <div class="cart-items">
            <div
              v-for="item in items"
              :key="item.producto.id"
              class="cart-item"
            >
              <div class="item-image">
                <img
                  v-if="item.producto.imagen"
                  :src="item.producto.imagen"
                  :alt="item.producto.nombre"
                  class="product-image"
                />
                <div v-else class="no-image">
                  <i class="pi pi-image"></i>
                </div>
              </div>

              <div class="item-details">
                <h3 class="item-name">{{ item.producto.nombre }}</h3>
                <p class="item-description">{{ item.producto.descripcion }}</p>
                <div class="item-price">{{ formatBs(item.producto.precio) }}</div>
              </div>

              <div class="item-controls">
                <div class="quantity-controls">
                  <button
                    @click="updateQuantity(item.producto.id, item.cantidad - 1)"
                    class="quantity-btn"
                    :disabled="item.cantidad <= 1"
                  >
                    <i class="pi pi-minus"></i>
                  </button>
                  <span class="quantity">{{ item.cantidad }}</span>
                  <button
                    @click="updateQuantity(item.producto.id, item.cantidad + 1)"
                    class="quantity-btn"
                  >
                    <i class="pi pi-plus"></i>
                  </button>
                </div>

                <div class="item-total">
                  {{ formatBs(item.producto.precio * item.cantidad) }}
                </div>

                <button
                  @click="removeItem(item.producto.id)"
                  class="remove-btn"
                  title="Eliminar producto"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="cart-summary">
            <div class="summary-card">
              <h3 class="summary-title">Resumen del Pedido</h3>

              <div class="summary-row">
                <span>Subtotal ({{ totalItems }} productos)</span>
                <span>{{ formatBs(totalPrice) }}</span>
              </div>

              <div class="summary-row delivery">
                <span>Delivery</span>
                <span>Bs 5.00</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span>Total</span>
                <span>{{ formatBs(totalPrice + 5) }}</span>
              </div>

              <button class="checkout-btn" @click="proceedToCheckout">
                <i class="pi pi-credit-card"></i>
                Proceder al Pago
              </button>

              <button class="clear-cart-btn" @click="clearCart">
                <i class="pi pi-times"></i>
                Vaciar Carrito
              </button>
            </div>
          </div>
        </template>

        <!-- Empty Cart -->
        <template v-else>
          <div class="empty-cart">
            <div class="empty-content">
              <i class="pi pi-shopping-cart empty-icon"></i>
              <h2>Tu carrito está vacío</h2>
              <p>¡Agrega algunos productos deliciosos a tu carrito!</p>
              <router-link to="/" class="shop-now-btn">
                <i class="pi pi-shopping-bag"></i>
                Ir al Menú
              </router-link>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores'
import { useToast } from 'primevue/usetoast'

const cartStore = useCartStore()
const toast = useToast()

// Unwrap to primitives for template use and avoid nested refs
const items = computed(() => cartStore.items)
const totalItems = computed(() => Number(cartStore.totalItems))
const totalPrice = computed(() => Number(cartStore.totalPrice))
const isEmpty = computed(() => Boolean(cartStore.isEmpty))

import { formatBs } from '@/helpers/currency'

function updateQuantity(productoId: number, cantidad: number) {
  cartStore.updateQuantity(productoId, cantidad)
  toast.add({
    severity: 'info',
    summary: 'Cantidad actualizada',
    detail: 'La cantidad del producto fue actualizada',
    life: 1800
  })
}

function removeItem(productoId: number) {
  cartStore.removeFromCart(productoId)
  toast.add({
    severity: 'warn',
    summary: 'Producto eliminado',
    detail: 'El producto fue eliminado del carrito',
    life: 2500
  })
}

function clearCart() {
  if (confirm('¿Seguro que deseas vaciar el carrito?')) {
    cartStore.clearCart()
    toast.add({
      severity: 'info',
      summary: 'Carrito vacío',
      detail: 'Todos los productos fueron eliminados',
      life: 2500
    })
  }
}

function proceedToCheckout() {
  // Placeholder: navigate to checkout route when available
  toast.add({
    severity: 'info',
    summary: 'Próximamente',
    detail: 'La funcionalidad de pago estará disponible pronto',
    life: 3500
  })
}
</script>

<style scoped>
.cart-container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #222831 0%,
    #393e46 25%,
    #222831 50%,
    #393e46 75%,
    #222831 100%
  );
  position: relative;
  overflow-x: hidden;
}

.cart-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.cart-header {
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 2;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.title-wrapper {
  flex: 1;
  min-width: 300px;
}

.header-icon {
  font-size: 2.5rem;
  color: #ffbe33;
  margin-bottom: 1rem;
  display: block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  color: #eeeeee;
  margin: 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 190, 51, 0.9);
  margin: 0.5rem 0 0 0;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.action-wrapper {
  flex-shrink: 0;
}

.continue-shopping-btn {
  background: rgba(255, 190, 51, 0.1);
  color: #ffbe33;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 190, 51, 0.3);
}

.continue-shopping-btn:hover {
  background: rgba(255, 190, 51, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 190, 51, 0.3);
}

.cart-content {
  padding: 0 1.5rem 2rem;
  position: relative;
  z-index: 2;
}

.cart-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cart-item {
  background: rgba(238, 238, 238, 0.98);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 190, 51, 0.2);
  transition: all 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.item-image {
  flex-shrink: 0;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #ffbe33;
}

.no-image {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 235, 59, 0.1));
  border: 2px dashed #ffbe33;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffbe33;
  font-size: 2rem;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222831;
  margin: 0 0 0.5rem 0;
}

.item-description {
  color: #666;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.item-price {
  font-weight: 600;
  color: #ffbe33;
  font-size: 1.1rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 190, 51, 0.1);
  border-radius: 25px;
  padding: 0.5rem;
}

.quantity-btn {
  background: #ffbe33;
  color: #222831;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
}

.quantity-btn:hover:not(:disabled) {
  background: #ffa500;
  transform: scale(1.1);
}

.quantity-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.quantity {
  font-weight: 700;
  color: #222831;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: 700;
  color: #222831;
  font-size: 1.1rem;
  min-width: 80px;
  text-align: right;
}

.remove-btn {
  background: linear-gradient(135deg, #f44336, #e57373);
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(244, 67, 54, 0.4);
}

.cart-summary {
  max-width: 400px;
  margin: 0 auto;
}

.summary-card {
  background: rgba(238, 238, 238, 0.98);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 190, 51, 0.2);
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #222831;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  color: #666;
}

.summary-row.delivery {
  color: #ff9800;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #222831;
  margin: 1rem 0;
}

.summary-divider {
  height: 1px;
  background: rgba(255, 190, 51, 0.3);
  margin: 1rem 0;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(45deg, #ffbe33 0%, #ffa500 100%);
  color: #222831;
  border: none;
  padding: 1rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(255, 190, 51, 0.4);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 190, 51, 0.6);
}

.clear-cart-btn {
  width: 100%;
  background: transparent;
  color: #f44336;
  border: 2px solid #f44336;
  padding: 0.8rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.clear-cart-btn:hover {
  background: #f44336;
  color: white;
  transform: translateY(-2px);
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-content {
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: #ffbe33;
  opacity: 0.8;
  margin-bottom: 1rem;
}

.empty-content h2 {
  font-size: 2rem;
  color: #eeeeee;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.empty-content p {
  color: rgba(255, 190, 51, 0.9);
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
}

.shop-now-btn {
  background: linear-gradient(45deg, #ffbe33 0%, #ffa500 100%);
  color: #222831;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 190, 51, 0.4);
}

.shop-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 190, 51, 0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .main-title {
    font-size: 2.2rem;
  }

  .cart-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .item-controls {
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;
  }

  .cart-summary {
    max-width: 100%;
  }

  .summary-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .cart-header {
    padding: 1.5rem 1rem;
  }

  .cart-content {
    padding: 0 1rem 1.5rem;
  }

  .main-title {
    font-size: 1.8rem;
  }

  .cart-item {
    padding: 1rem;
  }

  .item-name {
    font-size: 1.1rem;
  }
}
</style>
