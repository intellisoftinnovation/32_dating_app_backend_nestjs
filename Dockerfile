# Usa una imagen base con Python 3.9 o superior
FROM python:3.9

# Instala dependencias del sistema para OpenCV
RUN apt-get update && apt-get install -y libglib2.0-0 libsm6 libxext6 libxrender-dev

# Crea un directorio para la app
WORKDIR /app

# Copia los archivos al contenedor
COPY requirements.txt requirements.txt
COPY app.py app.py

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto del servicio Flask
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["python", "app.py"]
