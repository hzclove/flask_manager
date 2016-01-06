#安装所需的Python库
pip install -r requirements.txt

#start.sh
kill `cat rocket.pid` >/dev/null 2>&1
gunicorn app:app -p rocket.pid -b 0.0.0.0:8000 -D

#stop.sh
kill `cat rocket.pid` >/dev/null 2>&1