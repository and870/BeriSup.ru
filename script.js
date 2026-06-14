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

  const bookBtn = document.querySelector('.bubble-book-btn');
  const footer = document.querySelector('.footer');

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modals.forEach(modal => modal.style.display = 'none');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    if (bookBtn) {
      bookBtn.style.display = 'none';
    }
  };

  const closeModal = () => {
    modals.forEach(modal => modal.style.display = 'none');
    document.body.style.overflow = '';
    
    if (bookBtn) {
      bookBtn.style.display = '';
      bookBtn.style.visibility = 'visible';
      bookBtn.style.opacity = '1';
    }
    
    if (mobileMenuBtn && navButtons) {
      mobileMenuBtn.classList.remove('active');
      navButtons.classList.remove('active');
    }
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
    mobileMenuBtn.classList.remove('active');
    navButtons.classList.remove('active');
    
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = mobileMenuBtn.classList.contains('active');
      
      if (isActive) {
        mobileMenuBtn.classList.remove('active');
        navButtons.classList.remove('active');
      } else {
        mobileMenuBtn.classList.add('active');
        navButtons.classList.add('active');
      }
    });

    navButtons.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navButtons.classList.remove('active');
      });
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (window.scrollY !== lastScrollY) {
        mobileMenuBtn.classList.remove('active');
        navButtons.classList.remove('active');
        lastScrollY = window.scrollY;
      }
    }, { passive: true });

    document.addEventListener('click', (e) => {
      if (mobileMenuBtn.classList.contains('active')) {
        const isClickInsideMenu = navButtons.contains(e.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnMenuBtn) {
          mobileMenuBtn.classList.remove('active');
          navButtons.classList.remove('active');
        }
      }
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

  if (bookBtn) {
    bookBtn.classList.add('blinking');
    bookBtn.style.visibility = 'visible';
    bookBtn.style.opacity = '1';
  }

  function hideBookBtnOnFooter() {
    if (!bookBtn || !footer) {
      return;
    }
    
    const footerRect = footer.getBoundingClientRect();
    const bookBtnRect = bookBtn.getBoundingClientRect();
    
    const footerTopVisible = footerRect.top;
    const bookBtnBottom = bookBtnRect.bottom;
    
    if (footerTopVisible > 0 && bookBtnBottom >= footerTopVisible) {
      bookBtn.style.visibility = 'hidden';
      bookBtn.style.opacity = '0';
    } else {
      bookBtn.style.visibility = 'visible';
      bookBtn.style.opacity = '1';
    }
  }

  let ticking = false;
  if (bookBtn && footer) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          hideBookBtnOnFooter();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    
    hideBookBtnOnFooter();
    window.addEventListener('resize', hideBookBtnOnFooter);
  }

  // FAQ аккордеон
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      if (!isOpen) {
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });
        item.classList.add('active');
      } else {
        item.classList.remove('active');
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

  // FAQ свайп
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
      
      if (Math.abs(swipeDistanceY) > faqMaxVerticalMove) {
        return;
      }
      
      if (Math.abs(swipeDistanceX) > faqMinSwipeDistance) {
        if (swipeDistanceX < 0) {
          currentFaqPage = (currentFaqPage + 1) % totalFaqPages;
          if (currentFaqPage === 0) currentFaqPage = totalFaqPages;
        } else {
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
      
      if (Math.abs(swipeDistanceY) > maxVerticalMove) {
        return;
      }
      
      if (Math.abs(swipeDistanceX) > minSwipeDistance) {
        userInteracted = true;
        stopAutoSlide();
        
        if (swipeDistanceX < 0) {
          currentSlide = (currentSlide + 1) % totalSlides;
        } else {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        }
        updateSlider();
      }
    }
  }

  startAutoSlide();
});
