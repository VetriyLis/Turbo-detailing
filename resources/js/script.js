document.addEventListener('DOMContentLoaded', () => {

  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // ===== смена статуса заявки =====
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
      })
      .then(() => location.reload());
    });
  });

  // ===== filter modal =====
const filterBtn = document.getElementById('filter_btn');
const filterModal = document.getElementById('filter_modal');

if (filterBtn && filterModal) {

  // открыть/закрыть
  filterBtn.addEventListener('click', () => {
    filterModal.classList.toggle('show');
  });

  // закрытие по клику вне окна
  document.addEventListener('click', (e) => {
    if (!filterModal.contains(e.target) && !filterBtn.contains(e.target)) {
      filterModal.classList.remove('show');
    }
  });
}


});
