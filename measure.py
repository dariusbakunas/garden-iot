import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

TRIG_1 = 16
ECHO_1 = 18

def measure_hc(trigPin, echoPin):
    GPIO.setup(trigPin, GPIO.OUT)
    GPIO.setup(echoPin, GPIO.IN)

    GPIO.output(trigPin, False)
    time.sleep(2)

    # 10us pulse to start measurement
    GPIO.output(trigPin, True)
    time.sleep(0.00001)
    GPIO.output(trigPin, False)

    while GPIO.input(echoPin)==0:
        pulse_start = time.time()

    while GPIO.input(echoPin)==1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance, 2)
    GPIO.cleanup()
    return distance

def main():
    distance1 = measure_hc(TRIG_1, ECHO_1)
    print("%f".format(distance1))

if __name__ == "__main__":
    main()