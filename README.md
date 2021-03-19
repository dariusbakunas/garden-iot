# Small Garden IOT app

Node.js app to control water pump to refill hydroponics garden container. Both water container levels measured using HC-SR04 sensors connected to Raspberry PI.

![screenshot](https://github.com/dariusbakunas/garden-iot/blob/master/doc/screen01.png?raw=true)

## Setup

* Setup GPIO access:

```bash
# check first, you may not need to change anything:
ls -al /dev/gpiomem
crw-rw---- 1 root gpio 246, 0 Mar 18 20:38 /dev/gpiomem

sudo groupadd gpio
sudo usermod -a -G gpio $USER
sudo chown root.gpio /dev/gpiomem
sudo chmod g+rw /dev/gpiomem
```

### USB Camera:

* Install motion for camera stream:

```bash
sudo apt-get install motion
```

* Edit `/etc/motion/motion.conf`:

```yaml
daemon on
quality 100
stream_quality 100
stream_localhost off
webcontrol_localhost on

width 1920
height 1080
```

* Edit `/etc/default/motion`:

```yaml
start_motion_daemon=yes
```

* Restart it:

```bash
sudo systemctl restart motion
```

* Access it at `http://[hostname]:8081`