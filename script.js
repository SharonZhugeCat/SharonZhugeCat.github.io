document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    // 设置按钮点击事件
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    // 点击模态框外部关闭模态框
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // 主题切换
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            
            // 更新活动状态
            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 保存主题设置到本地存储
            localStorage.setItem('theme', theme);
        });
    });

    // 搜索功能
    searchBtn.addEventListener('click', async () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            try {
                const response = await fetch(`https://www.hhlqilongzhu.cn/api/manhua_fanqie.php?name=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();
                
                if (data.code === 200) {
                    displaySearchResults(data.data);
                } else {
                    console.error('搜索失败:', data.msg);
                }
            } catch (error) {
                console.error('API请求错误:', error);
            }
        }
    });

    // 添加展示搜索结果的函数
    function displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        const chapterList = document.getElementById('chapterList');
        resultsContainer.innerHTML = '';
        chapterList.style.display = 'none';

        results.forEach(manga => {
            const card = document.createElement('div');
            card.className = 'manga-card';
            
            const types = manga.type.split(',').map(type => 
                `<span class="type-tag">${type.trim()}</span>`
            ).join('');

            card.innerHTML = `
                <img src="${manga.cover}" alt="${manga.title}" class="manga-cover">
                <div class="manga-info">
                    <h3 class="manga-title">${manga.title}</h3>
                    <div class="manga-author">${manga.author}</div>
                    <div class="manga-type">${types}</div>
                    <div class="manga-intro">${manga.intro}</div>
                </div>
            `;

            card.addEventListener('click', () => loadChapterList(manga));
            resultsContainer.appendChild(card);
        });
    }

    // 添加加载章节列表的函数
    async function loadChapterList(manga) {
        try {
            const response = await fetch(`https://www.hhlqilongzhu.cn/api/manhua_fanqie.php?book_id=${manga.book_id}`);
            const data = await response.json();
            
            if (data.code === 200) {
                displayChapterList(manga, data.data);
            } else {
                console.error('获取章节列表失败:', data.msg);
            }
        } catch (error) {
            console.error('API请求错误:', error);
        }
    }

    // 添加显示章节列表的函数
    function displayChapterList(manga, chapters) {
        const searchResults = document.getElementById('searchResults');
        const chapterList = document.getElementById('chapterList');
        const chapterGrid = document.getElementById('chapterGrid');
        
        // 隐藏搜索结果，显示章节列表
        searchResults.style.display = 'none';
        chapterList.style.display = 'block';

        // 设置漫画详情
        document.getElementById('mangaCover').src = manga.cover;
        document.getElementById('mangaTitle').textContent = manga.title;
        document.getElementById('mangaAuthor').textContent = manga.author;
        document.getElementById('mangaType').innerHTML = manga.type.split(',').map(type => 
            `<span class="type-tag">${type.trim()}</span>`
        ).join('');
        document.getElementById('mangaIntro').textContent = manga.intro;

        // 显示章节列表
        chapterGrid.innerHTML = '';

        // 更新导航条
        const navigationBar = document.getElementById('navigationBar');
        navigationBar.innerHTML = `
            <span class="nav-item" data-nav="search">搜索</span>
            <span class="nav-separator">></span>
            <span class="nav-item" data-nav="manga">${manga.title}</span>
        `;

        // 添加导航事件监听
        navigationBar.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const nav = item.dataset.nav;
                if (nav === 'search') {
                    chapterList.style.display = 'none';
                    searchResults.style.display = 'grid';
                }
            });
        });

        chapters.forEach(chapter => {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'chapter-item';
            chapterItem.textContent = chapter.title;
            chapterItem.addEventListener('click', () => loadChapterContent(chapter, manga));
            chapterGrid.appendChild(chapterItem);
        });
    }

    // 添加回车键搜索功能
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // 从本地存储加载主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeButtons.forEach(button => {
            if (button.dataset.theme === savedTheme) {
                button.classList.add('active');
            }
        });
    }

    // 修改加载章节内容的函数
    async function loadChapterContent(chapter, manga) {
        const mangaContent = document.getElementById('mangaContent');
        const chapterList = document.getElementById('chapterList');
        const imageContainer = document.getElementById('imageContainer');
        const chapterTitle = document.getElementById('chapterTitle');
        
        // 显示加载中状态
        imageContainer.innerHTML = '<div class="loading"></div>';
        chapterTitle.textContent = chapter.title;
        
        // 隐藏章节列表，显示内容区域
        chapterList.style.display = 'none';
        mangaContent.style.display = 'block';

        // 更新导航条
        const contentNavigationBar = document.getElementById('contentNavigationBar');
        contentNavigationBar.innerHTML = `
            <span class="nav-item" data-nav="search">搜索</span>
            <span class="nav-separator">></span>
            <span class="nav-item" data-nav="manga">${manga.title}</span>
            <span class="nav-separator">></span>
            <span class="nav-item" data-nav="chapter">${chapter.title}</span>
        `;

        // 添加导航事件监听
        contentNavigationBar.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const nav = item.dataset.nav;
                if (nav === 'search') {
                    mangaContent.style.display = 'none';
                    chapterList.style.display = 'none';
                    searchResults.style.display = 'grid';
                } else if (nav === 'manga') {
                    mangaContent.style.display = 'none';
                    searchResults.style.display = 'none';
                    chapterList.style.display = 'block';
                }
            });
        });

        try {
            // 修改API调用，直接使用item_id参数
            const response = await fetch(`https://www.hhlqilongzhu.cn/api/manhua_fanqie.php?item_id=${chapter.item_id}`);
            const data = await response.json();
            
            if (data.code === 200) {
                console.log('图片URL列表:', data.data.images);
                displayChapterImages(data.data.images);
            } else {
                imageContainer.innerHTML = '<div class="error">加载失败，请稍后重试</div>';
            }
        } catch (error) {
            console.error('加载章节内容失败:', error);
            imageContainer.innerHTML = '<div class="error">加载失败，请稍后重试</div>';
        }
    }

    // 修改显示章节图片的函数
    function displayChapterImages(images) {
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = '';
        
        images.forEach((imageUrl, index) => {
            const img = document.createElement('img');
            img.className = 'manga-image';
            
            // 处理图片URL，确保它是完整的URL
            const url = imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`;
            img.src = url;
            
            img.alt = `第${index + 1}页`;
            img.loading = 'lazy'; // 启用懒加载
            
            // 添加错误处理
            img.onerror = () => {
                console.error('图片加载失败:', url);
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="50%" y="50%" font-size="12" text-anchor="middle" alignment-baseline="middle">图片加载失败</text></svg>';
            };
            
            imageContainer.appendChild(img);
        });
    }

    // 添加返回章节列表的功能
    document.getElementById('backToChapters').addEventListener('click', () => {
        document.getElementById('mangaContent').style.display = 'none';
        document.getElementById('chapterList').style.display = 'block';
    });
}); 