@extends('layouts/main')

@push('styles')
@vite(['resources/css/search.css'
	])
@endpush

@section('title')
Результати пошуку
@endsection

@section('content')
<section class="page-conteiner">  
    <h1 id="search-title">Результати пошуку</h1>

	<div class="sort-bar" id="sort-bar">
	<select id="sortSelect">
		<!-- <option value="">Сортування</option> -->
		<option value="name_asc">Назва A–Z</option>
		<option value="name_desc">Назва Z–A</option>
		<option value="price_asc">Ціна ↑</option>
		<option value="price_desc">Ціна ↓</option>
		<option value="promo_desc">Найбільша знижка</option>
	</select>
	</div>

<div class="mobile-toolbar">
	<button id="openFiltersBtn">Фільтри</button>
</div>

    <div class="page">
      
        <aside class="filters" id="filters">
            <h4>Фільтри</h4>

			<div class="filter-group">
				<label>
					<input type="checkbox" id="onlyPromo">
					Тільки зі знижкою
				</label>
			</div>

            <div class="filter-group">
                <label>Ціна</label>
                <input type="number" id="priceMin" placeholder="від">
                <input type="number" id="priceMax" placeholder="до">
            </div>

            <div class="filter-group" id="brand-filters">
                <label>Бренд</label>
            </div>

            <button id="applyFilters">Застосувати</button>
			<button id="resetFilters" class="filters-reset-btn">Очистити фільтри</button>
        </aside>

        <main>
            <div id="products-container" class="home-section-body"></div>
        </main>
		<div class="no-results-block" id="">
			<p id="no-results" class="no-results"></p>
			<a href="/" class="back-to-index">← &nbsp; Повернутися на головну сторінку</a>
		</div>
    </div>

    @include('includes/template')
</section>
@endsection

@push('scripts')
@vite('resources/js/filters.js')
@endpush