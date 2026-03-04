# 🚀 Guía de Instalación — Proaktiva Analizador de Pagarés

## Lo que necesitas instalar (una sola vez)

| Herramienta | Para qué sirve | Descarga |
|-------------|---------------|----------|
| Node.js | Ejecutar el servidor | nodejs.org |
| ngrok | Exponer a internet | ngrok.com |

---

## PASO 1 — Instalar Node.js

1. Ve a **https://nodejs.org**
2. Descarga la versión **LTS** (la recomendada, botón verde)
3. Instala normalmente (siguiente → siguiente → instalar)
4. Verifica abriendo una terminal (CMD o PowerShell en Windows):
   ```
   node --version
   ```
   Debe mostrar algo como: `v20.11.0`

---

## PASO 2 — Configurar el proyecto

1. **Copia la carpeta** `proaktiva-server` a donde quieras en tu laptop
   (por ejemplo: `C:\proaktiva-server` en Windows o `~/proaktiva-server` en Mac)

2. **Abre una terminal** en esa carpeta:
   - Windows: Click derecho en la carpeta → "Abrir en Terminal"
   - Mac: Arrastra la carpeta a la Terminal

3. **Instala las dependencias** (solo la primera vez):
   ```
   npm install
   ```

---

## PASO 3 — Configurar tu API Key

1. Ve a **https://console.anthropic.com/**
2. Inicia sesión o crea cuenta
3. Ve a **"API Keys"** → **"Create Key"**
4. Copia la key (empieza con `sk-ant-...`)
5. Abre el archivo **`.env`** con cualquier editor de texto (Notepad, VS Code, etc.)
6. Reemplaza `sk-ant-PEGA-TU-KEY-AQUI` con tu key real:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-TuKeyReal...
   ```
7. Guarda el archivo

---

## PASO 4 — Iniciar el servidor

En la terminal, dentro de la carpeta del proyecto:
```
npm start
```

Debes ver:
```
  ╔══════════════════════════════════════╗
  ║   Proaktiva — Analizador de Pagarés  ║
  ╠══════════════════════════════════════╣
  ║  Local:   http://localhost:3000      ║
  ╚══════════════════════════════════════╝

  ✅  API Key detectada. Listo para analizar.
```

Prueba abriendo en tu navegador: **http://localhost:3000**

---

## PASO 5 — Exponer a internet con ngrok

Para que cualquier persona pueda acceder desde internet:

### 5a. Instalar ngrok
1. Ve a **https://ngrok.com** → "Sign up" (es gratis)
2. Descarga ngrok para tu sistema operativo
3. Extrae el archivo y coloca `ngrok.exe` (Windows) en la misma carpeta del proyecto

### 5b. Conectar tu cuenta ngrok
En la terminal (nueva ventana, deja el servidor corriendo):
```
ngrok config add-authtoken TU_TOKEN_DE_NGROK
```
(El token lo encuentras en tu dashboard de ngrok al iniciar sesión)

### 5c. Exponer el servidor
```
ngrok http 3000
```

Verás algo como:
```
Forwarding   https://a1b2c3d4.ngrok-free.app  →  http://localhost:3000
```

✅ **Esa URL `https://a1b2c3d4.ngrok-free.app` es tu dirección pública.**
Compártela con quien necesite usar la herramienta.

---

## Uso diario (cada vez que quieras usar la herramienta)

Abre **2 terminales** en la carpeta del proyecto:

**Terminal 1 — Servidor:**
```
npm start
```

**Terminal 2 — Internet:**
```
ngrok http 3000
```

Copia la URL de ngrok y listo.

---

## ⚠️ Notas importantes

- **No compartas** el archivo `.env` con nadie — contiene tu API key
- **ngrok gratuito** cambia la URL cada vez que lo reinicias
  - Para URL fija, ngrok tiene planes de pago (~$8/mes)
  - Alternativa gratuita con URL fija: **Cloudflare Tunnel** (cloudflared)
- El servidor debe estar corriendo en tu laptop para que funcione
- Si apagas la laptop, la herramienta deja de estar disponible

---

## Solución de problemas

| Problema | Solución |
|----------|----------|
| `node: command not found` | Reinstala Node.js y reinicia la terminal |
| `Error: API key no configurada` | Verifica el archivo `.env` |
| `EADDRINUSE port 3000` | Cambia `PORT=3001` en `.env` y usa `ngrok http 3001` |
| ngrok muestra "Tunnel not found" | Reinicia ngrok |

---

## Estructura del proyecto

```
proaktiva-server/
├── server.js        ← El servidor (no modificar)
├── package.json     ← Dependencias
├── .env             ← Tu API key (PRIVADO)
└── public/
    └── index.html   ← La herramienta web
```
