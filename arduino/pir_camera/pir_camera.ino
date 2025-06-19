/*

 This example connects to an unencrypted WiFi network.
 Then it prints the  MAC address of the WiFi shield,
 the IP address obtained, and other network details.

 Circuit:
 * WiFi shield attached

 created 13 July 2010
 by dlf (Metodo2 srl)
 modified 31 May 2012
 by Tom Igoe
 */
#include <ArduinoJson.h>
#include <PubSubClient.h> // MQTT Library
#include <SPI.h>
#include <WiFi101.h>
#define PIR_PIN 1
///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = "YOUR_SSID"; // your network SSID (name)
char pass[] = "YOUR_PASSWORD"; // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS; // the WiFi radio's status

// mqtt
const char *mqtt_server = "192.168.1.69";
const char *topicMotionDetector = "hall/hl-MKR100/Motion-Detector/hc-srR501";
const char *clientID = "hl-MKR100";
const char *willTopic = "hall/hl-MKR100/device"; // Topic Status
const char *willMessage = "offline";             // 0 - Disconnecetd
char buffer[256];
int willQoS = 0;
boolean willRetain = true;
// int counter = 0; // Used to reconnect to MQTT server
WiFiClient wifiClient;
PubSubClient client(wifiClient); // 1883 is the listener port for the Broker

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(clientID, "", "", willTopic, willQoS, willRetain,
                       willMessage, true)) {
      client.publish(willTopic, buffer, true);
      Serial.println("Connected to MQTT Broker!");
      // counter = 0;
    } else {
      Serial.println(
          "Connection to MQTT Broker failed. Trying again in 2 seconds");
      Serial.print("failed, rc=");
      Serial.print(client.state());
      // ++counter;
      // if (counter > 180)
      //   ESP.reset();
      delay(2000);
    }
  }
}

void setup() {
  pinMode(PIR_PIN, INPUT);
  // Initialize serial and wait for port to open:
  Serial.begin(9600);

  setup_wifi();
  delay(20000); /* Power On Warm Up Delay */

  client.setServer(mqtt_server, 1883);


  StaticJsonDocument<256> doc;
  JsonArray sensors = doc.createNestedArray("sensors");
  JsonObject pirSensor = sensors.createNestedObject();
  pirSensor["type"] = "Motion-Detector";
  pirSensor["name"] = "hc-srR501";

  serializeJson(doc, buffer);

  if (client.connect(clientID, "", "", willTopic, willQoS, willRetain,
                     willMessage, true)) {
    // Connecting to MQTT Broker
    client.publish(willTopic, buffer, true);

    Serial.print(clientID);
    Serial.println(" connected to MQTT Broker!");
  } else {
    Serial.print(clientID);
    Serial.println(" connection to MQTT Broker failed...");
  }
}

int warm_up = 1;
void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int sensor_output = digitalRead(PIR_PIN);
  if (sensor_output == LOW) {
    if (warm_up == 1) {
      Serial.print("Warming Up\n");
      warm_up = 0;
      delay(2000);
    }
    client.publish(topicMotionDetector, "No motion detected");
    Serial.print("No object in sight\n");
    delay(1000);
  } else {
    client.publish(topicMotionDetector, "Motion detected");
    Serial.print("Object detected\n");
    warm_up = 1;
    delay(1000);
  }
}
