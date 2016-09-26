#include <pebble.h>

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
  bool _disconnect_vibrate_suppress;
} Settings;

// Create variables for settings
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
bool disconnect_vibrate_suppress;

uint32_t key_temperature = 1;
uint32_t key_max_min = 2;
uint32_t key_weather_icon = 3;
uint32_t key_wind = 4;
uint32_t key_rain = 5;
uint32_t key_humidity = 6;

// Create buffers for time, date, and battery level.
static char s_time_buffer[8];
static char s_date_buffer[11];
static char s_battery_buffer[8];
static char s_seconds_buffer[8];

// Create buffers for weather data
static char temperature_buffer[8];
static char max_min_buffer[10];
static char weather_icon_buffer[2];
static char wind_buffer[8];
static char precip_buffer[8];
static char humidity_buffer[8];

// Create buffers for fitness data
static char s_step_buffer[8];
static char distance_walked_buffer[10];
static char calories_active_buffer[10];

/* Create window assets. There are eight text layers for the display of
   complications and a ninth text layer for displaying the time.*/
static Window *s_main_window;
static TextLayer *s_time_layer, *s_bluetooth_layer, *s_complication_layer_one,
    *s_complication_layer_two, *s_complication_layer_three,
    *s_complication_layer_four, *s_complication_layer_five,
    *s_complication_layer_six, *s_complication_layer_seven,
    *s_complication_layer_eight;
static GFont s_time_font, s_complication_font, s_icon_font;
static int s_battery_level;
