#include <pebble.h>

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

// Create keys and variables for persistent storage of settings
uint32_t key_time_text = 0;
int time_text_int;
GColor time_text;
uint32_t key_time_background = 1;
int time_background_int;
GColor time_background;

uint32_t key_text1 = 2;
int text1_int;
GColor text1;
uint32_t key_background1 = 3;
int background1_int;
GColor background1;
uint32_t key_complication1 = 4;
int complication1_int;

uint32_t key_text2 = 5;
int text2_int;
GColor text2;
uint32_t key_background2 = 6;
int background2_int;
GColor background2;
uint32_t key_complication2 = 7;
int complication2_int;

uint32_t key_text3 = 8;
int text3_int;
GColor text3;
uint32_t key_background3 = 9;
int background3_int;
GColor background3;
uint32_t key_complication3 = 10;
int complication3_int;

uint32_t key_text4 = 11;
int text4_int;
GColor text4;
uint32_t key_background4 = 12;
int background4_int;
GColor background4;
uint32_t key_complication4 = 13;
int complication4_int;

uint32_t key_text5 = 14;
int text5_int;
GColor text5;
uint32_t key_background5 = 15;
int background5_int;
GColor background5;
uint32_t key_complication5 = 16;
int complication5_int;

uint32_t key_text6 = 17;
int text6_int;
GColor text6;
uint32_t key_background6 = 18;
int background6_int;
GColor background6;
uint32_t key_complication6 = 19;
int complication6_int;

uint32_t key_text7 = 20;
int text7_int;
GColor text7;
uint32_t key_background7 = 21;
int background7_int;
GColor background7;
uint32_t key_complication7 = 22;
int complication7_int;

uint32_t key_text8 = 23;
int text8_int;
GColor text8;
uint32_t key_background8 = 24;
int background8_int;
GColor background8;
uint32_t key_complication8 = 25;
int complication8_int;

uint32_t key_temperature = 26;
uint32_t key_max_min = 27;
uint32_t key_weather_icon = 28;
uint32_t key_wind = 29;
uint32_t key_rain = 30;
uint32_t key_humidity = 33;

uint32_t key_date_format = 31;
int date_format_int;

/* Buffers for time, date, and battery level.*/
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
