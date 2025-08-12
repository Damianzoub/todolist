from flask import Blueprint ,send_from_directory

app_bp = Blueprint('app',__name__)

@app_bp.route('/')
@app_bp.route('/app')
def serve_react_index():
    return send_from_directory('static/react','index.html')

@app_bp.route('/app/<path:path>')
def serve_react_static(path):
    return send_from_directory('static/react',path)