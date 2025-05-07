// رسالة ترحيب ديناميكية
// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
  // العناصر الأساسية
  const body = document.body;
  const html = document.documentElement;
  
  // 1. شريط التقدم العلوي عند التمرير
  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  body.prepend(scrollProgress);
  
  window.addEventListener('scroll', function() {
    const scrollTop = html.scrollTop || body.scrollTop;
    const scrollHeight = html.scrollHeight || body.scrollHeight;
    const clientHeight = html.clientHeight;
    const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
  });

  // 2. تأثيرات التمرير السلس للروابط
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // تحديث URL بدون إعادة تحميل الصفحة
        history.pushState(null, null, targetId);
      }
    });
  });

  // 3. كشف العناصر عند التمرير (Scroll Reveal)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // 4. زر العودة للأعلى
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  body.appendChild(backToTopBtn);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 5. معرض الصور مع Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="" alt="">
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></button>
      <button class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></button>
    </div>
  `;
  body.appendChild(lightbox);
  
  let currentImageIndex = 0;
  const images = [];
  
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      images.push(img.src);
      
      item.addEventListener('click', function() {
        currentImageIndex = index;
        openLightbox(images[currentImageIndex]);
      });
    }
  });
  
  function openLightbox(src) {
    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.src = src;
    lightbox.classList.add('active');
    body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    body.style.overflow = '';
  }
  
  function navigateLightbox(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
      currentImageIndex = images.length - 1;
    } else if (currentImageIndex >= images.length) {
      currentImageIndex = 0;
    }
    
    lightbox.querySelector('img').src = images[currentImageIndex];
  }
  
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      closeLightbox();
    }
  });
  
  document.querySelector('.lightbox-prev').addEventListener('click', function(e) {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  
  document.querySelector('.lightbox-next').addEventListener('click', function(e) {
    e.stopPropagation();
    navigateLightbox(1);
  });
  
  document.addEventListener('keydown', function(e) {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    }
  });

  // 6. القائمة المتنقلة للشاشات الصغيرة
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  document.querySelector('.navbar').appendChild(mobileMenuBtn);
  
  const navMenu = document.querySelector('.nav-menu');
  
  mobileMenuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? 
      '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // 7. التحقق من النماذج
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (isValid) {
        // يمكن إضافة إرسال AJAX هنا
        form.reset();
        showToast('تم إرسال الرسالة بنجاح!', 'success');
      } else {
        showToast('الرجاء ملء جميع الحقول المطلوبة', 'error');
      }
    });
  });

  // 8. عرض إشعارات Toast
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // 9. عدّاد الأرقام المتدرج
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    function startCounter(element) {
      const target = +element.getAttribute('data-target');
      const duration = +element.getAttribute('data-duration') || 2000;
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        }
      }, 16);
    }
  }

  // 10. تأثيرات الصور عند التحويم
  const hoverImages = document.querySelectorAll('.hover-effect');
  
  hoverImages.forEach(img => {
    img.addEventListener('mousemove', function(e) {
      const x = e.clientX - this.getBoundingClientRect().left;
      const y = e.clientY - this.getBoundingClientRect().top;
      const centerX = this.offsetWidth / 2;
      const centerY = this.offsetHeight / 2;
      
      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
    });
    
    img.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // 11. نظام التبويبات
  const tabContainers = document.querySelectorAll('.tabs');
  
  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        // إزالة الفعالية من جميع الأزرار والمحتويات
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        // إضافة الفعالية للعناصر المحددة
        this.classList.add('active');
        contents[index].classList.add('active');
      });
    });
  });

  // 12. تأثيرات النصوص المتحركة
  const textElements = document.querySelectorAll('.animate-text');
  
  textElements.forEach(text => {
    const letters = text.textContent.split('');
    text.textContent = '';
    
    letters.forEach((letter, i) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.animationDelay = `${i * 0.1}s`;
      text.appendChild(span);
    });
  });

  // 13. نظام التقييم بالنجوم
  const ratingContainers = document.querySelectorAll('.star-rating');
  
  ratingContainers.forEach(container => {
    const stars = container.querySelectorAll('.star');
    let currentRating = 0;
    
    stars.forEach((star, index) => {
      star.addEventListener('click', function() {
        currentRating = index + 1;
        updateStars();
      });
      
      star.addEventListener('mouseover', function() {
        highlightStars(index);
      });
      
      star.addEventListener('mouseout', function() {
        updateStars();
      });
    });
    
    function highlightStars(index) {
      stars.forEach((star, i) => {
        star.classList.toggle('active', i <= index);
      });
    }
    
    function updateStars() {
      stars.forEach((star, i) => {
        star.classList.toggle('active', i < currentRating);
      });
    }
  });

  // 14. تأثيرات الخلفية الجذابة
  const animatedBackgrounds = document.querySelectorAll('.animated-bg');
  
  animatedBackgrounds.forEach(bg => {
    const canvas = document.createElement('canvas');
    bg.appendChild(canvas);
    
    canvas.width = bg.offsetWidth;
    canvas.height = bg.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = Math.floor(canvas.width * canvas.height / 10000);
    
    // إنشاء الجسيمات
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`
      });
    }
    
    // رسم الجسيمات
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // تحديث المواقع
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // التحقق من الحدود
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // تغيير الحجم عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
      canvas.width = bg.offsetWidth;
      canvas.height = bg.offsetHeight;
    });
  });

  // 15. نظام تحميل المحتوى عند التمرير (Infinite Scroll)
  let isLoading = false;
  
  if (document.querySelector('.infinite-scroll-container')) {
    window.addEventListener('scroll', function() {
      const container = document.querySelector('.infinite-scroll-container');
      const loader = document.querySelector('.infinite-scroll-loader');
      
      if (isLoading || !container || !loader) return;
      
      const containerRect = container.getBoundingClientRect();
      const loaderRect = loader.getBoundingClientRect();
      
      if (loaderRect.top < window.innerHeight + 200) {
        isLoading = true;
        loader.classList.add('loading');
        
        // محاكاة جلب البيانات
        setTimeout(() => {
          loadMoreContent();
          isLoading = false;
          loader.classList.remove('loading');
        }, 1000);
      }
    });
    
    function loadMoreContent() {
      const container = document.querySelector('.infinite-scroll-container');
      const itemsPerLoad = 6;
      
      // هنا يمكن جلب البيانات من الخادم باستخدام AJAX
      // في هذا المثال سنقوم بإضافة عناصر وهمية
      for (let i = 0; i < itemsPerLoad; i++) {
        const item = document.createElement('div');
        item.className = 'item';
        item.textContent = `عنصر جديد ${container.children.length + 1}`;
        container.appendChild(item);
      }
    }
  }
});

// 16. نظام الإشعارات في المتصفح
function showBrowserNotification(title, options = {}) {
  if (!('Notification' in window)) {
    console.log('هذا المتصفح لا يدعم الإشعارات');
    return;
  }
  
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }
}

// 17. نظام حفظ التفضيلات (مثل الوضع الليلي)
function savePreference(key, value) {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function getPreference(key) {
  if (typeof Storage !== 'undefined') {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  return null;
}

// 18. نظام تحميل الملفات مع معاينة الصور
function setupFileUpload(previewId, inputId) {
  const fileInput = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  if (fileInput && preview) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      
      if (file) {
        const reader = new FileReader();
        
        reader.addEventListener('load', function() {
          preview.src = this.result;
          preview.style.display = 'block';
        });
        
        reader.readAsDataURL(file);
      }
    });
  }
}

// 19. نظام البحث الفوري
function setupLiveSearch(inputId, resultsId, dataUrl) {
  const searchInput = document.getElementById(inputId);
  const resultsContainer = document.getElementById(resultsId);
  
  if (searchInput && resultsContainer) {
    let timer;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(timer);
      
      const query = this.value.trim();
      
      if (query.length < 2) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
      }
      
      timer = setTimeout(() => {
        // هنا يمكن جلب البيانات من الخادم باستخدام AJAX
        fetch(`${dataUrl}?q=${encodeURIComponent(query)}`)
          .then(response => response.json())
          .then(data => {
            displayResults(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }, 300);
    });
    
    function displayResults(results) {
      if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">لا توجد نتائج</div>';
        resultsContainer.style.display = 'block';
        return;
      }
      
      let html = '';
      results.forEach(result => {
        html += `
          <div class="search-result">
            <a href="${result.url}">${result.title}</a>
            <p>${result.description}</p>
          </div>
        `;
      });
      
      resultsContainer.innerHTML = html;
      resultsContainer.style.display = 'block';
    }
    
    // إخفاء النتائج عند النقر خارجها
    document.addEventListener('click', function(e) {
      if (!resultsContainer.contains(e.target) {
        resultsContainer.style.display = 'none';
      }
    });
  }
}

// 20. نظام خرائط جوجل المدمجة
function initMap(mapId, options = {}) {
  const mapElement = document.getElementById(mapId);
  
  if (mapElement && typeof google !== 'undefined') {
    const center = options.center || { lat: 24.7136, lng: 46.6753 }; // الرياض كموقع افتراضي
    const zoom = options.zoom || 12;
    
    const map = new google.maps.Map(mapElement, {
      center: center,
      zoom: zoom,
      styles: options.styles || []
    });
    
    if (options.marker) {
      new google.maps.Marker({
        position: center,
        map: map,
        title: options.marker.title || 'موقعنا'
      });
    }
    
    return map;
  }
}


window.onload = function() {
    alert("مرحبًا بك في موقع محمد حسون! نتمنى لك تجربة رائعة.");
};

// زر تبديل الألوان
function toggleTheme() {
    const body = document.body;
    const isLight = body.style.backgroundColor === "white";
    body.style.backgroundColor = isLight ? "#333" : "white";
    body.style.color = isLight ? "#fff" : "#333";
}
