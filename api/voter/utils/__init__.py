from flask import jsonify


def send_error(response: str, code: int):
    return jsonify({'message': response}), code
