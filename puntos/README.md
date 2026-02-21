# Sistema de Fidelización de Puntos - XGEREMY™

## ¿Cómo funciona?

### Para el Cliente (Dashboard)
1. Ingresa a `/puntos/` 
2. Escribe tu email
3. Ves tus puntos, tier actual, progreso y leaderboard

### Para ti (Geremy)
1. Editas tu Google Sheet
2. Actualizas puntos cuando el cliente se tatúa
3. El dashboard se sincroniza automáticamente cada 30 segundos

---

## Mecánica de Puntos

### Cashback Principal
- **10% en crédito**
- Cliente gasta **150.000 CLP** → Gana **15 puntos**
- **1 punto = 1.000 CLP** en crédito disponible

### Meta Principal
- **150 puntos** = **Sesión de día completo**
- Valor original: **180.000 CLP**
- Precio real: **120.000 CLP**

### Ejemplo
- Cliente A gasta 150k → 15 puntos (15k CLP crédito)
- Cliente A gasta otros 150k → 30 puntos (30k CLP crédito)
- ... (repite 5 veces)
- Cliente A llegó a 150 puntos → Canjea sesión full day

---

## Bonus Points (Verificación Manual)

Agrega estos puntos manualmente en Google Sheets:

| Acción | Puntos |
|--------|--------|
| Seguir TikTok | +1 |
| Seguir Instagram | +1 |
| 2 tatuajes en 1 mes | +5 |

**Verificación:** El cliente te contacta por TikTok/Instagram y tú verificas + actualizas

---

## Tiers

Calculados automáticamente por el sistema:

| Tier | Puntos | Color |
|------|--------|-------|
| Bronze | 0-50 | 🥉 |
| Silver | 51-100 | 🥈 |
| Gold | 101-150 | 🥇 |

---

## Estructura de Google Sheet

**Nombre de la hoja:** `Cliente`

| Columna | Nombre | Tipo | Ejemplo |
|---------|--------|------|---------|
| A | Nombre | Texto | Geremy Mora |
| B | Email | Texto | geremy@email.com |
| C | Puntos | Número | 145 |
| D | Tier | Texto | Gold |
| E | Último Tatuaje | Texto | 15/02/2026 |
| F | Monto CLP | Número | 250000 |

**Importante:** El header debe estar en la fila 1 (A1:F1)

---

## Dashboard - Qué ve el Cliente

```
┌─────────────────────────────────────────────────────┐
│ XGEREMY™ Puntos                          [Cerrar]   │
├─────────────────────────────────────────────────────┤
│ Hola, Geremy                                        │
│ geremy@email.com                                    │
├─────────────────────────────────────────────────────┤
│  Puntos Totales    │  Tu Tier (Gold)              │
│  145 pts           │  101-150 puntos              │
│  145.000 CLP       │                              │
├─────────────────────────────────────────────────────┤
│ PROGRESO HACIA PRÓXIMO NIVEL (96%)                 │
│ ████████████████░░ | 145/150 puntos               │
│ Te faltan $5.000 para ganar puntos                 │
├─────────────────────────────────────────────────────┤
│ CÓMO GANAR BONUS PUNTOS                            │
│ 📱 Seguir TikTok (+1)                              │
│ 📷 Seguir Instagram (+1)                           │
│ ✨ 2 tatuajes en 1 mes (+5)                        │
├─────────────────────────────────────────────────────┤
│ TOP 3 CLIENTES                                      │
│ 🥇 G.M. - 145 puntos                               │
│ 🥈 C.R. - 98 puntos                                │
│ 🥉 A.M. - 62 puntos                                │
└─────────────────────────────────────────────────────┘
```

---

## Leaderboard

- **Solo 3 nombres públicos** (top)
- **Anonimizados:** "Inicial. Apellido" (ej: "G.M.")
- **Otros clientes ocultos**

Esto motiva a clientes sin revelar identidades

---

## Diseño

✅ Minimalista y oscuro (consistente con tu web)  
✅ Animaciones suaves  
✅ Mobile-first responsive  
✅ Sin distracciones  
✅ Barra de progreso hermosa con gradiente  

---

## Configuración Necesaria

### Opción 1: Google Sheets API (Recomendado)
1. Crear Google Cloud Project
2. Habilitar Google Sheets API
3. Crear API Key
4. Actualizar `SHEET_ID` y `API_KEY` en `app.js`
5. Hacer sheet público (visible para quien tenga link)

Ver: `PUNTOS_SETUP.sh` para guía detallada

### Opción 2: JSON Manual (Sin API)
Si prefieres no usar API:
- Crea archivo `data.json` en `/puntos/`
- Tú lo actualizas manualmente
- El sistema lo sincroniza

Estructura JSON:
```json
[
  {
    "nombre": "Geremy Mora",
    "email": "geremy@email.com",
    "puntos": 145,
    "tier": "Gold",
    "ultimoTatuaje": "15/02/2026",
    "montoCLP": 250000
  }
]
```

---

## Flujo de Funcionamiento

```
1. Cliente se tatúa
   ↓
2. Tú registras gasto en Google Sheet (columna C: Puntos)
   ↓
3. Cliente va a /puntos/ e ingresa su email
   ↓
4. Dashboard sincroniza automáticamente (cada 30 seg)
   ↓
5. Cliente ve sus puntos actualizados
   ↓
6. Cuando llega a 150 puntos, puede canjear sesión
```

---

## Archivos

```
/puntos/
├── index.html          ← Dashboard HTML
├── app.js             ← Lógica JavaScript
└── README.md          ← Este archivo
```

---

## URLs

- **Dashboard:** `https://xgeremy.github.io/puntos/`
- **Sección en homepage:** `https://xgeremy.github.io/#rewards`
- **Botón en homepage:** "Ver mis puntos" → Link a `/puntos/`

---

## Seguridad

✅ **No hay contraseña** (solo email)  
✅ **No hay base de datos en servidor** (todo está en Google Sheets)  
✅ **Sin guardar datos sensibles** (localStorage solo guarda email)  
✅ **API Key restringida** (puedes limitar por dominio)  

---

## Funcionamiento Sin Conexión

Si Google Sheets no está disponible:
- El sistema carga **datos de demo** automáticamente
- Perfecto para testing
- Cuando Google Sheets está disponible, usa datos reales

---

## Sincronización

El dashboard:
- Carga datos al abrir
- Se sincroniza automáticamente cada 30 segundos
- Muestra mensaje de confirmación al actualizar

---

## Próximas Mejoras (Opcionales)

- [ ] Beneficios según tier (descuentos adicionales)
- [ ] Notificaciones cuando faltan pocos puntos para canjear
- [ ] Historial de transacciones
- [ ] QR para verificar puntos en sesión
- [ ] Email de confirmación al canjear
- [ ] Animación al alcanzar 150 puntos

---

## Soporte

**Documentación completa:** Ver `PUNTOS_SETUP.sh`

**Errores comunes:**
1. "API not found" → Habilita Google Sheets API en Cloud Console
2. "Unauthorized" → Verifica API Key y acceso al sheet
3. "Not found" → Verifica SHEET_ID y nombre de hoja "Cliente"

---

**Creado para XGEREMY™ - Tatuajes Blackwork en Viña del Mar**
