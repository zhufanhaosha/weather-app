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
  75: '❄️',    // 大雪
  77: '🌨️',   // 雪粒
  80: '🌦️',   // 阵雨
  81: '🌧️',   // 中阵雨
  82: '⛈️',    // 大阵雨
  85: '🌨️',   // 阵雪
  86: '❄️',    // 强阵雪
  95: '⛈️',    // 雷暴
  96: '⛈️',    // 雷暴冰雹
  99: '⛈️',    // 强雷暴冰雹
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

// 星座运势数据
const horoscopeData = {
  scorpio: {
    name: '天蝎座',
    symbol: '♏',
    luck: ['今日运势旺盛，事业顺利', '感情运佳，适合约会', '财运不错，有小惊喜', '健康运平稳，注意休息', '学业有成，思路清晰'],
    color: '#8B0000',
    lucky: ['红', '紫'],
    direction: '西南'
  },
  pisces: {
    name: '双鱼座',
    symbol: '♓',
    luck: ['今日桃花运旺', '创意满满，灵感迸发', '财运稳定，适合储蓄', '贵人运佳，遇事逢凶化吉', '心情愉快，家庭和睦'],
    color: '#4169E1',
    lucky: ['蓝', '白'],
    direction: '东方'
  },
  gemini: {
    name: '双子座',
    symbol: '♊',
    luck: ['思维活跃，适合学习', '社交运佳，认识新朋友', '财运波动，谨慎投资', '创意无限，适合创作', '贵人相助，事半功倍'],
    color: '#FFD700',
    lucky: ['黄', '绿'],
    direction: '东南'
  }
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
let weatherAnimation;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 获取 DOM 元素
  cityInput = document.getElementById('cityInput');
  searchBtn = document.getElementById('searchBtn');
  weatherDisplay = document.getElementById('weatherDisplay');
  errorMessage = document.getElementById('errorMessage');
  mainContent = document.getElementById('mainContent');
  quickCityBtns = document.querySelectorAll('.quick-cities button');
  weatherAnimation = document.getElementById('weatherAnimation');
  
  // 初始化日期和农历
  updateDate();
  
  // 初始化生日提醒
  updateBirthdays();
  
  // 初始化星座运势
  updateHoroscope();
  
  // 初始化每日一首诗
  updatePoem();
  
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

// 更新日期和农历
function updateDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // 公历日期
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[now.getDay()];
  document.getElementById('solarDate').textContent = `${year}年${month}月${day}日 ${weekday}`;
  
  // 农历日期
  updateLunarDate(year, month, day);
  
  // 更新宜忌
  updateYiJi(year, month, day);
}

// 更新农历日期
function updateLunarDate(year, month, day) {
  // 农历月份和日期名称
  const monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const dayNames = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
  
  // 简化处理：假设公历和农历月份大致对应
  const lunarMonthName = monthNames[Math.min(month - 1, 11)];
  const lunarDayName = dayNames[Math.min(day - 1, 29)];
  
  document.getElementById('lunarDate').textContent = `农历${lunarMonthName}月${lunarDayName}`;
}

// 更新宜忌
function updateYiJi(year, month, day) {
  const lunarData = {
    2024: { yi: ['祭祀', '祈福', '求嗣'], ji: ['出行', '搬家'] },
    2025: { yi: ['嫁娶', '出行', '搬家'], ji: ['安葬', '破土'] },
    2026: { yi: ['祭祀', '祈福', '求嗣'], ji: ['破土', '安葬'] }
  };
  
  const data = lunarData[year] || lunarData[2026];
  const yiJi = data.yi[Math.floor(day / 5) % data.yi.length];
  const jiJi = data.ji[Math.floor(day / 5) % data.ji.length];
  
  document.getElementById('lunarYi').textContent = `宜 ${yiJi}`;
  document.getElementById('lunarJi').textContent = `忌 ${jiJi}`;
}

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
    chuchuElement.textContent = '🎉今天';
    chuchuElement.parentElement.classList.add('today');
  }
  
  // 更新沐沐的生日
  const mumuElement = document.getElementById('mumuDays');
  const mumuBirthday = getDaysUntilBirthday(birthdays.mumu.month, birthdays.mumu.day);
  mumuElement.textContent = `${mumuBirthday}天`;
  
  if (currentMonth === birthdays.mumu.month && currentDay === birthdays.mumu.day) {
    mumuElement.textContent = '🎉今天';
    mumuElement.parentElement.classList.add('today');
  }
}

// 每日一首诗（小学一、二年级语文课本）
const poems = [
  { title: '咏鹅', content: '鹅，鹅，鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。', author: '骆宾王' },
  { title: '静夜思', content: '床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。', author: '李白' },
  { title: '春晓', content: '春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。', author: '孟浩然' },
  { title: '寻隐者不遇', content: '松下问童子，\n言师采药去。\n只在此山中，\n云深不知处。', author: '贾岛' },
  { title: '小池', content: '泉眼无声惜细流，\n树阴照水爱晴柔。\n小荷才露尖尖角，\n早有蜻蜓立上头。', author: '杨万里' },
  { title: '所见', content: '牧童骑黄牛，\n歌声振林樾。\n意欲捕鸣蝉，\n忽然闭口立。', author: '袁枚' },
  { title: '池上', content: '小娃撑小艇，\n偷采白莲回。\n不解藏踪迹，\n浮萍一道开。', author: '白居易' },
  { title: '古朗月行', content: '小时不识月，\n呼作白玉盘。\n又疑瑶台镜，\n飞在青云端。', author: '李白' },
  { title: '风', content: '解落三秋叶，\n能开二月花。\n过江千尺浪，\n入竹万竿斜。', author: '李峤' },
  { title: '登鹳雀楼', content: '白日依山尽，\n黄河入海流。\n欲穷千里目，\n更上一层楼。', author: '王之涣' },
  { title: '春夜喜雨', content: '好雨知时节，\n当春乃发生。\n随风潜入夜，\n润物细无声。', author: '杜甫' },
  { title: '江雪', content: '千山鸟飞绝，\n万径人踪灭。\n孤舟蓑笠翁，\n独钓寒江雪。', author: '柳宗元' },
  { title: '锄禾', content: '锄禾日当午，\n汗滴禾下土。\n谁知盘中餐，\n粒粒皆辛苦。', author: '李绅' },
  { title: '忆江南', content: '江南好，\n风景旧曾谙。\n日出江花红胜火，\n春来江水绿如蓝。\n能不忆江南？', author: '白居易' },
  { title: '小儿垂钓', content: '蓬头稚子学垂纶，\n侧坐莓苔草映身。\n路人借问遥招手，\n怕得鱼惊不应人。', author: '胡令能' },
  { title: '江南', content: '江南可采莲，\n莲叶何田田。\n鱼戏莲叶间，\n鱼戏莲叶东，\n鱼戏莲叶西，\n鱼戏莲叶南，\n鱼戏莲叶北。', author: '汉乐府' },
  { title: '敕勒歌', content: '敕勒川，阴山下。\n天似穹庐，笼盖四野。\n天苍苍，野茫茫，\n风吹草低见牛羊。', author: '北朝民歌' },
  { title: '风荷', content: '泉眼无声惜细流，\n树阴照水爱晴柔。\n小荷才露尖尖角，\n早有蜻蜓立上头。', author: '杨万里' },
  { title: '画', content: '远看山有色，\n近听水无声。\n春去花还在，\n人来鸟不惊。', author: '王维' },
  { title: '对韵歌', content: '云对雨，\n雪对风，\n花对树，\n鸟对虫。', author: '小学课本' }
];

// 更新星座运势
function updateHoroscope() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  
  // 根据日期生成运势
  const scorpioLuck = horoscopeData.scorpio.luck[day % horoscopeData.scorpio.luck.length];
  const piscesLuck = horoscopeData.pisces.luck[day % horoscopeData.pisces.luck.length];
  const geminiLuck = horoscopeData.gemini.luck[day % horoscopeData.gemini.luck.length];
  
  document.getElementById('luck-scorpio').textContent = scorpioLuck;
  document.getElementById('luck-pisces').textContent = piscesLuck;
  document.getElementById('luck-gemini').textContent = geminiLuck;
}

// 更新每日一首诗（每句一行）
function updatePoem() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  // 根据日期选择一首诗
  const poemIndex = (day + month + year) % poems.length;
  const poem = poems[poemIndex];
  
  // 将诗歌内容按行分割
  const lines = poem.content.split('\n').filter(line => line.trim());
  const contentEl = document.getElementById('poemContent');
  contentEl.innerHTML = '';
  
  // 每行单独显示
  lines.forEach(line => {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'poem-line';
    lineDiv.textContent = line;
    contentEl.appendChild(lineDiv);
  });
  
  // 作者
  const authorDiv = document.createElement('div');
  authorDiv.style.marginTop = '6px';
  authorDiv.style.fontSize = '12px';
  authorDiv.style.color = '#8B4513';
  authorDiv.style.fontStyle = 'normal';
  authorDiv.style.borderTop = '1px solid rgba(139,69,19,0.2)';
  authorDiv.style.paddingTop = '4px';
  authorDiv.textContent = `——${poem.author}`;
  contentEl.appendChild(authorDiv);
}

// 更新天气动画
function updateWeatherAnimation(weatherCode) {
  // 清除现有动画
  weatherAnimation.innerHTML = '';
  
  // 晴天 (天气代码 0, 1)
  if (weatherCode === 0 || weatherCode === 1) {
    // 太阳
    const sun = document.createElement('div');
    sun.className = 'sun';
    weatherAnimation.appendChild(sun);
    
    // 阳光射线
    for (let i = 0; i < 8; i++) {
      const ray = document.createElement('div');
      ray.className = 'sun-ray';
      ray.style.transform = `translate(-50%, -50%) rotate(${i * 45}deg)`;
      sun.appendChild(ray);
    }
  }
  
  // 多云 (天气代码 2)
  else if (weatherCode === 2) {
    // 云朵
    for (let i = 0; i < 3; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.top = `${8 + i * 18}%`;
      cloud.style.animationDelay = `${i * -12}s`;
      cloud.style.width = `${100 + i * 50}px`;
      cloud.style.height = `${35 + i * 12}px`;
      cloud.style.opacity = '0.85';
      weatherAnimation.appendChild(cloud);
    }
    
    // 部分太阳
    const sun = document.createElement('div');
    sun.className = 'sun';
    sun.style.top = '8%';
    sun.style.right = '20%';
    sun.style.width = '70px';
    sun.style.height = '70px';
    sun.style.opacity = '0.7';
    weatherAnimation.appendChild(sun);
  }
  
  // 阴天 (天气代码 3)
  else if (weatherCode === 3) {
    // 厚重云朵
    for (let i = 0; i < 4; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.top = `${5 + i * 18}%`;
      cloud.style.animationDelay = `${i * -10}s`;
      cloud.style.width = `${140 + i * 50}px`;
      cloud.style.height = `${50 + i * 15}px`;
      cloud.style.opacity = '0.88';
      cloud.style.background = 'rgba(200, 200, 200, 0.85)';
      weatherAnimation.appendChild(cloud);
    }
  }
  
  // 雨天 (天气代码 51-67, 80-82)
  else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    // 云朵
    for (let i = 0; i < 3; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.top = `${8 + i * 18}%`;
      cloud.style.animationDelay = `${i * -15}s`;
      cloud.style.width = `${100 + i * 40}px`;
      cloud.style.height = `${40 + i * 12}px`;
      cloud.style.background = 'rgba(180, 180, 180, 0.85)';
      weatherAnimation.appendChild(cloud);
    }
    
    // 雨滴
    for (let i = 0; i < 40; i++) {
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDelay = `${Math.random() * 2}s`;
      drop.style.animationDuration = `${1.5 + Math.random() * 1}s`;
      weatherAnimation.appendChild(drop);
    }
  }
  
  // 雪天 (天气代码 71-77, 85-86)
  else if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
    // 云朵
    for (let i = 0; i < 2; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.top = `${12 + i * 22}%`;
      cloud.style.animationDelay = `${i * -15}s`;
      cloud.style.width = '140px';
      cloud.style.height = '45px';
      cloud.style.background = 'rgba(220, 220, 220, 0.9)';
      weatherAnimation.appendChild(cloud);
    }
    
    // 雪花
    for (let i = 0; i < 25; i++) {
      const snow = document.createElement('div');
      snow.style.position = 'absolute';
      snow.style.left = `${Math.random() * 100}%`;
      snow.style.top = '-20px';
      snow.style.width = `${4 + Math.random() * 6}px`;
      snow.style.height = snow.style.width;
      snow.style.background = 'rgba(255, 255, 255, 0.9)';
      snow.style.borderRadius = '50%';
      snow.style.boxShadow = '0 0 5px rgba(255,255,255,0.5)';
      snow.style.animation = `snowFall ${4 + Math.random() * 3}s linear infinite`;
      snow.style.animationDelay = `${Math.random() * 4}s`;
      weatherAnimation.appendChild(snow);
    }
  }
  
  // 雾天 (天气代码 45, 48)
  else if (weatherCode === 45 || weatherCode === 48) {
    // 雾气效果
    for (let i = 0; i < 4; i++) {
      const fog = document.createElement('div');
      fog.style.position = 'absolute';
      fog.style.top = `${12 + i * 20}%`;
      fog.style.left = '-150px';
      fog.style.width = '350px';
      fog.style.height = '70px';
      fog.style.background = 'linear-gradient(90deg, transparent, rgba(220,220,220,0.5), transparent)';
      fog.style.borderRadius = '50%';
      fog.style.animation = `cloudFloat ${35 + i * 8}s ease-in-out infinite`;
      fog.style.animationDelay = `${i * -8}s`;
      weatherAnimation.appendChild(fog);
    }
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
    
    // 更新天气动画
    updateWeatherAnimation(current.weather_code);
    
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
  
  // 尝试多个中文新闻源（国内可访问）
  const newsSources = [
    { url: 'https://www.chinanews.com.cn/rss/finance.xml', name: '中国新闻网', type: '国内' }
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
          newsItem.style.cursor = 'pointer';
          newsItem.innerHTML = `
            <div class="news-title">${index + 1}. ${item.title}</div>
            <div class="news-source">${source.name}</div>
          `;
          newsItem.addEventListener('click', () => {
            if (item.link) {
              window.location.href = item.link;
            }
          });
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

// 添加雪花动画样式
const snowStyle = document.createElement('style');
snowStyle.textContent = `
  @keyframes snowFall {
    0% { 
      transform: translateY(-20px) translateX(0) rotate(0deg); 
      opacity: 0.9;
    }
    25% { transform: translateY(25vh) translateX(15px) rotate(90deg); }
    50% { transform: translateY(50vh) translateX(-10px) rotate(180deg); opacity: 0.8; }
    75% { transform: translateY(75vh) translateX(20px) rotate(270deg); }
    100% { 
      transform: translateY(110vh) translateX(-5px) rotate(360deg); 
      opacity: 0.6;
    }
  }
`;
document.head.appendChild(snowStyle);
