#include <ArduinoJson.h>

#include "DHT.h" // including the library of DHT11 temperature and humidity sensor
//#include <ESP8266WiFi.h> // Esp8266/NodeMCU Library
//#include <PubSubClient.h> // MQTT Library
//#include <Wire.h>
//#include <BH1750.h>
#define DHTTYPE DHT11 // DHT 11
#define DHT_DPIN D1
#define SCL D4
#define SCA D3
#define PUBLISH_TIME_PERIOD 5000

void setup() {
  pinMode(D0, OUTPUT);  // Blue LED Beside CP2102
  Serial.begin(9600);
}
void loop() {
  Serial.println("Welcome To PCBoard.ca");  // display message on console
  digitalWrite(D0, HIGH);
  delay(500);
  digitalWrite(D0, LOW);
  delay(250);
}
