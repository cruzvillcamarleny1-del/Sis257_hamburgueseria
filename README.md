# Sis257_hamburgueseria
Esta aplicación web está desarrollada para administrar de forma eficiente todas las operaciones de una hamburguesería, integrando en una sola plataforma las áreas de atención al cliente, cocina y administración. Su objetivo es facilitar la gestión diaria del negocio, optimizar los procesos internos y mejorar la experiencia tanto del personal como del cliente.

El sistema permite registrar y gestionar pedidos en línea, organizar el menú, controlar el inventario de insumos, administrar empleados y mantener un registro detallado de ventas y proveedores. Gracias a su diseño web, puede accederse desde cualquier dispositivo con conexión a Internet, lo que brinda flexibilidad y control en tiempo real.

Además, la aplicación ofrece reportes y estadísticas que apoyan la toma de decisiones estratégicas, automatiza tareas repetitivas y reduce errores humanos, contribuyendo a un servicio más ágil, preciso y profesional.

asd
1. Producto

Contiene la información de cada artículo del menú (hamburguesas, bebidas, acompañamientos, etc.).
Atributos:

id


nombre

descripción

precio

categoría_id (relación con Categoría)

stock (cantidad disponible)

imagen (opcional, para mostrar en el menú web)

2. Categoría

Clasifica los productos del menú.
Atributos:

id

nombre (Ej: Hamburguesas, Bebidas, Papas, Postres)

descripción

3. Cliente

Registra los datos de los clientes (pueden ser presenciales o pedidos online).
Atributos:

id

nombre

celular

dirección (opcional, útil para pedidos a domicilio)

email (opcional, para usuarios registrados)

4. Pedido

Representa una orden realizada en el sistema.
Atributos:

id

cliente_id (opcional si es anónimo)

empleado_id (quien toma o entrega el pedido)

fecha

hora

total

método_pago (efectivo, tarjeta, QR, etc.)

tipo (en local, para llevar, delivery)

estado (pendiente, en preparación, listo, entregado, cancelado)

5. DetallePedido

Relaciona los productos incluidos en cada pedido.
Atributos:

id

pedido_id

producto_id

cantidad

precio_unitario

subtotal

6. Empleado

Registra la información del personal de la hamburguesería.
Atributos:

id

nombre

rol (cajero, cocinero, mesero, administrador)

celular

usuario (para login)

contraseña (encriptada)

7. Proveedor

Almacena los datos de los proveedores de insumos.
Atributos:

id

nombre

contacto (teléfono, email)

productos_suministrados

fecha_ultima_compra (opcional)

8. Inventario

Controla los insumos y materias primas utilizadas en la preparación de los productos.
Atributos:

id

nombre_insumo

cantidad_disponible

unidad_medida (kg, litros, unidades, etc.)

proveedor_id (relación con Proveedor)

fecha_actualización

9. MovimientoInventario

Registra las entradas y salidas del inventario.
Atributos:

id

inventario_id

tipo_movimiento (entrada o salida)

cantidad

fecha

motivo (compra, uso en pedido, ajuste, pérdida, etc.)

empleado_id (quien realiza el movimiento)

10. Reporte (opcional, si se genera automáticamente)

Permite registrar y consultar estadísticas o reportes del negocio.
Atributos:

id

tipo_reporte (ventas, inventario, empleados, etc.)

fecha_generación

periodo (rango de fechas)

contenido (detalle o resumen del reporte)

s