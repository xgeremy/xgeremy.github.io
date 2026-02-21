# 🎯 CÓMO ACTUALIZAR PUNTOS DE TUS CLIENTES

## Sistema Actual (data.json)

Tu sistema de puntos ahora funciona con un archivo JSON simple llamado `data.json` que está en la carpeta `/puntos/`.

---

## ⚡ OPCIÓN RÁPIDA - Editar Directamente en GitHub

### Pasos:

1. **Ve a tu repositorio en GitHub:**
   ```
   https://github.com/xgeremy/xgeremy.github.io
   ```

2. **Navega a la carpeta puntos:**
   - Haz click en la carpeta `puntos`
   - Abre el archivo `data.json`

3. **Haz click en el ícono de editar (lápiz):**
   - Aparecerá el editor en el navegador

4. **Edita los datos:**
   - Busca el cliente que quieres actualizar
   - Cambia el número de `"puntos"` 

   Ejemplo:
   ```json
   {
     "nombre": "Luis Morales",
     "email": "luis.morales@example.com",
     "puntos": 30,
     "tier": "Bronze",
     "ultimoTatuaje": "12/02/2026",
     "montoCLP": 120000
   }
   ```
   
   Si quieres cambiar a 40 puntos:
   ```json
   "puntos": 40,
   ```

5. **Guarda los cambios:**
   - Baja hasta el botón verde "Commit changes"
   - Agrega un mensaje breve (ej: "Actualizar puntos de Luis M")
   - Haz click en "Commit changes"

**¡Listo!** Los cambios se sincronizarán automáticamente. El cliente verá los nuevos puntos en segundos.

---

## 👤 AGREGAR UN NUEVO CLIENTE

### En el archivo `data.json`:

**Paso 1:** Abre el archivo (como en pasos 1-3 arriba)

**Paso 2:** Ve al final del archivo, ANTES del último `]`

**Paso 3:** Agrega una coma después del último cliente (si no la tiene)

**Paso 4:** Copia este template y rellena:

```json
  {
    "nombre": "NOMBRE DEL CLIENTE",
    "email": "email@ejemplo.com",
    "puntos": 0,
    "tier": "Bronze",
    "ultimoTatuaje": "DD/MM/YYYY",
    "montoCLP": 0
  }
```

### Ejemplo Real:

Si quieres agregar a "Felipe García" que se tatuó hoy y gasta 150.000 CLP:

```json
  {
    "nombre": "Felipe García",
    "email": "felipe.garcia@email.com",
    "puntos": 15,
    "tier": "Bronze",
    "ultimoTatuaje": "17/02/2026",
    "montoCLP": 150000
  }
```

**Importante:**
- No olvides la coma después del cliente anterior
- El `tier` debe ser: "Bronze", "Silver" o "Gold" (el sistema lo calcula, pero lo pones manualmente)
- El email debe ser único (no puede repetirse)

**Guarda:** Botón "Commit changes"

---

## 💰 CÁLCULO DE PUNTOS POR MONTO

Usa esta tabla para saber cuántos puntos sumar:

| Monto CLP | Puntos |
|-----------|--------|
| 50.000    | 5      |
| 75.000    | 8      |
| 100.000   | 10     |
| 125.000   | 12     |
| 150.000   | 15     |
| 175.000   | 17     |
| 200.000   | 20     |

**Fórmula:** `Monto ÷ 10.000 = Puntos`

---

## 🎁 BONUS POINTS - CÓMO SUMARLOS

Cuando el cliente completa una misión:

| Misión | Puntos |
|--------|--------|
| Refiere un amigo | +3 |
| Sigue TikTok | +1 |
| Sigue Instagram | +1 |
| 2 tatuajes en 1 mes (>50k c/u) | +5 |
| Comparte su tatuaje (etiquetado) | +2 |
| Deja reseña (redes/Google) | +2 |

**Ejemplo:**
- Luis M tenía 30 puntos
- Se tatuó hoy (150.000 CLP) = +15 puntos
- Ahora tiene: 30 + 15 = **45 puntos**

---

## 🏆 ACTUALIZAR TIERS AUTOMÁTICOS

El sistema calcula automáticamente el tier según puntos:

- **Bronze:** 0-50 puntos
- **Silver:** 51-100 puntos  
- **Gold:** 101-150 puntos

Pero en el `data.json` puedes ponerlo manualmente. Ejemplo:

```json
{
  "nombre": "Cliente A",
  "email": "a@email.com",
  "puntos": 54,
  "tier": "Silver",  ← Se actualiza automáticamente en el dashboard
  "ultimoTatuaje": "17/02/2026",
  "montoCLP": 150000
}
```

---

## ✅ EJEMPLO COMPLETO DE data.json

```json
[
  {
    "nombre": "Geremy Monsalve",
    "email": "geremymons@gmail.com",
    "puntos": 54,
    "tier": "Silver",
    "ultimoTatuaje": "14/02/2026",
    "montoCLP": 85000
  },
  {
    "nombre": "Luis Morales",
    "email": "luis.morales@example.com",
    "puntos": 30,
    "tier": "Bronze",
    "ultimoTatuaje": "12/02/2026",
    "montoCLP": 120000
  },
  {
    "nombre": "Camila Silva",
    "email": "camila.silva@example.com",
    "puntos": 24,
    "tier": "Bronze",
    "ultimoTatuaje": "10/02/2026",
    "montoCLP": 75000
  },
  {
    "nombre": "NUEVO CLIENTE",
    "email": "nuevo@email.com",
    "puntos": 10,
    "tier": "Bronze",
    "ultimoTatuaje": "17/02/2026",
    "montoCLP": 50000
  }
]
```

---

## 🚨 ERRORES COMUNES

### ❌ "El cliente no aparece en el dashboard"

**Causas posibles:**
1. El email no existe en `data.json`
2. El JSON tiene errores de sintaxis (falta una coma o llaves)

**Solución:**
- Revisa que el email sea exacto
- Usa una herramienta online: https://jsonlint.com/
- Copia tu `data.json` y pégalo ahí para validar

### ❌ "Veo puntos pero el tier no se actualiza"

**El tier se calcula automáticamente**, no necesitas actualizarlo manual en el JSON.

### ❌ "Cambié los puntos pero el cliente sigue viendo los antiguos"

**Espera 5 segundos y recarga la página** (Ctrl+F5)

El navegador a veces cachea datos. Fuerza una recarga completa.

---

## 📱 VERIFICACIÓN DE BONUS POINTS

Cuando alguien completa un bonus:

1. **Verifica por TikTok o Instagram** que realmente cumplió la misión
2. **Suma manualmente los puntos** en `data.json`
3. **Commit en GitHub** con el mensaje: "Bonus points: nombre - misión"

Ejemplo de mensaje:
```
Bonus points: Luis M - referido (+3 puntos)
Bonus points: Camila S - comparte tatuaje (+2 puntos)
```

---

## 🔄 FLUJO TÍPICO

```
1. Cliente se tatúa → Anotate el monto (ej: 150.000 CLP)
2. Ve a GitHub → data.json
3. Busca el cliente → Suma los puntos (150k ÷ 10k = 15 pts)
4. Edita el JSON → Cambias "puntos": 30 a "puntos": 45
5. Commit changes → Listo
6. El cliente refresca /puntos/ → Ve sus nuevos puntos
```

---

## 💡 TIPS

✅ **Haz commits frecuentes** - Es mejor actualizar un cliente a la vez  
✅ **Usa mensajes claros** - "Actualizar puntos: Cliente + Monto"  
✅ **Guarda el número de cliente si es repetidor** - Facilita búsqueda  
✅ **Mantén actualizado el `ultimoTatuaje`** - Para referencia rápida  

---

## 🆘 AYUDA RÁPIDA

**¿Dónde edito?**
→ `https://github.com/xgeremy/xgeremy.github.io/blob/main/puntos/data.json`

**¿Qué si me equivoco?**
→ GitHub guarda el historial. Puedes ver cambios previos en "History"

**¿Puedo automatizar esto?**
→ Sí, después con Google Sheets o una base de datos, pero por ahora es manual y simple

---

**¡Todo funcionando! Ahora solo actualiza el `data.json` cuando tus clientes se tatúen.** 🎨

