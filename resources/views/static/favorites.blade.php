@extends('layouts/main')

{{-- @push('styles')
@vite(['resources/css/checkout.css'
	])
@endpush --}}

@section('title')
Обрані товари
@endsection

@section('content')
<section class="page-conteiner">
<h1>Мої обрані товари</h1>

<div id="wishlist-items" class="home-section-body"></div>

@include('includes/template')
</section>
@endsection