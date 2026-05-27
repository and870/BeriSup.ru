document.addEventListener('DOMContentLoaded', () => {
  const modalButtons = document.querySelectorAll('[data-modal]');
  const bubbleButtons = document.querySelectorAll('.bubble-btn');
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

  bubbleButtons.forEach(button => {
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
        const albumsBlock = document.getElementById('albums');
        if (albumsBlock) albumsBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    albumGrid.querySelectorAll('.album-item').forEach(btn => {
      btn.addEventListener('click', () => {
        openLightbox(btn.dataset.src);
      });
    });
  }

  renderAlbum();
});