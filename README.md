# ERPNext HN

Localización Hondureña para ERPNext v15.

## Descripción

Esta aplicación extiende ERPNext con funcionalidades y validaciones fiscales específicas para Honduras, incluyendo:

- Validación de secuencias fiscales (CAI, RTN, etc.)
- Soporte para documentos fiscales como Facturas, Notas de crédito/débito, etc.
- Control de secuencias por tipo de documento y empresa
- Reglas de descuento y actualización de widgets
- Formato en palabras del monto total

## Instalación

```bash
# Clona el repositorio
cd ~/frappe-bench/apps
git clone https://github.com/tu-usuario/erpnext_hn.git

# Instala la app en tu sitio
bench --site tu-sitio install-app erpnext_hn
```

## Requisitos

- ERPNext v15.x
- Frappe Framework v15.x

## Estructura

El JavaScript personalizado se carga globalmente para varios doctypes desde:
```
erpnext_hn/public/js/hnl10n.js
```

## Licencia

MIT
