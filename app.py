from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, send

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = 'super secret key'
socketio = SocketIO(app)


users = {}


@app.route('/')
def main():
    return render_template('index.html', check=False)


@socketio.on('disconnect')
def disconnect():
    try:
        cur_user = ""
        for username, sid in users.items():
            if sid == request.sid:
                cur_user = username
        del users[cur_user]
        emit('user_connected', list(users.keys()), broadcast=True)
    except:
        print("Disconnected")


@socketio.on('join')
def join(data):
    username = data.get('username')
    if username:
        users[username] = request.sid
        emit('user_connected', list(users.keys()), broadcast=True)


@socketio.on('msg_recv')
def msg_recv(data):
    try:
        msg = data['msg'] + "\n"
        username = data['username']
        sid_send = users[username]
        emit('send_message', msg, to=sid_send)
    except:
        print("You are alone")

if __name__ == '__main__':
    socketio.run(app, allow_unsafe_werkzeug=True, debug=True)