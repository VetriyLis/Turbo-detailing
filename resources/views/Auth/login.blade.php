@extends('layouts.app')

@section('title', 'Вход')

@section('content')
<div class="container" style="max-width:420px;margin:60px auto;">
  <div class="login-card" style="background:#fff;padding:20px;border-radius:8px;">
    <h2>Вход</h2>

    <form method="POST" action="{{ route('login') }}">
      @csrf

      <div style="margin-bottom:8px">
        <label>Логин</label>
        <input type="login" name="login" required autofocus>
        @error('login') <div style="color:#b00020">{{ $message }}</div> @enderror
      </div>

      <div style="margin-bottom:8px">
        <label>Пароль</label>
        <input type="password" name="password" required>
        @error('password') <div style="color:#b00020">{{ $message }}</div> @enderror
      </div>

      <div>
        <button type="submit">Войти</button>
      </div>
    </form>
  </div>
</div>
@endsection
