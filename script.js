document.addEventListener('DOMContentLoaded', () => {
  const modalButtons = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('[data-close]');


  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');


  const albumGrid = document.getElementById('albumGrid');
  const albumPagination = document.getElementById('albumPagination');


  const albumImages = Array.from({ length: 30 }, (_, i) => `pics/PICC${i + 1}.webp`);
  const albumPerPage = 6;
  let albumPage = 1;


  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navButtons = document.querySelector('.nav-buttons');


  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };


  const closeModal = () => {
    modals.forEach(modal => modal.style.display = 'none');
    document.body.style.overflow = '';
  };


  modalButtons.forEach(button => {
    button.addEventListener('click', function () {
      openModal(this.getAttribute('data-modal') + 'Modal');
    });
  });


  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });


  modals.forEach(modal => {
    modal.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  });


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });


  if (mobileMenuBtn && navButtons) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navButtons.classList.toggle('active');
    });


    navButtons.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navButtons.classList.remove('active');
      });
    });
  }


  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }


  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }


  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }


  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }


  function renderAlbum() {
    if (!albumGrid || !albumPagination) return;


    const totalPages = Math.ceil(albumImages.length / albumPerPage);
    const start = (albumPage - 1) * albumPerPage;
    const pageImages = albumImages.slice(start, start + albumPerPage);


    albumGrid.innerHTML = pageImages.map((src, index) => {
      const num = start + index + 1;
      return `
        <button class="album-item" type="button" data-src="${src}">
          <img src="${src}" alt="Фото ${num}" loading="lazy">
        </button>
      `;
    }).join('');


    albumPagination.innerHTML = Array.from({ length: totalPages }, (_, idx) => `
      <button class="album-page-btn ${idx + 1 === albumPage ? 'active' : ''}" type="button" data-page="${idx + 1}">
        ${idx + 1}
      </button>
    `).join('');


    albumPagination.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        albumPage = Number(btn.dataset.page);
        renderAlbum();
      });
    });


    albumGrid.querySelectorAll('.album-item').forEach(btn => {
      btn.addEventListener('click', () => {
        openLightbox(btn.dataset.src);
      });
    });
  }
  renderAlbum();


  const bookBtn = document.querySelector('.bubble-book-btn');
  const footer = document.querySelector('.footer');


  if (bookBtn) {
    bookBtn.classList.add('blinking');
  }


  function updateButtonPosition() {
    if (!bookBtn || !footer) return;
    
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    if (footerRect.top < viewportHeight - 20) {
      bookBtn.style.position = 'absolute';
      bookBtn.style.bottom = '20px';
      bookBtn.style.right = '18px';
      bookBtn.style.top = 'auto';
      bookBtn.style.transform = 'none';
    } else {
      bookBtn.style.position = 'fixed';
      bookBtn.style.bottom = '20px';
      bookBtn.style.right = '18px';
      bookBtn.style.top = 'auto';
      bookBtn.style.transform = 'none';
    }
  }


  window.addEventListener('load', updateButtonPosition);
  window.addEventListener('scroll', updateButtonPosition);
  window.addEventListener('resize', updateButtonPosition);
  
  updateButtonPosition();
});


// FAQ аккордеон - открывается только 1 вопрос
const faqItems = document.querySelectorAll('.faq-item');


faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');
    
    // Закрываем ВСЕ вопросы сначала
    faqItems.forEach(otherItem => {
      otherItem.classList.remove('active');
    });
    
    // Открываем текущий ТОЛЬКО если он был закрыт
    if (!isOpen) {
      item.classList.add('active');
    }
  });
});


// FAQ пагинация
const faqPages = document.querySelectorAll('.faq-page');
const faqPrev = document.getElementById('faqPrev');
const faqNext = document.getElementById('faqNext');
const faqDots = document.querySelectorAll('.faq-dot');
const faqContainer = document.getElementById('faqContainer');
const faqSection = document.querySelector('.faq-section');


let currentFaqPage = 1;
const totalFaqPages = faqPages.length;


function updateFaqPage() {
  faqPages.forEach((page, index) => {
    const pageNum = index + 1;
    page.style.display = pageNum === currentFaqPage ? 'block' : 'none';
  });
  
  faqDots.forEach((dot, index) => {
    const pageNum = index + 1;
    dot.classList.toggle('active', pageNum === currentFaqPage);
  });
}


if (faqPrev) {
  faqPrev.addEventListener('click', () => {
    currentFaqPage = (currentFaqPage - 1 + totalFaqPages) % totalFaqPages;
    if (currentFaqPage === 0) currentFaqPage = totalFaqPages;
    updateFaqPage();
  });
}


if (faqNext) {
  faqNext.addEventListener('click', () => {
    currentFaqPage = (currentFaqPage + 1) % totalFaqPages;
    if (currentFaqPage === 0) currentFaqPage = totalFaqPages;
    updateFaqPage();
  });
}


faqDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentFaqPage = index + 1;
    updateFaqPage();
  });
});


// FAQ свайп - на ВЕСЬ блок FAQ секцию (включая заголовок)
let faqTouchStartX = 0;
let faqTouchStartY = 0;
let faqTouchEndX = 0;
let faqTouchEndY = 0;
const faqMinSwipeDistance = 50;
const faqMaxVerticalMove = 50;

if (faqSection && faqPages.length > 0) {
  faqSection.addEventListener('touchstart', (e) => {
    faqTouchStartX = e.changedTouches[0].clientX;
    faqTouchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  
  faqSection.addEventListener('touchend', (e) => {
    faqTouchEndX = e.changedTouches[0].clientX;
    faqTouchEndY = e.changedTouches[0].clientY;
    handleFaqSwipe();
  }, { passive: true });
  
  function handleFaqSwipe() {
    const swipeDistanceX = faqTouchEndX - faqTouchStartX;
    const swipeDistanceY = faqTouchEndY - faqTouchStartY;
    
    // Если вертикальное движение слишком большое - это не свайп (скролл или открытие аккордеона)
    if (Math.abs(swipeDistanceY) > faqMaxVerticalMove) {
      return;
    }
    
    // Если горизонтальное движение достаточное - это свайп
    if (Math.abs(swipeDistanceX) > faqMinSwipeDistance) {
      if (swipeDistanceX < 0) {
        // Свайп влево - следующая страница
        currentFaqPage = (currentFaqPage + 1) % totalFaqPages;
        if (currentFaqPage === 0) currentFaqPage = totalFaqPages;
      } else {
        // Свайп вправо - предыдущая страница
        currentFaqPage = (currentFaqPage - 1 + totalFaqPages) % totalFaqPages;
        if (currentFaqPage === 0) currentFaqPage = totalFaqPages;
      }
      updateFaqPage();
    }
  }
}

updateFaqPage();


// Слайд-шоу
const sliderTrack = document.getElementById('sliderTrack');
const sliderSlides = document.querySelectorAll('.slider-slide');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const sliderDots = document.querySelectorAll('.dot');


let currentSlide = 0;
const totalSlides = sliderSlides.length;
let autoSlideInterval;
let userInteracted = false;


function updateSlider() {
  if (!sliderTrack) return;
  
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  sliderSlides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
  
  sliderDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}


function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    if (!userInteracted) {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    }
  }, 5000);
}


function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}


if (sliderPrev) {
  sliderPrev.addEventListener('click', () => {
    userInteracted = true;
    stopAutoSlide();
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  });
}


if (sliderNext) {
  sliderNext.addEventListener('click', () => {
    userInteracted = true;
    stopAutoSlide();
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  });
}


sliderDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    userInteracted = true;
    stopAutoSlide();
    currentSlide = index;
    updateSlider();
  });
});


// Свайп для слайд-шоу
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const minSwipeDistance = 50;
const maxVerticalMove = 50;

if (sliderTrack && sliderSlides.length > 0) {
  sliderTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  
  sliderTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY = touchEndY - touchStartY;
    
    // Если вертикальное движение слишком большое - это не свайп
    if (Math.abs(swipeDistanceY) > maxVerticalMove) {
      return;
    }
    
    // Если горизонтальное движение достаточное - это свайп
    if (Math.abs(swipeDistanceX) > minSwipeDistance) {
      userInteracted = true;
      stopAutoSlide();
      
      if (swipeDistanceX < 0) {
        // Свайп влево - следующий слайд
        currentSlide = (currentSlide + 1) % totalSlides;
      } else {
        // Свайп вправо - предыдущий слайд
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      }
      updateSlider();
    }
  }
}

startAutoSlide();
