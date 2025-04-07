const constellationMap = {
    aries: '白羊座',
    taurus: '金牛座',
    gemini: '双子座',
    cancer: '巨蟹座',
    leo: '狮子座',
    virgo: '处女座',
    libra: '天秤座',
    scorpio: '天蝎座',
    sagittarius: '射手座',
    capricorn: '摩羯座',
    aquarius: '水瓶座',
    pisces: '双鱼座'
};

// 初始化主题系统
function setupTheme() {
    // 同步主题状态
    const savedTheme = localStorage.getItem('theme') || 'neomorphic';
    const savedMode = localStorage.getItem('mode') || 'day';
    document.body.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-mode', savedMode);

    // 绑定主题切换
    window.toggleSelect = () => {
        document.querySelector('.select-options').classList.toggle('active');
    };

    window.setTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        document.querySelector('.select-box').textContent = {
            neomorphic: '新拟态',
            neobrutalism: '新野蛮主义',
            morandi: '莫兰迪'
        }[theme];
        document.querySelector('.select-options').classList.remove('active');
    };

    window.toggleMode = () => {
        const currentMode = document.body.getAttribute('data-mode');
        const newMode = currentMode === 'day' ? 'night' : 'day';
        document.body.setAttribute('data-mode', newMode);
        localStorage.setItem('mode', newMode);
    };
}

// 运势加载
async function loadHoroscope() {
    const constellation = document.getElementById('constellation').value;
    const time = document.querySelector('.time-btn.active').dataset.time;
    const container = document.getElementById('fortune-content');
    
    container.innerHTML = '<div class="loading">✨ 正在获取星座能量...</div>';

    try {
        const response = await fetch(`https://api.vvhan.com/api/horoscope?type=${constellation}&time=${time}`);
        const data = await response.json();
        
        if (!data.success) throw new Error('获取数据失败');
        
        container.innerHTML = renderFortune(data.data);
    } catch (error) {
        container.innerHTML = `
            <div class="fortune-card">
                <p>⚠️ 暂时无法连接星空网络，请稍后再试</p>
            </div>
        `;
    }
}

function renderFortune(data) {
    return `
        <div class="fortune-card">
            <div class="fortune-header">
                <h2>${data.title} · ${data.type}</h2>
                <p class="time">${data.time}</p>
                <p class="shortcomment">${data.shortcomment}</p>
            </div>

            <div class="fortune-stars">
                ${Array(5).fill().map((_,i) => `
                    <div class="star" style="opacity: ${i < data.fortune.all ? 1 : 0.3}"></div>
                `).join('')}
            </div>

            <div class="luck-items">
                <div class="luck-item">
                    <span>幸运数字</span>
                    <strong>${data.luckynumber || '--'}</strong>
                </div>
                <div class="luck-item">
                    <span>幸运颜色</span>
                    <strong>${data.luckycolor || '--'}</strong>
                </div>
                <div class="luck-item">
                    <span>幸运星座</span>
                    <strong>${data.luckyconstellation || '--'}</strong>
                </div>
            </div>

            <div class="fortune-details">
                <h3>运势详解</h3>
                ${Object.entries(data.fortunetext).map(([key, text]) => `
                    <div class="detail-item">
                        <h4>${getCategoryName(key)} <span class="index">${data.index?.[key] || ''}</span></h4>
                        <p>${text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 辅助函数
function getCategoryName(key) {
    const names = {
        all: '整体运势',
        love: '爱情运势',
        work: '事业学业',
        money: '财富运势',
        health: '健康运势'
    };
    return names[key] || key;
}

// 事件绑定
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        loadHoroscope();
    });
});

document.getElementById('constellation').addEventListener('change', loadHoroscope);

// 初始化
setupTheme();
loadHoroscope();