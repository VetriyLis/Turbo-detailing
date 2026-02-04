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
