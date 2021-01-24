#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>
#include <ESP8266WiFi.h> // Esp8266/NodeMCU Library
#include <PubSubClient.h> // MQTT Library

#define PUBLISH_TIME_PERIOD 5000
#define SCA D2
#define SCL D1

const char *ssid = "YOUR_SSID";
const char *password = "YOUR_PASSWORD";
const char *mqtt_server = "192.168.1.66";

const char *topicLightIntensity = "kitchen/ktn-NodeMCU/Light-Intensity/bh1750fvi";
BH1750 lightMeter;

const char *clientID =
	"ktn-NodeMCU"; // The client id identifies the NodeMCU device.

const char *willTopic = "kitchen/ktn-NodeMCU/device"; // Topic Status
const char *willMessage = "offline"; // 0 - Disconnecetd
char buffer[256];

int willQoS = 0;
boolean willRetain = true;
int counter = 0; // Used to reconnect to MQTT server

WiFiClient wifiClient;
PubSubClient client(wifiClient); // 1883 is the listener port for the Broker


unsigned long lastMsg = 0;

void setup_wifi()
{
	delay(10);
	// We start by connecting to a WiFi network
	Serial.println();
	Serial.print("Connecting to ");
	Serial.println(ssid);

	WiFi.mode(WIFI_STA);
	WiFi.begin(ssid, password);

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

void reconnect()
{
	while (!client.connected()) {
		Serial.print("Attempting MQTT connection...");
		if (client.connect(clientID, "", "", willTopic, willQoS,
				   willRetain, willMessage, true)) {
			client.publish(willTopic, buffer, true);
			Serial.println("Connected to MQTT Broker!");
			counter = 0;
		} else {
			Serial.println(
				"Connection to MQTT Broker failed. Trying again in 2 seconds");
			Serial.print("failed, rc=");
			Serial.print(client.state());
			++counter;
			if (counter > 180)
				ESP.reset();
			delay(2000);
		}
	}
}

void setup()
{
	Serial.begin(9600);
	setup_wifi();
	client.setServer(mqtt_server, 1883);

	// Initialize the I2C bus (BH1750 library doesn't do this automatically)
	Wire.begin(D2, D1);
	// On esp8266 you can select SCL and SDA pins using Wire.begin(D4, D3);
	// For Wemos / Lolin D1 Mini Pro and the Ambient Light shield use Wire.begin(D2, D1);

	lightMeter.begin();
	Serial.println(F("BH1750 begin"));

	StaticJsonDocument<256> doc;
	JsonArray sensors = doc.createNestedArray("sensors");
	JsonObject tempHumSensor = sensors.createNestedObject();
	tempHumSensor["type"] = "Light-Intensity";
	tempHumSensor["name"] = "bh1750fvi";

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

void loop()
{
	if (!client.connected()) {
		reconnect();
	}
	client.loop();

	unsigned long now = millis();
	if (now - lastMsg > PUBLISH_TIME_PERIOD) {
		lastMsg = now;

		float lux = lightMeter.readLightLevel();
		Serial.print("Light: ");
		Serial.print(lux);
		Serial.println(" lx");

    char lux_str[16];
    dtostrf(lux, 6, 2, lux_str);

		client.publish(topicLightIntensity,
			       lux_str); // Publishing temperature
	}

	delay(2000);
}