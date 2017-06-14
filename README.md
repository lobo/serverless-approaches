# Investigación Serverless

## Descripción

A continuación se describen los pasos seguidos para implementar el caso de uso "Resize Image" con los siguientes approaches:

1. Serveless Lambda + S3 + APIGateway
2. [Now](https://zeit.co/now)
3. [DigitalOcean](https://www.digitalocean.com) / Servidor local

## Implementación AWS Lambda + S3 + APIGateway

Luego de crear una cuenta en AWS e ingresar en el [sitio](https://console.aws.amazon.com) logueados se realizaron los siguientes pasos:

### Creación y Configuración del S3 Bucket

1. En la [consola de S3](https://console.aws.amazon.com/s3), crear un nuevo [Bucket S3](http://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).
2. Ingresar en "Permissions", "Add Bucket Policy". Agregar una bucket policy para permitir [acceso anónimo](http://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html) (ésto nos permite acceder a las imágenes directamente con el hostname sin estar logueados en AWS).
3. Ingresar en "Static Website Hosting", "Enable website hosting" y en "Index Document" ingresar "index.html"
4. Ingresar Save.

> **Notar:** recordar el nombre del bucket creado y el hostname en el Endpoint.

### Creación de la función Lambda

1. En la [consola de Lambda](https://console.aws.amazon.com/lambda), ingresar en "Create a Lambda Function", "Blank Function".
2. Para seleccionar una integración, en el cuadrado punteado elegir "API Gateway".
3. Para permitir que cualquier usuario invoque el método de APIGateway, por seguridad, elegir Open y después Next.
4. En "Name", ingresar resize. En "Code Entry Type", elegir Upload a .ZIP file.
5. [Descargar](https://github.com/awslabs/serverless-image-resizing/blob/master/dist/function.zip) la función resize provista por awslabs.
6. Ingresar en "Choose Function package" y subir el archivo .ZIP con los contenidos de la función Lambda.
7. Para configurar la función, en "Environment Variables", agregar dos variables:
  * En "Key", ingresar "BUCKET"; en "Value", ingresar el nombre del bucket creado en la [sección anterior](#creacion-y-configuracion-del-s3-bucket).
  * En "Key", ingresar "URL"; en "Value", ingresar el endpoint generado en la [sección anterior](#creacion-y-configuracion-del-s3-bucket), prefijado con http://.

8. Para definir permisos de roles para la función, en "Role", ingresar en "Create a Custom Role". Ingresar en "View Policy Document", "Edit", "Ok".
Copiar el siguiente snippet de código en el documento de políticas de rol, reemplazando YOUR_BUCKET_NAME_HERE con el nombre del bucket creado.

```

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::__YOUR_BUCKET_NAME_HERE__/*"
    }
  ]
}

```

> **Tip:** Notar que cualquier espacio en el documneto puede causar errores de validación.

9. En "Memoria", ingresar 1536. En "Timeout", ingresar 10 segundos.
10. Click en "Next" y "Create function".

> **Notar:** Ingresar en la [sección "Triggers"](https://drive.google.com/open?id=0BxUpOzRGrfFsVlVNUGZ3eGZUVGM) y recordá el hostname en la URL de la función creada.


### Setear la regla de redirección de S3

1. En la [consola de S3](https://console.aws.amazon.com/s3), abrir el bucket creado.
2. Expandir la sección "Static Website Hosting", e ingresar en "Edit Redirection Rules".
3. Copiar el el siguiente snippet de código en la configuración de las reglas de redirección, reemplazando "YOUR_API_HOSTNAME_HERE" con el hostname creado en la sección anterior.

```
<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals/>
            <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
        </Condition>
        <Redirect>
            <Protocol>https</Protocol>
            <HostName>__YOUR_API_HOSTNAME_HERE__</HostName>
            <ReplaceKeyPrefixWith>prod/resize?key=</ReplaceKeyPrefixWith>
            <HttpRedirectCode>307</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
</RoutingRules>

```

### Probar la función Resize

1. Correr el script **aws-upload.sh** de éste repositorio, el mismo sube al bucket 100 imágenes(con las credenciales correspondientes).
2. Una vez subidas, correr el script **resize-images.sh**, el mismo intenta recuperar versiones de las imágenes con un nuevo tamaño.
3. Se puede probar lo mismo desde un browser usando el endpoint del website estático del bucket creado:

```

http://YOUR_BUCKET_WEBSITE_HOSTNAME_HERE/300×300/image_name.jpg

http://YOUR_BUCKET_WEBSITE_HOSTNAME_HERE/25×25/image_name.jpg

http://YOUR_BUCKET_WEBSITE_HOSTNAME_HERE/500×500/image_name.jpg

```

> **Probar con nuestro hostname:** https://k8hf0w4kk9.execute-api.us-east-1.amazonaws.com

> **Troubleshooting:** Se debería ver una versión con otra dimensión de la imágen de testeo. Si no, ingresar en "Monitoring" en la función Lambda
y chequear los logs de CloudWatch para realizar un troubleshooting.

## Implementación [Now](https://zeit.co/now)

[Now](https://zeit.co/now) es una plataforma para hacer deploys de aplicaciones web de una manera muy simple y rápida. Soporta proyectos Docker, Node.js y páginas web estáticas. Con solo un comando, *now*, se realiza el deploy y Now proveé una URL única para acceder a la aplicación.

### Aplicación Node.js
Para realizar la implementación de la misma funcionalidad del punto anterior, pero sin utilizar Amazon Lambda y S3, se decidió desarrollar una simple aplicación web en Node.js. La misma ofrece dos rutas, una para subir nuevas imágenes (`POST /upload`), y la otra para descargar las imágenes con el tamaño solicitado (`GET /images/ANCHOxALTO/imagen.jpg`). Donde `imagen.jpg` es el nombre de la imagen original que se quiere cambiar de tamaño y que se encuentra en la carpeta `originals` luego de haber sido subida. Se escribieron además dos scripts en Python, uno para subir imágenes y el otro para testear el tiempo de descarga de las imagénes resizeadas.

### Deploy
Para hacer deploy en *now*, debemos simplemente:

1. Instalar *now*
```
npm install -g now
```
2. Abrir una terminal y clonar el proyecto
```
git clone https://github.com/lobo/serverless-approaches.git
```
3. Pararnos en el directorio donde se encuentra el archivo *package.json*.
```
cd ./serverless-approaches/node-image-resizer
```
4. Ejecutar el comando *now*
```
now
```

### Script de subida de imágenes
Para ejecutar script hay que:

1. Pararnos en el directorio donde se encuentra el archivo *package.json*.
```
cd ./serverless-approaches/node-image-resizer
```
2. Ejecutar el script con `python` pasando como parámetros el directorio donde se encuentran las imágenes de prueba y la URL donde está corriendo el servicio.
```
python ./uploader/image_uploader.py $PWD/images/originals http://localhost:8080/upload
```

### Scripts de testeo
Para ejecutar script de testeo de descarga multithreading hay que:

1. Pararnos en el directorio donde se encuentra el archivo *test_threads.sh*.
```
cd ./serverless-approaches/node-image-resizer/tester
```
2. Hacer las modificaciones al archivo de acuerdo a la resolución deseada, etc.
3. Ejecutar el script:
```
bash ./test_threads.sh
```

Para ejecutar script de testeo de descarga secuencial hay que:

1. Pararnos en el directorio donde se encuentra el archivo *package.json*.
```
cd ./serverless-approaches/node-image-resizer
```
2. Ejecutar el script con `python` pasando como parámetros el directorio donde se encuentran las imágenes de prueba, la URL donde está corriendo el servicio, el alto y el ancho deseados (150 píxeles para ambos por ejemplo).

```
python ./tester/get_resized_images_test.py $PWD/images/originals http://localhost:8080/images 150 150
```

## Implementación [DigitalOcean](https://www.digitalocean.com) / Servidor local
Para este caso se decidió simplemente utilizar el mismo proyecto Node.js desarrollado en el punto anterior, pero haciendo el deploy en un VPS (Virtual Private Server) que el grupo de trabajo posee en [DigitalOcean](https://www.digitalocean.com).

Para hacer el deploy se debe primero instalar el gestor de paquetes de javascript, [npm](https://www.npmjs.com/), y Node.js.
Una vez instalados, se procede a:

1. Abrir una terminal y clonar el proyecto
```
git clone https://github.com/lobo/serverless-approaches.git
```
2. Pararnos en el directorio donde se encuentra el archivo *package.json*.
```
cd ./serverless-approaches/node-image-resizer
```
3. Instalar las dependencias
```
npm install
```
4. Hacer el deploy
```
node .
```

## Resultados de las pruebas
| Resize                        | localhost | DigitalOcean | Amazon AWS |
| ----------------------------- | ---------:| ------------:| ----------:|
| 100 x 100                     |           |              |            |
| Espacio en disco              | 1811 KB   | 1801 KB      | 1800 KB    |
| Tiempo de resizeo             | 1.8 s     | 1 s          | 30.7 s     |
| Tiempo de descarga sin cacheo | 3.3 s     | 89 s         | 181 s      |
| Tiempo de descarga con cacheo | 0.3 s     | 89 s *       | 82 s       |
| 200 x 200                     |           |              |            |
| Espacio en disco              | 6027 KB   | 5967 KB      | 5960 KB    |
| Tiempo de resizeo             | 1.7 s     | 2.3 s        | 37.3 s     |
| Tiempo de descarga sin cacheo | 5.1 s     | 136 s        | 241 s      |
| Tiempo de descarga con cacheo | 0.3 s     | 118 s        | 121 s      |
| 500 x 500                     |           |              |            |
| Espacio en disco              | 28239 KB  | 28103 KB     | 28003 KB   |
| Tiempo de resizeo             | 2.1 s     | 13.1 s       | 48.5 s     |
| Tiempo de descarga sin cacheo | 14 s      | 289 s        | 364 s      |
| Tiempo de descarga con cacheo | 435 ms    | 292 s *      | 222 s      |
