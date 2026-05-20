document.addEventListener('DOMContentLoaded', () => {
  const modalButtons = document.querySelectorAll('[data-modal]');
  const bubbleButtons = document.querySelectorAll('.bubble-btn');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('[data-close]');

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
    if (e.key === 'Escape') closeModal();
  });
});