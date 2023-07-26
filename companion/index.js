import * as messaging from "messaging";
import { me as companion } from "companion";
import {weather,WeatherCondition} from "weather";
function weatherCondition(conditionCode) {
  for (const condition of Object.keys(WeatherCondition)) {
    if (conditionCode === WeatherCondition[condition]) return condition;
  }
}
const weatherSimple = {
   ClearNight: 'Clear',
   Cloudy: 'Cloud',
   Cold: 'Cold',
   Flurries: 'Snow',
   Fog: 'Fog',
   FreezingRain: 'Slush',
   HazyMoonlight: 'Haze',
   HazySunshineDay: 'Haze',
   Hot: 'Hot',
   Ice: 'Ice',
   IntermittentCloudsDay: 'Cloud',
   IntermittentCloudsNight: 'Cloud',
   MostlyClearNight: 'Cloud',
   MostlyCloudyDay: 'Cloud',
   MostlyCloudyNight: 'Cloud',
   MostlyCloudyWithFlurriesDay: 'Snow',
   MostlyCloudyWithFlurriesNight: 'Snow',
   MostlyCloudyWithShowersDay: 'Rain',
   MostlyCloudyWithShowersNight: 'Rain',
   MostlyCloudyWithSnowDay: 'Snow',
   MostlyCloudyWithSnowNight: 'Snow',
   MostlyCloudyWithThunderstormsDay: 'Thunder',
   MostlyCloudyWithThunderstormsNight: 'Thunder',
   MostlySunnyDay: 'Sun',
   Overcast: 'Cloud',
   PartlyCloudyNight: 'Cloud',
   PartlyCloudyWithShowersNight: 'Rain',
   PartlyCloudyWithThunderstormsNight: 'Thunder',
   PartlySunnyDay: 'Sun',
   PartlySunnyWithFlurriesDay: 'Snow',
   PartlySunnyWithShowersDay: 'Rain',
   PartlySunnyWithThunderstormsDay: 'Thunder',
   Rain: 'Rain',
   RainAndSnow: 'Slush',
   Showers: 'Rain',
   Sleet: 'Sleet',
   Snow: 'Snow',
   SunnyDay: 'Sun',
   Thunderstorms: 'Thunder',
   Windy: 'Wind'
}
function updateWeather(){
if (companion.permissions.granted("access_location")) {
   weather
     .getWeatherData()
     .then((data) => {
       if (data.locations.length > 0) {
         const temp = Math.floor(data.locations[0].currentWeather.temperature);
         const cond = data.locations[0].currentWeather.weatherCondition;
         const loc = data.locations[0].name;
         const unit = data.temperatureUnit;
         const condDisplay = weatherSimple[weatherCondition(cond)]
         if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send({temp,cond,loc,unit, condDisplay});
          } else {
          }
       }
     })
     .catch((ex) => {
        if(ex){
            console.error(ex);
         }
     });
}
}
messaging.peerSocket.onopen = updateWeather
companion.addEventListener("readystatechanged", updateWeather)
companion.addEventListener("wakeinterval", updateWeather);
updateWeather()
messaging.peerSocket.onmessage = evt => {
   if(evt && evt.action){
    updateWeather()
   }
  };