<!DOCTYPE html>
<html lang="uk">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
	@vite(['resources/css/app.css',
	'resources/css/search.css',
	'resources/css/cart.css'
	
	])
    @stack('styles')
	
	<title>@yield('title')</title>
</head>
<body>

	<header class="header" id="catheader">
		
		<div class="header-top  items-center justify-center no-wrap">
			<div class="header-top-content page-conteiner justify-center items-center no-wrap flex">
				<nav class="header-top-right flex items-center no-wrap">
				  <a href="{{ route('category', ['category' => 'promo'])}}">Акції</a>
				  <a href="/shops">Магазини</a>
				  <a href="#">Допомога</a>
				</nav>
			</div>	
		</div>
	</header>

		<div class="header-bot flex no-wrap justify-center items-center">
			<div class="header-bot-content page-conteiner flex items-center">
				<div class="logo">
					<a href="/"><img src="{{ Vite::asset('resources/img/logo.svg')}}" alt="Логотип himiya"> </a>
				</div>

				<div class="catalog-wrapper flex js-catalog-trigger" id="catalog-wrapper">
					<button class="catalog-btn justify-center flex items-center ">
						<img src="{{ Vite::asset('resources/img/threebars.svg')}}" alt="">
						<!-- <span class="menu-icon">☰</span> -->
						<span>Каталог</span>
					</button>
				</div>
				
				<div class="search-block flex justify-center items-center no-wrap">
					<div class="search flex justify-center items-center">
						<input type="text" id="searchInput" placeholder="Пошук товарів">
						<button class="mic-btn" id="micBtn">
							<img src="{{ Vite::asset('resources/img/micro.svg')}}" alt="Голосовий пошук">
						</button>
					</div>	
					<button class="search-btn flex items-center justify-center no-wrap ">
						<span>Знайти &nbsp; 🔍</span>
					</button>
					<div class="search-suggestions" id="search-suggestions"></div>
				</div>
				
				<div class="panel flex items-center">
					<div class="enter">
						<a href="#">
							<img src="{{ Vite::asset('resources/img/enter.svg')}}" alt="">	
							<span>Увійти</span>
						</a> 
					</div>
					<div class="selected column">
						<a href="/favorites">
							<img src="{{ Vite::asset('resources/img/selected.svg')}}" alt="">	
							<span class="badge-desktop" id="wishlist-count">0</span>
							<span>Обране</span>
						</a>
					</div>
				</div>
				<div class="tray flex items-center no-wrap ">
					<a href="" class="cart flex items-center justify-center">
						<img src="{{ Vite::asset('resources/img/tray.svg')}}" alt="Кошик">
						<span class="badge-desktop-tray cart-count" id="cart-count"></span>
						<span>Кошик</span>
					</a>
				</div>
			</div>
		</div>

				<!-- OVERLAY -->
		<div class="cart-overlay" id="cart-overlay"></div>

		<!-- CART PANEL -->
		<div class="cart-panel" id="cart-panel">
		<div class="cart-header">
			<h3>Кошик</h3>
			<button id="close-cart">✕</button>
		</div>

		<div class="cart-body" id="cart-items">
			<!-- товары будут тут -->
		</div>

		<div class="cart-footer">
			<div class="cart-total">
			Разом: <span id="cart-total-price">0 ₴</span>
			</div>
			<button class="checkout-btn" id="go-checkout">Оформити замовлення</button>
		</div>
		</div>


<div class="mobile-catalog-trigger-container page-conteiner">
    <button class="mobile-catalog-btn js-mobile-catalog-trigger">
        <img src="{{ Vite::asset('resources/img/threebars.svg')}}" alt="">
        <span>Каталог </span>
    </button>
</div>
		

				<div class="m-catalog-menu">
					<div class="catalog-menu-full" id="catalog-menu-full">
						<div class="catalog-menu">
							<ul id="top-categories"></ul>
						</div>
						<div class="submenus-top" id="top-submenus"></div>
					</div>
				</div>
				
	<main>
		@yield('content')
		
	</main>

	<nav class="mobile-nav">
	  <a href="/" class="nav-item">
		<img src="{{ Vite::asset('resources/img/home.svg')}}" alt="">
		<span>Головна</span>
	  </a>
	
	  <div class="nav-item js-catalog-trigger">
		<img src="{{ Vite::asset('resources/img/catalog-m.svg')}}" alt="">
		<span>Каталог</span>
	  </div>
	
		<a href="" class="cart nav-item">	
			<div class="icon-badge-wrapper">
				<img src="{{ Vite::asset('resources/img/tray.svg')}}" alt="">
				<span class="badge" id="cart-count-mobile"></span>
			</div>
			<span class="nav-label">Кошик</span>
		</a>
		
	  <a href="/favorites" class="nav-item">
		<div class="icon-badge-wrapper">
		  <img src="{{ Vite::asset('resources/img/selected.svg')}}" alt="">
		  <span class="badge wishlist-count-mobile" id="wishlist-count-mobile"></span>
		</div>
		<span>Обране</span>
	  </a>
	
	  <a href="profile.html" class="nav-item">
		<img src="{{ Vite::asset('resources/img/enter.svg')}}" alt="">
		<span>Кабінет</span>
	  </a>
	</nav>



	<footer>
			<p>.</p>
			<p>.</p>
			<p>.</p>
			<p>.</p>
			<p>.</p>
			<p>.</p>

	</footer>
<div id="overlay"></div>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
@stack('scripts')
@vite('resources/js/app.js')
</body>
</html>