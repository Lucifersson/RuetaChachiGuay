# Normas de Git y Gestión de Ramas

En este proyecto estamos trabajando con **backend y frontend** en el mismo repositorio.

Para mantener un flujo de trabajo ordenado y poder diferenciar fácilmente qué commits y ramas pertenecen a cada proyecto, se establecen las siguientes "normas".

> No os voy a cortar la cabeza si os olvidais, pero mejor si lo haceis asi (las empresas funcionan parecido)

## Clasificación de ramas

Podemos clasificar las ramas de 4 formas:

- `proyecto` → En nuestro caso puede ser **back** o **front**.  
- `accion` → Define el tipo de cambio que se realiza. Puede ser una de las siguientes:
  - `feature` → Estamos creando una **nueva característica**.  
  - `update` → Estamos **actualizando** una característica existente.  
  - `bugfix` → Estamos **solucionando un bug**.  
  - `hotfix` → Estamos solucionando un bug **de forma urgente**.  

**Ejemplos:**

```text
back/feature/login-usuarios
front/feature/animacion-giro-ruleta
front/bugfix/parada-numero-giro
```

> Utilizar siempre guiones en vez de espacios en el nombre.

> Esta convención permite identificar rápidamente el tipo de trabajo que se está realizando en cada rama.

## Convenciones para commits

Para saber a qué proyecto va dirigido un commit y poder filtrarlos fácilmente:

- `[B] Mensaje` → El commit pertenece al **backend**.
- `[F] Mensaje` → El commit pertenece al **frontend**.
- `[O] Mensaje` → El commit pertenece a **otra parte del proyecto**.

**Ejemplos:**

```text
[B] Implementar login de usuarios
[F] Corregir estilo de la barra de navegación
[O] Modificar README.md de la raíz
```
