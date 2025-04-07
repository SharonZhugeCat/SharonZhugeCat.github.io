// script.js
// 主题管理
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // 更新主题选择器显示
    const themeNames = {
        neomorphic: '新拟态',
        neobrutalism: '新野蛮主义',
        morandi: '莫兰迪'
    };
    document.querySelector('.select-box').textContent = themeNames[theme];
    
    document.querySelector('.select-options').classList.remove('active');
}

// 模式切换
function toggleMode() {
    const currentMode = document.body.getAttribute('data-mode');
    const newMode = currentMode === 'day' ? 'night' : 'day';
    document.body.setAttribute('data-mode', newMode);
    localStorage.setItem('mode', newMode);
    
    // 延迟调整高度以匹配动画
    setTimeout(updateCardHeight, 600);
}

// 下拉菜单控制
function toggleSelect() {
    document.querySelector('.select-options').classList.toggle('active');
}

// 动态高度计算
function updateCardHeight() {
    const cards = document.querySelectorAll('.profile-card');
    cards.forEach(card => {
        const front = card.querySelector('.front');
        const back = card.querySelector('.back');
        const maxHeight = Math.max(front.scrollHeight, back.scrollHeight);
        card.style.height = `${maxHeight}px`;
        card.querySelector('.card-inner').style.height = `${maxHeight}px`;
    });
}

// 技能标签搜索功能
function initSkillTags() {
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.style.cursor = 'pointer';
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            const keyword = encodeURIComponent(tag.textContent.trim());
            window.open(`https://cn.bing.com/search?q=${keyword}`, '_blank');
        });
    });
}

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
    // 加载保存的设置
    const savedTheme = localStorage.getItem('theme') || 'neomorphic';
    const savedMode = localStorage.getItem('mode') || 'day';
    
    // 应用主题
    document.body.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-mode', savedMode);
    
    // 初始化主题选择器文字
    const themeNames = {
        neomorphic: '新拟态',
        neobrutalism: '新野蛮主义',
        morandi: '莫兰迪'
    };
    document.querySelector('.select-box').textContent = themeNames[savedTheme];

    // 关闭下拉菜单的逻辑
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-select')) {
            document.querySelector('.select-options').classList.remove('active');
        }
    });

    // 初始化技能标签
    initSkillTags();

    // 初始高度计算
    updateCardHeight();

    fetchDailyPoetry();
});

// 窗口变化监听
window.addEventListener('resize', updateCardHeight);

function fetchDailyPoetry() {
    fetch('https://api.vvhan.com/api/ian/shici?type=json')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('.poetry-content').textContent = data.data.content;
                document.querySelector('.poetry-form').textContent = `——《${data.data.form}》`;
            }
        })
        .catch(error => {
            console.error('获取诗词失败:', error);
            document.querySelector('.poetry-content').textContent = '未能获取诗词内容，请稍后再试。';
        });
}

document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
    });
});

document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('click', (e) => {
        // 添加点击反馈动画
        e.currentTarget.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.currentTarget.style.transform = 'none';
        }, 200);
    });
});