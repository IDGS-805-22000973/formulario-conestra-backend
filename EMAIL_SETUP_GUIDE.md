# Guía de Configuración - Envío de Emails con Gmail

## Implementación de Envío de Correos

Se ha implementado una nueva funcionalidad que envía un correo automático a **erika.argaez@conestra.mx** cada vez que un candidato completa uno de los formularios disponibles (MOSS o 16PF).

### ¿Qué se envía en el correo?

Cada correo contiene:
- ✅ Nombre del candidato
- ✅ Tipo de formulario respondido (MOSS o 16PF)
- ✅ Fecha y hora de la respuesta

### ¿Cómo configurar Gmail?

Para que funcione el envío de correos, necesitas seguir estos pasos:

#### Paso 1: Habilitar la Autenticación de Dos Factores en Gmail
1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. En el panel izquierdo, selecciona **"Seguridad"**
3. En "Cómo accedes a Google", habilita **"Verificación en dos pasos"**

#### Paso 2: Crear una Contraseña de Aplicación
1. Ve a [myaccount.google.com/security](https://myaccount.google.com/security)
2. En el panel izquierdo, selecciona **"Seguridad"**
3. Desplázate hacia abajo a **"Contraseñas de aplicaciones"**
4. Selecciona **"Correo"** y **"Windows (o tu dispositivo)"**
5. Google generará una contraseña de 16 caracteres - **cópiala**

#### Paso 3: Configurar Variables de Entorno
1. Crea un archivo `.env` en la raíz del proyecto (junto a `package.json`)
2. Agrega las siguientes variables:

```env
# Email Configuration
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

⚠️ **Importante**: 
- `EMAIL_USER` = Tu correo de Gmail completo
- `EMAIL_PASSWORD` = La contraseña de aplicación de 16 caracteres (sin espacios en la configuración real, aunque aquí aparezcan espacios)

### Archivos Modificados

✅ **Nuevos archivos creados:**
- `src/email/email.service.ts` - Servicio de envío de correos
- `src/email/email.module.ts` - Módulo de configuración de emails
- `.env.example` - Plantilla de variables de entorno

✅ **Archivos modificados:**
- `src/app.module.ts` - Se agregó EmailModule
- `src/test-engine/test-engine.module.ts` - Se agregó EmailModule
- `src/test-engine/test-engine.service.ts` - Se integró el envío de correos en `processTest()`

### Cómo Funciona

Cuando un usuario envía un formulario:
1. Se valida que no lo haya contestado antes
2. Se calculan los resultados
3. **Se guarda en la BD**
4. **Se envía automáticamente un correo a erika.argaez@conestra.mx** con el nombre del candidato y el tipo de formulario

### Probando la Funcionalidad

Una vez configurado el `.env`:
1. Inicia el servidor: `npm run start:dev`
2. Un usuario inicia sesión y completa un formulario (MOSS o 16PF)
3. Al hacer submit, debería llegar un correo a erika.argaez@conestra.mx

### Solución de Problemas

**❌ "No me llegan los correos"**
- Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` sean correctos
- Asegúrate de crear la contraseña de aplicación, NO usar la contraseña de Gmail
- Revisa la carpeta de Spam

**❌ "Error 'Invalid login'"**
- La contraseña de aplicación es DIFERENTE a la contraseña de Google
- Debe tener 16 caracteres generados por Google

**❌ "Error de módulo"**
- Asegúrate de instalar Nodemailer: `npm install nodemailer @types/nodemailer`
- Reinicia el servidor

### Dependencias Instaladas

```json
{
  "nodemailer": "instalado",
  "@types/nodemailer": "instalado"
}
```

¡Listo! 🎉 Tu sistema de notificaciones por email está configurado.
