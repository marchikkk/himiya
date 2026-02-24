import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css',
                    'resources/css/search.css',
                    'resources/css/cart.css', 
                    'resources/css/category.css', 
                    'resources/css/checkout.css', 
                    'resources/css/product.css', 
                    'resources/css/shops.css', 
                    'resources/js/app.js',
                    'resources/js/botCatalog.js',
                    'resources/js/category.js',
                    'resources/js/checkout.js', 
                    'resources/js/product.js', 
                    'resources/js/filters.js', 
                    'resources/js/shops.js'
                ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
            // usePolling: true,
        },
    },
});
