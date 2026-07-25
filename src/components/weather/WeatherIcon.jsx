import {
  WiCloud,
  WiCloudy,
  WiDaySunny,
  WiFog,
  WiNightClear,
  WiRain,
  WiRainMix,
  WiSnow,
  WiThunderstorm,
} from 'react-icons/wi';

const getIconComponent = (weatherId, isNight) => {
  if (weatherId >= 200 && weatherId < 300) return WiThunderstorm;
  if (weatherId >= 300 && weatherId < 400) return WiRainMix;
  if (weatherId >= 500 && weatherId < 600) return WiRain;
  if (weatherId >= 600 && weatherId < 700) return WiSnow;
  if (weatherId >= 700 && weatherId < 800) return WiFog;
  if (weatherId === 800) return isNight ? WiNightClear : WiDaySunny;
  if (weatherId === 801) return WiCloud;
  return WiCloudy;
};

export const WeatherIcon = ({ weatherId, isNight = false, className = '' }) => {
  const Icon = getIconComponent(weatherId, isNight);
  return <Icon className={className} aria-hidden="true" />;
};
