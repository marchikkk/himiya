@extends('layouts/main')

@push('styles')
@vite(['resources/css/product.css'
	])
@endpush

@section('title')
Товар
@endsection

@section('content')
 <section class="page-conteiner">
    <div class="home-section-body" id="product-page-container"></div>
    @include('includes/template')
    
    <div id="stock-status"></div>
</section>
@endsection

@push('scripts')
@vite('resources/js/product.js')
@endpush