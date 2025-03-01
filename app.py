from flask import Flask, request, jsonify
from deepface import DeepFace
import requests
import os
import imghdr

app = Flask(__name__)
TEMP_IMAGE_PATH = "temp_image.jpg"  # Ruta temporal para la imagen descargada

def download_image(url):
    """Descarga la imagen desde una URL y la guarda temporalmente."""
    try:
        response = requests.get(url, timeout=5)  # Timeout de 5 segundos
        response.raise_for_status()
        
        content_type = response.headers.get("Content-Type", "")
        if not content_type.startswith("image/"):
            return None, "URL does not point to an image"
        
        with open(TEMP_IMAGE_PATH, "wb") as f:
            f.write(response.content)
        
        # Verifica si el archivo es realmente una imagen
        if imghdr.what(TEMP_IMAGE_PATH) is None:
            os.remove(TEMP_IMAGE_PATH)
            return None, "Downloaded file is not a valid image"

        return TEMP_IMAGE_PATH, None
    except requests.exceptions.RequestException as e:
        return None, str(e)

@app.route('/gender', methods=['POST'])
def analyze_gender():
    data = request.json
    if 'image_url' not in data:
        return jsonify({"error": "Missing image_url parameter"}), 400
    
    image_url = data['image_url']
    
    image_path, error = download_image(image_url)
    if error:
        return jsonify({"error": error}), 400

    try:
        result = DeepFace.analyze(image_path, actions=['gender'])
        os.remove(image_path)  # Eliminar imagen después del análisis
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
