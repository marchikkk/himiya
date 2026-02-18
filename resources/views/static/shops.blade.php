@extends('layouts/main')

@push('styles')
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
@vite(['resources/css/shops.css'
	])
@endpush

@section('title')
Адреси магазинів
@endsection

@section('content')
<section>
        <div class="shops page-conteiner">
            <div class="streets-list">
				<div class="shops-title">
                	<h3>Магазини</h3>
                </div>
                <div class="streets" data-lat="50.9077" data-lng="34.7981">
                    <p>Атриум</p>
                </div>
                <div class="streets" data-lat="50.9077" data-lng="34.7981">
                    <p>Химик</p>
                </div>
                <div class="streets" data-lat="50.9077" data-lng="34.7981">
                    <p>Засумская</p>
                </div>
                <div class="streets" data-lat="50.9077" data-lng="34.7981">
                    <p>СКД</p>
                </div>
            </div>
            <div class="shops-map">
                <div id="map"></div>
            </div>
        </div>
	</section>
@endsection

@push('scripts')
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
@vite('resources/js/shops.js')
@endpush

