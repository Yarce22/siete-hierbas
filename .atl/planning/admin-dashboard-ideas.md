# Admin Dashboard — Ideas de Mejora

> **Contexto**: El dashboard admin de Siete Hierbas lo usan **2 personas sin conocimientos técnicos**. La UX es la diferencia entre que el proyecto sea un éxito o un dolor de cabeza.
>
> Estas son ideas **priorizadas por impacto vs esfuerzo**. No todas van al MVP — ver `master-plan.md` para qué entra en qué fase.

---

## Tier S — Críticas para el MVP (imposible vivir sin ellas)

### 1. Tooltips `?` en cada campo y pestaña
**Qué**: Ícono de interrogación al lado de cada input y pestaña del sidebar. Hover muestra explicación + ejemplo.
**Ejemplo**:
- Campo "Precio": `?` → "Precio en pesos colombianos. Ej: 25000 (sin puntos ni comas)"
- Pestaña "Variantes": `?` → "Si el mismo producto se vende en distintos tamaños o presentaciones"
**Fase**: 3 (base) + 5 (completar)

### 2. Tour de onboarding interactivo
**Qué**: Al primer login, tour guiado paso a paso por las secciones principales. Librería sugerida: `react-joyride` o `driver.js`.
**Ejemplo**: "Bienvenido a Siete Hierbas. Empecemos por cargar tu primer producto…"
**Fase**: 5

### 3. Dashboard home conversacional
**Qué**: No mostrar números fríos. Mostrar mensaje humano con lo importante.
**Ejemplo**:
> "Buenos días, Ana ☀️
> Hoy tenés **3 pedidos nuevos** para revisar y **2 huéspedes llegan esta tarde**.
> Tu producto más vendido esta semana fue **Aceite de Romero 250ml** (15 unidades).
> Atención: **Miel de Eucalipto** está por agotarse (quedan 2)."
**Fase**: 3 + 4 (métricas)

### 4. Confirmaciones antes de acciones destructivas
**Qué**: Modal con texto claro antes de cualquier delete/archive.
**Ejemplo**: "¿Seguro que querés eliminar 'Aceite de Lavanda'? No se perderá — queda en la Papelera por 30 días."
**Fase**: 3

### 5. Vista previa en tiempo real al editar productos
**Qué**: Split-screen. Formulario a la izquierda, preview del producto como lo ve el cliente a la derecha. Se actualiza mientras escriben.
**Fase**: 3

### 6. Mobile-first en el admin
**Qué**: Todo debe ser usable desde celular. Sidebar colapsable, botones grandes (mín 44px), sin tablas horizontales imposibles.
**Fase**: 3 (desde día 1)

---

## Tier A — Alto impacto, esfuerzo razonable

### 7. Plantillas de productos
**Qué**: Al crear producto nuevo, ofrecer plantillas pre-llenadas: "Aceite esencial", "Té en hojas", "Crema", etc. Carga campos típicos (descripción base, variantes comunes, categoría).
**Impacto**: Reduce tiempo de carga de 10 min a 2 min por producto.
**Fase**: 5

### 8. Calendario visual del hostal (drag & drop)
**Qué**: Vista mensual/semanal tipo Google Calendar. Cada habitación es una fila, reservas son bloques coloreados. Se pueden crear/mover reservas arrastrando.
**Librería sugerida**: `FullCalendar` o `react-big-calendar`.
**Fase**: 3 (listado básico) + 5 (drag & drop)

### 9. Notificaciones de stock bajo
**Qué**: Alerta en dashboard + email cuando un producto baja de su `stockMinimo`. También badge rojo en sidebar "Productos (3 alertas)".
**Fase**: 5

### 10. Búsqueda global Cmd+K
**Qué**: Atajo de teclado (y botón en mobile) que abre un palette de búsqueda. Busca en productos, pedidos, reservas, habitaciones.
**Librería**: `cmdk` de Vercel.
**Fase**: 5

### 11. Papelera de reciclaje
**Qué**: Soft delete en todo. Sección "Papelera" donde se puede restaurar lo eliminado en los últimos 30 días.
**Fase**: 3 (soft delete) + 5 (UI papelera)

### 12. Audit log visible
**Qué**: Cada entidad (producto, pedido, reserva) tiene una pestaña "Historial" mostrando quién cambió qué.
**Ejemplo**: "Ana cambió el precio de 23.000 a 25.000 — hace 2 horas"
**Fase**: 5

### 13. Plantillas de mensajes WhatsApp
**Qué**: Respuestas rápidas pre-escritas para el admin. Ej: "Confirmación de pedido", "Aviso de entrega", "Confirmación de reserva".
**Fase**: 5 o post-launch

### 14. Códigos QR por producto
**Qué**: Botón "Imprimir QR" en cada producto. Genera PDF con QR que lleva a la página del producto. Sirve para la tienda física.
**Fase**: Post-launch

### 15. Reportes automáticos semanales
**Qué**: Cada lunes 9am, email al admin con resumen: ventas de la semana pasada, top productos, ocupación del hostal.
**Fase**: Post-launch

---

## Tier B — Quality of life (mejoran la experiencia, no son urgentes)

### 16. Modo simple / Modo avanzado
**Qué**: Toggle en el perfil del admin. Modo simple oculta campos opcionales (SEO, slug, metadata). Modo avanzado muestra todo.

### 17. Duplicar producto
**Qué**: Botón "Duplicar" que crea copia editable. Útil cuando cargan línea de productos similares.

### 18. Exportar a Excel/CSV
**Qué**: Botón en cada listado para exportar. Útil para contabilidad, reportes al contador.

### 19. Gestión de gastos del negocio
**Qué**: Módulo simple para registrar gastos (proveedores, servicios, insumos). Permite calcular ganancia real, no solo ingresos.

### 20. Sistema de etiquetas flexibles
**Qué**: Tags en productos: "orgánico", "vegano", "sin gluten", "artesanal". Filtros en tienda pública usan estas etiquetas.

### 21. Integración con redes sociales
**Qué**: Botón "Compartir en Instagram/Facebook" en cada producto. Genera imagen + texto listos para pegar.

### 22. Banner/promoción del mes
**Qué**: Admin puede cambiar el banner del home desde el dashboard (imagen + texto + link). Sin tocar código.

### 23. Check-in/Check-out digital para huéspedes
**Qué**: Link que se envía al huésped antes del check-in. Formulario simple con datos (documento, firma). Queda registrado en la reserva.

### 24. Calendario con festivos colombianos
**Qué**: En el calendario del hostal, marcar festivos/puentes (típicamente alta ocupación en Colombia).

### 25. Sugerencias de precio
**Qué**: Al cargar un producto nuevo, mostrar "Productos similares en tu catálogo tienen un precio promedio de $X".

---

## Tier C — Post-MVP (nice-to-have)

### 26. Chatbot básico en WhatsApp
Respuestas automáticas fuera de horario con info típica (horarios, ubicación, medios de pago).

### 27. Programa de fidelización
Puntos por compra, niveles (bronce, plata, oro), descuentos exclusivos.

### 28. Sistema de reseñas moderado
Clientes dejan reseñas, admin las aprueba antes de publicarse.

### 29. Gestión de proveedores
Registrar de dónde viene cada producto, stock por proveedor, órdenes de compra.

### 30. Multi-sucursal
Si en el futuro abren otra tienda, poder manejar stock por sucursal.

---

## Principios de Diseño Transversales

Aplican a TODA la interfaz del admin, no a features puntuales:

1. **Lenguaje humano, no técnico**:
   - ❌ "Upload image" → ✅ "Subir foto"
   - ❌ "Required field" → ✅ "Este campo es obligatorio"
   - ❌ "404 Not Found" → ✅ "Esta página no existe"

2. **Feedback visual inmediato**:
   - Toast de éxito al guardar ("✅ Producto guardado")
   - Loader claro ("Subiendo foto… 2 de 3")
   - Error explicado ("No se pudo guardar. Revisá tu conexión a internet")

3. **Botones grandes con ícono + texto**:
   - Mín 44x44px (accesibilidad móvil)
   - Nunca solo ícono — siempre texto

4. **Colores con significado**:
   - Verde: éxito, confirmado, activo
   - Ámbar: atención, stock bajo, pendiente
   - Rojo: error, eliminar, crítico
   - Azul: información, enlaces

5. **Animaciones sutiles, no distractivas**:
   - Transiciones de 150-250ms
   - Nada de bouncing ni easings exagerados

6. **Atajos de teclado documentados**:
   - `?` muestra panel de atajos
   - `Cmd+K` búsqueda global
   - `Cmd+N` nuevo producto (en la vista de productos)

7. **Accesibilidad WCAG AA**:
   - Contraste mínimo 4.5:1
   - Navegación completa por teclado
   - ARIA labels en todo botón ícono
   - Focus visible siempre

---

## Decisión de Prioridades

**MVP debe incluir Tier S completo + Tier A items 7, 8, 9, 11, 12.**
**Lanzamiento sin Tier B es aceptable** — se iteran post-feedback del dueño.
**Tier C es roadmap** — no se discute hasta post-launch.

Esta lista se revisa cada 2 semanas con el dueño para re-priorizar basado en feedback real de uso.
