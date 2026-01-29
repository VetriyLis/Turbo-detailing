@extends('layouts.app')

@section('title','Панель — Turbo Detailing')

@section('content')
<div class="container">
  <div class="app-bg"></div>

  <div id="app">
    <div class="controls" style="display:flex;gap:12px;align-items:center;margin:18px 0">
      <button id="add_order" class="add-btn">Добавить заявку</button>

      <form method="GET" class="filter-form" style="margin-left:auto;display:flex;gap:8px;align-items:center">
        <input name="search" placeholder="Поиск" value="{{ request('search') }}">
        <select name="sort">
          <option value="newest" {{ request('sort')=='newest' ? 'selected' : '' }}>От новых к старым</option>
          <option value="oldest" {{ request('sort')=='oldest' ? 'selected' : '' }}>От старых к новым</option>
        </select>
        <input type="date" name="from" value="{{ request('from') }}">
        <input type="date" name="to" value="{{ request('to') }}">
        <select name="status">
          <option value="all">Все</option>
          <option value="new" {{ request('status')=='new' ? 'selected' : '' }}>Новая</option>
          <option value="work" {{ request('status')=='work' ? 'selected' : '' }}>В работе</option>
          <option value="done" {{ request('status')=='done' ? 'selected' : '' }}>Завершена</option>
        </select>
        <button type="submit">Фильтровать</button>
      </form>
    </div>

    <div id="orders_list" class="orders">
      @forelse($orders as $o)
        <div class="card" data-id="{{ $o->id }}">
          <div class="top" style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div class="meta">Заявка <b>{{ $o->code }}</b> <span style="margin-left:12px">{{ $o->datetime }}</span></div>
              <div class="meta">ФИО: <b>{{ $o->fio }}</b></div>
              <div class="meta">Контакт: <b>{{ $o->contact }}</b></div>
            </div>
            <div style="text-align:right">
              <div class="status {{ $o->status }}">{{ $o->status === 'new' ? 'Новая' : ($o->status === 'work' ? 'В работе' : 'Завершена') }}</div>
            </div>
          </div>

          <div class="card-actions" style="display:flex;gap:8px;align-items:center;margin-top:8px">
            <select class="status-select" data-id="{{ $o->id }}">
              <option value="new" {{ $o->status=='new' ? 'selected' : '' }}>Новая</option>
              <option value="work" {{ $o->status=='work' ? 'selected' : '' }}>В работе</option>
              <option value="done" {{ $o->status=='done' ? 'selected' : '' }}>Завершена</option>
            </select>
          </div>
        </div>
      @empty
        <div style="color:#666;padding:16px">Заявок не найдено</div>
      @endforelse
    </div>

    <form id="create_form" method="POST" action="{{ route('orders.store') }}" style="margin-top:18px;display:flex;gap:8px;align-items:center">
      @csrf
      <input name="code" placeholder="Код заявки (например ZA123)" required>
      <input name="fio" placeholder="ФИО" required>
      <input name="contact" placeholder="Контакт" required>
      <input type="datetime-local" name="datetime" value="{{ now()->format('Y-m-d\\TH:i') }}">
      <button type="submit" class="add-btn">Создать</button>
    </form>

  </div>
</div>

<script>window.Laravel = Object.assign(window.Laravel || {}, { orders: @json($orders) });</script>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', () => {
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  document.querySelectorAll('.status-select').forEach(s => {
    s.addEventListener('change', e => {
      const id = e.target.dataset.id;
      const status = e.target.value;
      fetch(`/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({ status })
      }).then(r => r.json()).then(() => location.reload());
    });
  });

  const accBtn = document.getElementById('account_btn');
  const accMenu = document.getElementById('account_menu');
  if (accBtn && accMenu) {
    accBtn.addEventListener('click', () => accMenu.style.display = accMenu.style.display === 'block' ? 'none' : 'block');
  }
});
</script>
@endpush

@endsection
