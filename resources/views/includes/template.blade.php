<template id="product-card-template">
	<div class="card">
		
		<div class="item">
		<div class="article">
			<a href="#" class="product-article">Артикул: </a>
			<button class="wishlist-btn">
				❤️
			</button>
		</div>

		<div class="item-image">
			<a class="product-link">
			<img class="card-img product-image" src="" alt="">
			</a>
		</div>

		<div class="card-body">
			<a class="card-text product-name"></a>
			<h5 class="card-title product-brand"></h5>
			<div class="product-prices">
				<div class="product-prices-discount">
					<span class="old-price"></span>
					<span class=" badge-sale"></span>
				</div>
				<span class="current-price"></span>
			</div>
			<a href="#" class="btn btn-primary card-btn" data-id="">
				Додати <img src="{{ Vite::asset('img/trayy.png')}}" alt="Кошик">
			</a>
		</div>
		</div>
	</div>
</template>