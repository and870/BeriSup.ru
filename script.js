document.addEventListener('DOMContentLoaded', function() {
  // Получаем все кнопки с атрибутом data-modal
  const modalButtons = document.querySelectorAll('[data-modal]');
  // Получаем все пузырьки-кнопки
  const bubbleButtons = document.querySelectorAll('.bubble-btn');
  // Получаем все модальные окна
  const modals = document.querySelectorAll('.modal');
  // Получаем все кнопки закрытия
  const closeButtons = document.querySelectorAll('.close');

  // Функция открытия модального окна
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
      // Блокируем скролл на фоне
      document.body.style.overflow = 'hidden';
    }
  }

  // Функция закрытия модального окна
  function closeModal() {
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
    // Восстанавливаем скролл
    document.body.style.overflow = 'auto';
  }

  // Обработчики для кнопок шапки
  modalButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal') + 'Modal';
      openModal(modalId);
    });
  });

  // Обработчики для пузырьков-кнопок
  bubbleButtons.forEach((bubble, index) => {
    bubble.addEventListener('click', function() {
      // Определяем ID модального окна на основе индекса пузырька
      const modalIds = [
        'walkModal',
        'trainingModal',
        'groupModal',
        'photoModal',
        'corporateModal',
        'equipmentModal'
      ];
      const targetModalId = modalIds[index];
      openModal(targetModalId);
    });
  });

  // Обработчики для кнопок закрытия
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  // Закрытие по клику вне окна
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  });

  // Закрытие по клавише ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});

// Создаём пузырьки-кнопки при загрузке
function createBubbleButtons() {
  const bubblesContainer = document.getElementById('bubblesContainer');
  const bubbleCount = 6;
  const colors = ['#11f301', '#611771', '#45b7d1', '#1dd17d', '#fec50a', '#2a1cf3'];
  const bubbleLabels = [
    'Прогулки по Москве реке',
    'Обучение',
    'Групповые туры',
    'Фотосессии',
    'Корпоративы',
    'Прокат оборудования'
  ];

  for (let i = 0; i < bubbleCount; i++) {
    const bubbleButton = document.createElement('button');
    bubbleButton.className = 'bubble-btn';
    bubbleButton.textContent = bubbleLabels[i];
    bubbleButton.setAttribute('type', 'button'); // Явно указываем тип кнопки

    // Случайный цвет для каждого пузырька
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    bubbleButton.style.background = `radial-gradient(circle, ${randomColor} 0%, transparent 70%)`;

    // Случайная задержка анимации
    const delay = Math.random() * 0.5;
    bubbleButton.style.animationDelay = `${delay}s`;

    bubblesContainer.appendChild(bubbleButton);
  }
}

// Запускаем создание пузырьков
createBubbleButtons();
