#include <ArduinoJson.h>
#include "DHT.h" // including the library of DHT11 temperature and humidity sensor
#include <ESP8266WiFi.h> // Esp8266/NodeMCU Library
#include <PubSubClient.h> // MQTT Library

#define DHTTYPE DHT11 // DHT 11
#define DHT_DPIN D1
#define BULB_DPIN D3
#define PUBLISH_TIME_PERIOD 5000

// Update these with values suitable for your network.

const char *ssid = "YOUR_SSID";
const char *password = "YOUR_PASSWORD";
const char *mqtt_server = "192.168.1.70";

const char *topicTemperHumid = "livingroom/lr-NodeMCU/Temperature-Humidity/dht11";
const char *topicLightBulb = "livingroom/lr-NodeMCU/Lightbulb/relay-lb-1";
const char *topicLightBulbState = "livingroom/lr-NodeMCU/Lightbulb-state/relay-lb-1";

const char *clientID =
	"lr-NodeMCU"; // The client id identifies the NodeMCU device.

const char *willTopic = "livingroom/lr-NodeMCU/device"; // Topic Status
const char *willMessage = "offline"; // 0 - Disconnecetd
char buffer[256];

int willQoS = 0;
boolean willRetain = true;
int counter = 0; // Used to reconnect to MQTT server

WiFiClient wifiClient;
PubSubClient client(wifiClient); // 1883 is the listener port for the Broker

DHT dht(DHT_DPIN, DHTTYPE);

void reconnect()
{
	while (!client.connected()) {
		Serial.print("Attempting MQTT connection...");
		if (client.connect(clientID, "", "", willTopic, willQoS,
				   willRetain, willMessage, true)) {
			client.publish(willTopic, buffer, true);
			client.subscribe(topicLightBulb);
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

void publishRelayState()
{
	char *message;

	if (digitalRead(BULB_DPIN) == HIGH) {
		client.publish(topicLightBulbState, "ON");
		Serial.println("Relay is ON");

	} else {
		client.publish(topicLightBulbState, "OFF");
		Serial.println("Relay is OFF");
	}
}

void relayHandler(char *command)
{
	if (strcmp(command, "ON") == 0) {
		Serial.println("ON");
		digitalWrite(BULB_DPIN, HIGH);
	} else if (strcmp(command, "OFF") == 0) {
		Serial.println("OFF");
		digitalWrite(BULB_DPIN, LOW);
	} else {
		Serial.println("Unknown command");
	}
}

void callback(char *topic, byte *payload, unsigned int length)
{
	Serial.print("Message arrived [");
	Serial.print(topic);
	Serial.print("] ");
	payload[length] = '\0';
	char *cstring = (char *)payload;
	Serial.print(cstring);
	Serial.println();

	relayHandler(cstring);
}

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

void setup(void)
{
	pinMode(BULB_DPIN, OUTPUT);

	Serial.begin(9600);

	setup_wifi();

	client.setServer(mqtt_server, 1883);
	client.setCallback(callback);

	dht.begin();

	delay(2000); // Delay to allow first connection with MQTT Broker

	StaticJsonDocument<256> doc;
	JsonArray sensors = doc.createNestedArray("sensors");
	JsonObject tempHumSensor = sensors.createNestedObject();
	tempHumSensor["type"] = "Temperature-Humidity";
	tempHumSensor["name"] = "dht11";

	JsonObject relaySensor = sensors.createNestedObject();
	relaySensor["type"] = "Lightbulb";
	relaySensor["name"] = "relay-lb-1";

	serializeJson(doc, buffer);

	if (client.connect(clientID, "", "", willTopic, willQoS, willRetain,
			   willMessage, true)) {
		// Connecting to MQTT Broker
		client.publish(willTopic, buffer, true);
		client.subscribe(topicLightBulb);

		Serial.print(clientID);
		Serial.println(" connected to MQTT Broker!");
	} else {
		Serial.print(clientID);
		Serial.println(" connection to MQTT Broker failed...");
	}

	digitalWrite(BULB_DPIN, LOW);
}

unsigned long lastMsg = 0;

void loop()
{
	if (!client.connected()) {
		reconnect();
	}
	client.loop();

	unsigned long now = millis();
	if (now - lastMsg > PUBLISH_TIME_PERIOD) {
		lastMsg = now;

		float h = dht.readHumidity();
		float t = dht.readTemperature();

		char temp[16];
		dtostrf(t, 3, 2, temp); // To convert float into char

		char humi[16];
		dtostrf(h, 3, 2, humi); // To convert float into char

		char temperHumid[32];
		strcpy(temperHumid, temp);
		strcat(temperHumid, "-");
		strcat(temperHumid, humi);
		client.publish(topicTemperHumid,
			       temperHumid); // Publishing temperature

		if (isnan(temp[16]) ||
		    isnan(humi[16])) { // Check if there DHT is working
			Serial.println("Failed to read from DHT sensor!");
			return;
		}

		Serial.print("Current humidity = ");
		Serial.print(h);
		Serial.print("%  ");
		Serial.print("temperature = ");
		Serial.print(t);
		Serial.println("C  ");

		//publish relay state
		publishRelayState();
	}

}
