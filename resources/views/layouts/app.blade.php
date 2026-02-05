<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>@yield('title','Turbo Detailing')</title>
    <link rel="stylesheet" href="{{ asset('resources/css/style.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
<header class="td-header">
  <div class="container">
    <div class="td-left">
      <a href="{{ route('dashboard') }}" class="logo">Turbo Detailing</a>
    </div>
    <div class="td-right">
    </div>
  </div>
</header>

<main>
  <div class="app-bg">
  </div>
    @yield('content')
</main>

<script src="{{ asset('resources/js/script.js') }}" defer></script>
@stack('scripts')
</body>
</html>
