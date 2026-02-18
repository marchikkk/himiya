@extends('layouts/main')

@push('styles')
@vite(['resources/css/category.css'
	])
@endpush

@section('title')
Каталог
@endsection

@section('content')
<section class="page-conteiner">
    <h1 id="category-title"></h1>
        
    <div class="home-section-body" id="products-container"></div>
        
    @include('includes/template')
</section>
@endsection

@push('scripts')
@vite('resources/js/category.js')
@endpush