document.addEventListener('DOMContentLoaded', () => {

  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // ===== смена статуса =====
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', e => {
      const id = e.target.dataset.id;
      const status = e.target.value;

      fetch(`/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({ status })
      }).then(() => location.reload());
    });
  });


  // ===== filter modal =====
  const filterBtn = document.getElementById('filter_btn');
  const filterModal = document.getElementById('filter_modal');

  if (filterBtn && filterModal) {

    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      filterModal.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!filterModal.contains(e.target) && !filterBtn.contains(e.target)) {
        filterModal.classList.remove('show');
      }
    });
  }

});

// ===== gallery modal (open on thumb or +N, close on overlay / close btn / Esc) =====
document.addEventListener('click', function (e) {
  // открыть модалку при клике на .thumb (включая .more)
  const thumb = e.target.closest('.thumb');
  if (thumb && thumb.dataset && thumb.dataset.orderId) {
    const id = thumb.dataset.orderId;
    const modal = document.getElementById('modal-' + id);
    if (modal) {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }
    return;
  }

  // закрыть по элементам с data-close (overlay и close button)
  if (e.target.matches('[data-close]') || e.target.closest('[data-close]')) {
    const modal = e.target.closest('.gallery-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    } else {
      // если клик на overlay элемент
      document.querySelectorAll('.gallery-modal.show').forEach(m=>{
        m.classList.remove('show');
        m.setAttribute('aria-hidden','true');
      });
    }
  }
});

// закрыть при нажатии Esc
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.gallery-modal.show').forEach(m=>{
      m.classList.remove('show');
      m.setAttribute('aria-hidden','true');
    });
  }
});