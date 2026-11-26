# ruma-web — Sitio Web Oficial de ruma

Sitio web oficial, presentación de producto y documentos legales de **ruma**, diseñado para funcionar con dominio propio (GitHub Pages, Cloudflare Pages o Vercel) y cumplir los requisitos de verificación de **Google OAuth 2.0** y **Google Play Store**.

## Páginas incluidas

| Archivo | Propósito |
| :--- | :--- |
| `index.html` | Landing oficial (vista previa interactiva, funciones, cómo funciona, Plan Free vs ruma Plus y FAQ) |
| `terminos.html` (y alias `terms.html`) | Términos y Condiciones de Uso |
| `privacidad.html` (y alias `privacy.html`) | Política de Privacidad (incluye declaración de Uso Limitado de Google API Services) |
| `eliminar-cuenta.html` | Eliminación de Cuenta y Datos (URL requerida por Google Play Store) |

## Cómo conectar tu dominio propio (ej. `ruma.app` o `getruma.com`)

### Opción A — GitHub Pages (Gratis + HTTPS automático)
1. Compra tu dominio (Namecheap, Cloudflare Registrar, Porkbun, GoDaddy, etc.).
2. En el panel DNS de tu dominio crea estos registros:
   - **4 registros `A`** para el dominio raíz (`@`):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **1 registro `CNAME`** para `www` apuntando a `kevingomez-04.github.io`.
3. En GitHub: **Settings → Pages → Custom domain**, escribe tu dominio (ej. `tudominio.com`), guarda y marca **Enforce HTTPS**.
4. Opcional: agrega un archivo `CNAME` en la raíz de este repositorio con una única línea que contenga `tudominio.com`.

### Opción B — Cloudflare Pages (Gratis + CDN global ultrarrápido)
1. Conecta este repositorio `KEVINGOMEZ-04/ruma-web` en Cloudflare Pages (sin comando de build, directorio de salida `/`).
2. Agrega tu dominio propio en **Custom domains**.

## URLs listas para Google OAuth y Google Play Store
Una vez conectes tu dominio (`https://tudominio.com`):
- **Página principal**: `https://tudominio.com/`
- **Política de Privacidad**: `https://tudominio.com/privacidad.html`
- **Términos y Condiciones**: `https://tudominio.com/terminos.html`
- **Eliminación de cuenta y datos (Play Store)**: `https://tudominio.com/eliminar-cuenta.html`
