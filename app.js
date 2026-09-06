// 天气代码对应图标
const weatherIcons = {
  0: '☀️',    // 晴
  1: '🌤️',    //  mostly晴
  2: '⛅',    // 多云
  3: '☁️',    // 阴
  45: '🌫️',   // 雾
  48: '🌫️',   // 雾凇
  51: '🌦️',   // 毛毛雨
  53: '🌦️',   // 中雨
  55: '🌧️',   // 大雨
  56: '🌧️',   // 冻雨
  57: '🌧️',   // 强冻雨
  61: '🌧️',   // 小雨
  63: '🌧️',   // 中雨
  65: '🌧️',   // 大雨
  66: '🌧️',   // 冻雨
  67: '🌧️',   // 强冻雨
  71: '🌨️',   // 小雪
  73: '🌨️',   // 中雪
  75: '❄️',   // 大雪
  77: '🌨️',   // 雪粒
  80: '🌦️',   // 阵雨
  81: '🌧️',   // 中阵雨
  82: '⛈️',   // 大阵雨
  85: '🌨️',   // 阵雪
  86: '❄️',   // 强阵雪
  95: '⛈️',   // 雷暴
  96: '⛈️',   // 雷暴冰雹
  99: '⛈️',   // 强雷暴冰雹
};

// 天气代码对应描述
const weatherDescriptions = {
  0: '晴朗',
  1: '大部晴朗',
  2: '多云',
  3: '阴天',
  45: '雾',
  48: '沉积雾',
  51: '小毛毛雨',
  53: '中度毛毛雨',
  55: '大毛毛雨',
  56: '冻毛毛雨-小',
  57: '冻毛毛雨-大',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  66: '冻雨-小',
  67: '冻雨-大',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '雪粒',
  80: '小阵雨',
  81: '中阵雨',
  82: '大阵雨',
  85: '小阵雪',
  86: '大阵雪',
  95: '雷暴',
  96: '雷暴伴有小冰雹',
  99: '雷暴伴有大冰雹',
};

// 默认城市（石家庄）
const DEFAULT_CITY = '石家庄';
const DEFAULT_LAT = 38.04;
const DEFAULT_LON = 114.51;

// 生日信息
const birthdays = {
  chuchu: { name: '楚楚', month: 6, day: 5 },
  mumu: { name: '沐沐', month: 7, day: 10 }
};

// 当前坐标
let currentLat = DEFAULT_LAT;
let currentLon = DEFAULT_LON;
let currentCity = DEFAULT_CITY;

// DOM 元素
let cityInput;
let searchBtn;
let weatherDisplay;
let errorMessage;
let quickCityBtns;
let mainContent;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 获取 DOM 元素
  cityInput = document.getElementById('cityInput');
  searchBtn = document.getElementById('searchBtn');
  weatherDisplay = document.getElementById('weatherDisplay');
  errorMessage = document.getElementById('errorMessage');
  mainContent = document.getElementById('mainContent');
  quickCityBtns = document.querySelectorAll('.quick-cities button');
  
  // 初始化生日提醒
  updateBirthdays();
  
  // 初始化：加载默认城市
  loadWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY);
  
  // 加载新闻
  loadNews();
  
  // 绑定搜索按钮事件
  searchBtn.addEventListener('click', handleSearch);
  
  // 绑定回车键事件
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  
  // 绑定快捷城市按钮事件
  quickCityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      cityInput.value = city;
      const cities = {
        '石家庄': { lat: 38.04, lon: 114.51 },
        '北京': { lat: 39.90, lon: 116.41 },
        '上海': { lat: 31.23, lon: 121.47 },
        '广州': { lat: 23.13, lon: 113.26 },
        '深圳': { lat: 22.54, lon: 114.06 },
      };
      const loc = cities[city];
      if (loc) {
        loadWeather(loc.lat, loc.lon, city);
      }
    });
  });
});

// 更新生日提醒
function updateBirthdays() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  // 更新楚楚的生日
  const chuchuElement = document.getElementById('chuchuDays');
  const chuchuBirthday = getDaysUntilBirthday(birthdays.chuchu.month, birthdays.chuchu.day);
  chuchuElement.textContent = `${chuchuBirthday}天`;
  
  if (currentMonth === birthdays.chuchu.month && currentDay === birthdays.chuchu.day) {
    chuchuElement.textContent = '🎉 今天生日快乐！';
    chuchuElement.parentElement.classList.add('today');
  }
  
  // 更新沐沐的生日
  const mumuElement = document.getElementById('mumuDays');
  const mumuBirthday = getDaysUntilBirthday(birthdays.mumu.month, birthdays.mumu.day);
  mumuElement.textContent = `${mumuBirthday}天`;
  
  if (currentMonth === birthdays.mumu.month && currentDay === birthdays.mumu.day) {
    mumuElement.textContent = '🎉 今天生日快乐！';
    mumuElement.parentElement.classList.add('today');
  }
}

// 计算距离生日还有多少天
function getDaysUntilBirthday(month, day) {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // 今年的生日
  let birthday = new Date(currentYear, month - 1, day);
  
  // 如果今年的生日已过，计算明年的
  if (now > birthday) {
    birthday = new Date(currentYear + 1, month - 1, day);
  }
  
  // 计算天数差
  const diffTime = birthday.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

async function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('请输入城市名称');
    return;
  }
  
  // 使用地理编码API查找坐标
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`);
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      showError('未找到该城市，请尝试其他名称');
      return;
    }
    
    const { latitude, longitude, name, country } = geoData.results[0];
    currentLat = latitude;
    currentLon = longitude;
    currentCity = `${name}，${country}`;
    loadWeather(latitude, longitude, currentCity);
  } catch (err) {
    showError('查询失败，请检查网络');
  }
}

async function loadWeather(lat, lon, cityName) {
  mainContent.style.display = 'flex';
  errorMessage.style.display = 'none';
  
  try {
    // 获取当前天气和15天预报
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto&forecast_days=15`);
    const data = await res.json();
    
    const current = data.current;
    const daily = data.daily;
    
    // 更新当前天气
    document.getElementById('cityName').textContent = cityName;
    document.getElementById('weatherIcon').textContent = weatherIcons[current.weather_code] || '🌡️';
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('description').textContent = weatherDescriptions[current.weather_code] || '未知';
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('feelsLike').textContent = `${Math.round(current.apparent_temperature)}°C`;
    
    // 更新15天趋势
    renderForecast(daily);
    
  } catch (err) {
    showError('获取天气数据失败');
    console.error(err);
  }
}

function renderForecast(daily) {
  const forecastList = document.getElementById('forecastList');
  forecastList.innerHTML = '';
  
  const dates = daily.time;
  const maxTemps = daily.temperature_2m_max;
  const minTemps = daily.temperature_2m_min;
  const weatherCodes = daily.weather_code;
  
  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]);
    const dayName = i === 0 ? '今天' : i === 1 ? '明天' : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;
    
    const item = document.createElement('div');
    item.className = 'forecast-item';
    item.innerHTML = `
      <div class="forecast-date">${dayName}<br><small>${monthDay}</small></div>
      <div class="forecast-icon">${weatherIcons[weatherCodes[i]] || '🌡️'}</div>
      <div class="forecast-desc">${weatherDescriptions[weatherCodes[i]] || ''}</div>
      <div class="forecast-temp"><span>最高</span> ${Math.round(maxTemps[i])}°<br><span>最低</span> ${Math.round(minTemps[i])}°</div>
    `;
    forecastList.appendChild(item);
  }
}

async function loadNews() {
  const newsList = document.getElementById('newsList');
  newsList.innerHTML = '<div class="loading">加载中...</div>';
  
  // 尝试多个中文新闻源
  const newsSources = [
    { url: 'https://cn.nytimes.com/rss/', name: '纽约时报中文网', type: '国际' },
    { url: 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml', name: 'BBC中文', type: '国际' }
  ];
  
  for (const source of newsSources) {
    try {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`);
      const data = await res.json();
      
      if (data.items && data.items.length > 0) {
        newsList.innerHTML = '';
        
        const items = data.items.slice(0, 8);
        items.forEach((item, index) => {
          const newsItem = document.createElement('div');
          newsItem.className = 'news-item';
          newsItem.innerHTML = `
            <div class="news-title">${index + 1}. ${item.title}</div>
            <div class="news-source">${source.name}</div>
          `;
          newsItem.addEventListener('click', () => window.open(item.link, '_blank'));
          newsList.appendChild(newsItem);
        });
        return;
      }
    } catch (err) {
      console.warn(`Failed to load ${source.name}:`, err);
    }
  }
  
  newsList.innerHTML = '<div class="loading">暂无新闻数据</div>';
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.style.display = 'block';
  mainContent.style.display = 'none';
}
