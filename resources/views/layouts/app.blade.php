<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>@yield('title','Turbo Detailing')</title>

    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
<header class="td-header">
  <div class="container">
    <div class="td-left">
      <a href="{{ route('dashboard') }}" class="logo">Turbo Detailing</a>
    </div>
    <div class="td-right">
      @auth
        <div class="account-panel">
          <button id="account_btn" class="icon-btn">👤</button>
          <div id="account_menu" class="account-menu" style="display:none;">
            <div style="padding:8px">Аккаунт: <b>{{ auth()->user()->name }}</b></div>
            <hr style="margin:8px 0;border:none;height:1px;background:#eee">
            <form id="logout-form" action="{{ route('logout') }}" method="POST">
              @csrf
              <button type="submit" class="btn-logout">Выйти</button>
            </form>
          </div>
        </div>
      @endauth
      @guest
        @if(Route::has('login'))
          <a href="{{ route('login') }}">Войти</a>
        @endif
      @endguest
    </div>
  </div>
</header>

<main>
    @yield('content')
</main>

<script>window.Laravel = { csrfToken: '{{ csrf_token() }}', user: @json(auth()->user()) };</script>
<script src="{{ asset('js/app.js') }}" defer></script>
@stack('scripts')
</body>
</html>
