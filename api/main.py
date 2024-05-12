from voter import create_app
from voter.services.socket import socketio

app = create_app()

if __name__ == '__main__':
    socketio.run(app)
