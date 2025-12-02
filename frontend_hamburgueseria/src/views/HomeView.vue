<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick, computed } from 'vue'
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { useCarritoStore } from '@/stores/carrito'

let isotopeInstance: any = null
let owlInited = false
const productos = ref<Producto[]>([])

const carrito = useCarritoStore()

const mensaje = ref('')

const mostrarTodos = ref(false)
const cantidadInicial = 6
const productosMostrados = computed(() =>
  mostrarTodos.value ? productos.value : productos.value.slice(0, cantidadInicial),
)

const textoBusqueda = ref('')

const productosFiltrados = computed(() => {
  const texto = textoBusqueda.value.trim().toLowerCase()
  if (!texto) return productos.value
  return productos.value.filter(
    (p) => p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto),
  )
})

async function cargarProductos() {
  try {
    const res = await http.get('/productos')
    productos.value = res.data
  } catch (error) {
    console.error('Error al cargar productos', error)
  }
}

function agregarAlCarrito(producto) {
  carrito.agregar(producto)
  mensaje.value = '¡Producto agregado al carrito!'
  setTimeout(() => (mensaje.value = ''), 1500)
}

// Isotope (filtros menú)
onMounted(() => {
  const w = window as any
  const $ = w.jQuery || w.$
  if (!$ || !w.Isotope) {
    console.warn('Isotope no disponible')
    return
  }

  const $grid = $('.grid')
  if (!$grid.length) {
    console.warn('No se encontró .grid')
    return
  }

  isotopeInstance = new w.Isotope($grid[0], {
    itemSelector: '.all',
    layoutMode: 'fitRows',
  })

  $('.filters_menu li').on('click.menuFilter', function () {
    const filterValue = $(this).attr('data-filter')
    isotopeInstance.arrange({ filter: filterValue })
    $('.filters_menu li').removeClass('active')
    $(this).addClass('active')
  })
})

// OwlCarousel + Nice Select
onMounted(() => {
  cargarProductos()
  const w = window as any
  const $ = w.jQuery || w.$
  if (!$ || !$.fn) return

  if ($.fn.niceSelect) {
    $('select.nice-select').niceSelect()
  }

  const $owl = $('.client_owl-carousel')
  if ($.fn.owlCarousel && $owl.length && !$owl.hasClass('owl-loaded')) {
    $owl.owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 4500,
      smartSpeed: 800,
      items: 1,
      margin: 0,
      nav: true,
      dots: true,
    })
    owlInited = true
  }
})

watch([productos, mostrarTodos, textoBusqueda], async () => {
  await nextTick()
  const w = window as any
  const $ = w.jQuery || w.$
  if (!$ || !w.Isotope) return

  const $grid = $('.grid')
  if (!$grid.length) return

  if (isotopeInstance) {
    isotopeInstance.destroy()
    isotopeInstance = null
  }

  isotopeInstance = new w.Isotope($grid[0], {
    itemSelector: '.all',
    layoutMode: 'fitRows',
  })

  $('.filters_menu li')
    .off('click.menuFilter')
    .on('click.menuFilter', function () {
      const filterValue = $(this).attr('data-filter')
      isotopeInstance.arrange({ filter: filterValue })
      $('.filters_menu li').removeClass('active')
      $(this).addClass('active')
    })
})

// Limpieza
onBeforeUnmount(() => {
  const $ = (window as any).jQuery || (window as any).$
  if ($) {
    $('.filters_menu li').off('click.menuFilter')
    if (owlInited) {
      $('.client_owl-carousel').trigger('destroy.owl.carousel')
      owlInited = false
    }
  }
  if (isotopeInstance) {
    isotopeInstance.destroy()
    isotopeInstance = null
  }
})
</script>

<template>
  <div>
    <div class="hero_area">
      <div class="bg-box">
        <img src="@/assets/images/hero-bg.jpg" alt="" />
      </div>
      <!-- slider section -->
      <section class="slider_section">
        <div id="customCarousel1" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <div class="container">
                <div class="row">
                  <div class="col-md-7 col-lg-6">
                    <div class="detail-box">
                      <h1>Hamburguesas Deliciosas</h1>
                      <p>
                        Disfruta de las mejores hamburguesas artesanales, preparadas al momento con
                        ingredientes frescos y de calidad. Vive una experiencia única en nuestra
                        hamburguesería, donde el sabor y la atención son nuestra prioridad. ¡Ven y
                        prueba nuestras especialidades, papas crocantes y combos irresistibles!
                      </p>
                      <div class="btn-box">
                        <a href="" class="btn1"> Ordena Ahora </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <div class="container">
                <div class="row">
                  <div class="col-md-7 col-lg-6">
                    <div class="detail-box">
                      <h1>¡Sabor Único en Cada Mordida!</h1>
                      <p>
                        Descubre nuestras hamburguesas premium, preparadas con carne 100% de res,
                        pan artesanal y los mejores ingredientes. Sorpréndete con nuestras salsas
                        caseras y acompaña tu pedido con papas doradas y bebidas refrescantes. ¡Haz
                        de tu comida un momento especial en nuestra hamburguesería!
                      </p>
                      <div class="btn-box">
                        <a href="" class="btn1"> ¡Haz tu pedido! </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <div class="container">
                <div class="row">
                  <div class="col-md-7 col-lg-6">
                    <div class="detail-box">
                      <h1>¡Vive la Experiencia Hamburguesera!</h1>
                      <p>
                        Prueba nuestras hamburguesas exclusivas, preparadas con ingredientes
                        frescos, pan suave y carne jugosa. Disfruta de un ambiente acogedor,
                        atención personalizada y una variedad de opciones para todos los gustos.
                        ¡Haz tu pedido y déjate sorprender por el verdadero sabor de la hamburguesa!
                      </p>
                      <div class="btn-box">
                        <a href="" class="btn1"> ¡Pide Ahora! </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container">
            <ol class="carousel-indicators">
              <li data-target="#customCarousel1" data-slide-to="0" class="active"></li>
              <li data-target="#customCarousel1" data-slide-to="1"></li>
              <li data-target="#customCarousel1" data-slide-to="2"></li>
            </ol>
          </div>
        </div>
      </section>
      <!-- end slider section -->
    </div>
    <!-- offer section -->

    <section class="offer_section layout_padding-bottom">
      <div class="offer_container">
        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <div class="box">
                <div class="img-box">
                  <img src="@/assets/images/o1.jpg" alt="" />
                </div>
                <div class="detail-box">
                  <h5>¡Jueves de Sabor!</h5>
                  <h6><span>20%</span> de Descuento</h6>
                  <a href="">
                    ¡Haz tu pedido!
                    <svg
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 456.029 456.029"
                      style="enable-background: new 0 0 456.029 456.029"
                      xml:space="preserve"
                    >
                      <g>
                        <g>
                          <path
                            d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248
                     c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48
                     C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064
                     c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4
                     C457.728,97.71,450.56,86.958,439.296,84.91z"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296
                     c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z"
                          />
                        </g>
                      </g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="box">
                <div class="img-box">
                  <img src="@/assets/images/o2.jpg" alt="" />
                </div>
                <div class="detail-box">
                  <h5>¡Días de Pizza!</h5>
                  <h6><span>15%</span> de Descuento</h6>
                  <a href="">
                    ¡Haz tu pedido!
                    <svg
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 456.029 456.029"
                      style="enable-background: new 0 0 456.029 456.029"
                      xml:space="preserve"
                    >
                      <g>
                        <g>
                          <path
                            d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248
                     c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48
                     C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064
                     c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4
                     C457.728,97.71,450.56,86.958,439.296,84.91z"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296
                     c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z"
                          />
                        </g>
                      </g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- end offer section -->

    <!-- food section -->

    <section id="food" class="food_section layout_padding-bottom">
      <div class="container">
        <div class="heading_container heading_center">
          <h2>Nuestro Menú</h2>
        </div>

        <div class="buscador_menu mb-4 d-flex justify-content-center">
          <div class="input-group" style="max-width: 400px">
            <input
              type="text"
              v-model="textoBusqueda"
              class="form-control"
              placeholder="Buscar..."
              aria-label="Buscar producto"
            />
            <span class="input-group-text bg-white">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.398a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div class="filters-content">
          <div class="row grid">
            <template
              v-for="producto in mostrarTodos
                ? productosFiltrados
                : productosFiltrados.slice(0, cantidadInicial)"
              :key="producto.id"
            >
              <div
                class="col-sm-6 col-lg-4 all"
                :class="['all', producto.categoria ? producto.categoria.toLowerCase() : '']"
              >
                <div class="box">
                  <div>
                    <div class="img-box">
                      <img :src="producto.imagen" :alt="producto.nombre" />
                    </div>
                    <div class="detail-box">
                      <h5>{{ producto.nombre }}</h5>
                      <p>{{ producto.descripcion }}</p>
                      <div class="options">
                        <h6>{{ producto.precio }} Bs</h6>
                        <button
                          class="btn-agregar-carrito"
                          @click="
                            agregarAlCarrito({
                              id: producto.id,
                              nombre: producto.nombre,
                              precio: producto.precio,
                              cantidad: 1,
                              imagen: producto.imagen,
                            })
                          "
                          title="Agregar al carrito"
                        >
                          <svg
                            width="22"
                            height="22"
                            fill="#fff"
                            viewBox="0 0 24 24"
                            style="vertical-align: middle"
                          >
                            <path
                              d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm1.447-2.105l1.721-7.447c.09-.391-.021-.802-.299-1.104-.278-.302-.687-.444-1.09-.444h-12.778l-.334-2h-2.667v2h1.333l2.334 14h12.667v-2h-11.334l-.334-2h10.334c.403 0 .812-.142 1.09-.444.278-.302.389-.713.299-1.104zm-2.447.105h-9.334l-.667-4h10.668l-.667 4z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div v-if="mensaje" class="toast-advertencia">
              {{ mensaje }}
            </div>
          </div>
        </div>
        <div class="btn-box">
          <a href="#" v-if="!mostrarTodos" @click.prevent="mostrarTodos = true">Ver más</a>
          <a href="#" v-else @click.prevent="mostrarTodos = false">Ver menos</a>
        </div>
      </div>
    </section>

    <!-- end food section -->

    <!-- about section -->

    <section id="about" class="about_section layout_padding">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div class="img-box">
              <img src="@/assets/images/about-img.png" alt="" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="detail-box">
              <div class="heading_container">
                <h2>Sobre Nuestra Hamburguesería</h2>
              </div>
              <p>
                Somos apasionados por las hamburguesas y la buena comida. En nuestra hamburguesería
                combinamos ingredientes frescos, recetas originales y un ambiente acogedor para que
                vivas una experiencia única en cada visita. ¡Ven y descubre por qué somos el lugar
                favorito de los amantes de las hamburguesas!
              </p>
              <a href=""> Conoce más </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- end about section -->

    <!-- book section -->
    <section id="book" class="book_section layout_padding">
      <div class="container">
        <div class="heading_container">
          <h2>Reserva una Mesa</h2>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form_container">
              <form action="">
                <div>
                  <input type="text" class="form-control" placeholder="Your Name" />
                </div>
                <div>
                  <input type="text" class="form-control" placeholder="Phone Number" />
                </div>
                <div>
                  <input type="email" class="form-control" placeholder="Your Email" />
                </div>
                <div>
                  <select class="form-control nice-select wide">
                    <option value="" disabled selected>¿Cuántas personas?</option>
                    <option value="">2</option>
                    <option value="">3</option>
                    <option value="">4</option>
                    <option value="">5</option>
                  </select>
                </div>
                <div>
                  <input type="date" class="form-control" />
                </div>
                <div class="btn_box">
                  <button>Reservar Ahora</button>
                </div>
              </form>
            </div>
          </div>
          <div class="col-md-6">
            <div class="map_container">
              <div id="googleMap"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end book section -->

    <!-- client section -->

    <section class="client_section layout_padding-bottom">
      <div class="container">
        <div class="heading_container heading_center psudo_white_primary mb_45">
          <h2>Lo que dicen nuestros clientes</h2>
        </div>
        <div class="carousel-wrap row">
          <div class="owl-carousel client_owl-carousel">
            <div class="item">
              <div class="box">
                <div class="detail-box">
                  <p>
                    ¡Las mejores hamburguesas que he probado! El ambiente es acogedor y la atención
                    excelente. Sin duda, volveré con mi familia.
                  </p>
                  <h6>Moana Michell</h6>
                  <p>Cliente frecuente</p>
                </div>
                <div class="img-box">
                  <img src="@/assets/images/client1.jpg" alt="" class="box-img" />
                </div>
              </div>
            </div>
            <div class="item">
              <div class="box">
                <div class="detail-box">
                  <p>
                    El mejor lugar para disfrutar hamburguesas deliciosas y un excelente servicio.
                    ¡Siempre salgo satisfecho y con ganas de volver!
                  </p>
                  <h6>Mike Hamell</h6>
                  <p>Cliente feliz</p>
                </div>
                <div class="img-box">
                  <img src="@/assets/images/client2.jpg" alt="" class="box-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- end client section -->
  </div>
</template>

<style>
/* App.vue o cada vista principal */
.main-content,
.hero_area,
.header-section,
.header-content,
.content-card,
.ventas-container,
.productos-container,
.clientes-container,
.proveedor-container {
  padding-top: 90px; /* Ajusta según la altura real de tu header */
}
.buscador_menu .form-control {
  border-radius: 20px 0 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.buscador_menu .input-group-text {
  border-radius: 0 20px 20px 0;
  border-left: none;
}
.btn-agregar-carrito {
  background: linear-gradient(135deg, #ffbe33, #d72323);
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 8px;
}
.btn-agregar-carrito:hover {
  background: linear-gradient(135deg, #d72323, #ffbe33);
}
.toast-advertencia {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #d72323;
  color: #fff;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: fadeInOut 2s;
}
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
