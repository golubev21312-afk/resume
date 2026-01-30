document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initAllCarousels();
    initHobbiesModal();
});

/* =============================================
   ЧАСЫ И КАЛЕНДАРЬ
   ============================================= */
function initClock() {
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                       'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        
        const day = days[now.getDay()];
        const date = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        
        const calendarElement = document.getElementById('calendar');
        if (calendarElement) {
            calendarElement.textContent = `${day}, ${date} ${month} ${year}`;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

/* =============================================
   МОДАЛЬНЫЕ ОКНА ДЛЯ УВЛЕЧЕНИЙ
   ============================================= */
function initHobbiesModal() {
    const hobbies = document.querySelectorAll('.hobby');
    const overlay = document.getElementById('modal-overlay');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Открытие модалки при клике на хобби
    hobbies.forEach(hobby => {
        hobby.addEventListener('click', function() {
            const hobbyType = this.dataset.hobby;
            const modal = document.getElementById(`modal-${hobbyType}`);
            
            if (modal && overlay) {
                overlay.classList.add('active');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие по кнопке X
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Закрытие по клику на оверлей
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    function closeModal() {
        if (overlay) {
            overlay.classList.remove('active');
        }
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
}

/* =============================================
   КАРУСЕЛИ
   ============================================= */
function initAllCarousels() {
    const carouselContainers = document.querySelectorAll('.carousel-container');
    
    carouselContainers.forEach((container, index) => {
        initCarousel(container, index);
    });
}

function initCarousel(container, carouselIndex) {
    const carouselInner = container.querySelector('.carousel-inner');
    const slides = container.querySelectorAll('.carousel-item');
    const controls = container.querySelectorAll('.carousel-control');
    const prevButton = container.querySelector('.carousel-arrow.prev');
    const nextButton = container.querySelector('.carousel-arrow.next');
    
    if (!carouselInner || slides.length === 0) return;
    
    let currentSlide = 0;
    let autoplayInterval;
    
    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
        
        controls.forEach((control, i) => {
            control.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Обработчики для точек
    controls.forEach((control, index) => {
        control.addEventListener('click', () => {
            showSlide(index);
            startAutoplay();
        });
    });
    
    // Стрелки
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            startAutoplay();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            startAutoplay();
        });
    }
    
    // Пауза при наведении
    const carousel = container.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }
    
    // Свайпы на мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoplay();
            }
        }, { passive: true });
    }
    
    // Запуск
    startAutoplay();
}
