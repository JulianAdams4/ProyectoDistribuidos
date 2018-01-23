# Proyecto Distribuidos

## Introduction

> El proyecto es un sistema web, con una arquitectura de microservicios y una caché para reducir la latencia de acceso a la base de datos.  El sistema web contacta a un microservicio que le retorna las top 10 noticias, para su render en HTML al usuario final. Para evitar saturar la base de datos, se usa una caché en la cual almacenará el resultado del query.


## Explicación
El microservicio funciona de la siguiente manera:
- Comprueba la clave Redis, si existe, se devuelve.
- Si no existe, se realiza la consulta de MySQL y configure la clave, luego se devuelve.

## Instalación

> En la carpeta principal se encontrará un archivo MakeFile. Para instalar las dependencias y correr los distintos servicios se debe realizar un make en esta carpeta.


## Integrantes
- Julián Adams
- Luis Andrade
- John Cedeño
