@extends('layouts/main')

@section('title')
himiya
@endsection 

@section('content')
<div class="products-grid" id="productsGrid"></div>
				
	<section class="page-conteiner">
		<div class="container-fluid page-conteiner padd">
			<div id="carousels" class="row ">
				<!-- Левая колонка: каталог -->
				<div class="catal-hover ">
				<div id="catPush" class="catal col-lg-3 col-md-4 col-sm-12 p-3">
					<ul class="men" id="main-categories-list">
					</ul>
				</div>
				<div class="submenus" id="submenus-container">
				</div>
				
				<!-- ВЕРХНЯЯ КАРУСЕЛЬ -->
				<div class="col-lg-9 col-md-8 col-sm-12 padd">
					<div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
						<div class="carousel-inner">
							<div class="carousel-item active">
								<a href="/"><img src="{{ asset('img/carousel/test.png')}}" class="d-block w-100" alt="..."></a>
							</div>
							<div class="carousel-item">
								<a href="/"><img src="{{ asset('img/carousel/test1.png')}}" class="d-block w-100" alt="..."></a>
							</div>
							<div class="carousel-item">
								<a href="/"><img src="{{ asset('img/carousel/test3.png')}}" class="d-block w-100" alt="..."></a>
							</div>
						</div>
						<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
							<span class="carousel-control-prev-icon" aria-hidden="true"></span>
							<span class="visually-hidden">Previous</span>
						</button>
						<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
							<span class="carousel-control-next-icon" aria-hidden="true"></span>
							<span class="visually-hidden">Next</span>
						</button>
					</div>

 <!-- НИЖНЯЯ КАРУСЕЛЬ -->
					<div id="bot-carousel" class="swiper mySwiper marg">
						<div class="swiper-wrapper">

							
							<div class="swiper-slide">
							<div class="card">
								<a href="/"><img src="{{ asset('img/carousel/test2.jpg')}}" class="card-img-top"></a>
							</div>
							</div>

							<div class="swiper-slide">
							<div class="card">
								<a href="/"><img src="{{ asset('img/carousel/test2.jpg')}}" class="card-img-top"></a>
							</div>
							</div>

							<div class="swiper-slide">
							<div class="card">
								<a href="/"><img src="{{ asset('img/carousel/test2.jpg')}}" class="card-img-top"></a>
							</div>
							</div>

							<div class="swiper-slide">
							<div class="card">
								<a href="/"><img src="{{ asset('img/carousel/test2.jpg')}}" class="card-img-top"></a>
							</div>
							</div>

							<div class="swiper-slide">
							<div class="card">
								<a href="/"><img src="{{ asset('img/carousel/test2.jpg')}}" class="card-img-top"></a>
							</div>
							</div>

							<div class="swiper-slide">
							<div class="card">
								<a href="/"><img src="{{ asset('img/carousel/test2.jpg')}}" class="card-img-top"></a>
							</div>
							</div>

							<div class="swiper-slide">
							<div class="card">
								<a href="/"><img src="{{ asset('img/carousel/test2.jpg')}}" class="card-img-top"></a>
							</div>
							</div>
						</div>

					<!-- Кнопки -->
						<div class="swiper-button-next"></div>
						<div class="swiper-button-prev"></div>
					</div>


    			</div> <!-- Конец правой колонки -->

				</div>
			</div>
		</div>
	</section>

	<section class="promo-section page-conteiner">
		<div class="home-section-insc">
			<h4>Товари в акції</h4>
			<a href="{{ route('category', ['category' => 'promo'])}}" class="home-section-link"><span>Переглянути всі</span></a>	
		</div>
		<div id="promo-container" class="home-section-body"></div>
		

		@include('includes/template')

	</section>
		
	<section class="test-section page-conteiner">
		<div class="home-section-insc">
			<h4>Вилки</h4>
			<a href="{{route('category', ['category' => '680f1a87-eea0-11ef-98dc-002324220145'])}}" class="home-section-link"><span>Переглянути всі</span></a>	
		</div>
		<div class="home-section-body" id="forks-container"></div>

	</section>

	<section class="test-section page-conteiner">
		<div class="home-section-insc">
			<h4>Чайники</h4>
			<a href="{{ route('category', ['category' => '680f1a86-eea0-11ef-98dc-002324220145'])}}" class="home-section-link"><span>Переглянути всі</span></a>	
		</div>
		<div class="home-section-body" id="kettles-container"></div>

	</section>

	<section class="test-section page-conteiner">
		<div class="home-section-insc">
			<h4>Test</h4>
			<a href="{{ route('category', ['category' => '801051ca-0533-11f1-99fe-a85e45177e72'])}}" class="home-section-link"><span>Переглянути всі</span></a>	
		</div>
		<div class="home-section-body" id="test-container"></div>

	</section>
@endsection

@push('scripts')
@vite(['resources/js/botCatalog.js', 'resources/js/category.js'])
@endpush