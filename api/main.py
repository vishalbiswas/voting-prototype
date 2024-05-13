from voter import create_app
from voter.services.socket import socketio

app = create_app()


if __name__ == '__main__':
    # TODO: figure out a better way to run socketio
    socketio.run(app)
