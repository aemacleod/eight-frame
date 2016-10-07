#ifndef MAIN_H
#define MAIN_H
#endif
#include <pebble.h>

// struct for storing settings data
typedef struct {
  GColor _time_text;
  GColor _time_background;
  GColor _text1;
  GColor _background1;
  int _complication1;
  GColor _text2;
  GColor _background2;
  int _complication2;
  GColor _text3;
  GColor _background3;
  int _complication3;
  GColor _text4;
  GColor _background4;
  int _complication4;
  GColor _text5;
  GColor _background5;
  int _complication5;
  GColor _text6;
  GColor _background6;
  int _complication6;
  GColor _text7;
  GColor _background7;
  int _complication7;
  GColor _text8;
  GColor _background8;
  int _complication8;
  int _date_format;
  int _disconnect_vibrate_suppress;
  int _suppress_seconds;
} Settings;

/* This function takes a layer and complication int as arguments and applies the
 * complication to the layer specified. */
void set_complication(TextLayer *layer, int complication);

// Create variables to be used for applying settings in the watchface
Settings settings;
uint32_t key_settings = 1;
GColor time_text;
GColor time_background;
GColor text1;
GColor background1;
int complication1;
GColor text2;
GColor background2;
int complication2;
GColor text3;
GColor background3;
int complication3;
GColor text4;
GColor background4;
int complication4;
GColor text5;
GColor background5;
int complication5;
GColor text6;
GColor background6;
int complication6;
GColor text7;
GColor background7;
int complication7;
GColor text8;
GColor background8;
int complication8;
int date_format_int;
int disconnect_vibrate_suppress;
int suppress_seconds;

// Create keys for storing weather data
uint32_t key_temperature = 2;
uint32_t key_max_min = 3;
uint32_t key_weather_icon = 4;
uint32_t key_wind = 5;
uint32_t key_rain = 6;
uint32_t key_humidity = 7;

// Create buffers for time, date, and battery level
char time_buffer[8];
char date_buffer[11];
char battery_buffer[8];
char seconds_buffer[8];

// Create buffers for weather data
char temperature_buffer[8];
char max_min_buffer[10];
char weather_icon_buffer[2];
char wind_buffer[8];
char precip_buffer[8];
char humidity_buffer[8];

// Create buffers for fitness data
char step_buffer[8];
char distance_walked_buffer[10];
char calories_active_buffer[10];

/* Create window assets. There are eight text layers for the display of
   complications and a ninth text layer for displaying the time.*/
Window *s_main_window;
TextLayer *time_layer, *bluetooth_layer, *complication_layer_one,
    *complication_layer_two, *complication_layer_three,
    *complication_layer_four, *complication_layer_five, *complication_layer_six,
    *complication_layer_seven, *complication_layer_eight;
GFont s_time_font, complication_font, icon_font;
int battery_level;
