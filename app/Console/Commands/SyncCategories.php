<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http; // Обязательно для запросов
use App\Models\Category;             // Обязательно для базы

class SyncCategories extends Command
{
    // Убедись, что именно этот signature ты вызываешь в главной команде через $this->call()
    protected $signature = 'sync:categories';
    protected $description = 'Синхронизация категорий из 1С с очисткой BOM';

    public function handle()
    {
        $this->info('Starting category sync...');

        // Делаем запрос (пока адрес прямо тут, чтобы не зависеть от кеша .env)
        $response = Http::withBasicAuth('', '')
            ->get(env('ONEC_API_CATEGORIES'));

        if (!$response->ok()) {
            $this->error("1C API error. Status: " . $response->status());
            return Command::FAILURE;
        }

        // 1. Получаем сырой текст
        $rawBody = $response->body();

        // 2. Убираем BOM (невидимые символы \xef\xbb\xbf в начале строки)
        $cleanBody = trim($rawBody, "\xef\xbb\xbf");

        // 3. Декодируем вручную в массив
        $data = json_decode($cleanBody, true);

        // Проверяем, не сломался ли JSON при декодировании
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error("Ошибка JSON: " . json_last_error_msg());
            $this->line("Raw body preview: " . substr($cleanBody, 0, 100));
            return Command::FAILURE;
        }

        if (!isset($data['categories']) || !is_array($data['categories'])) {
            $this->error('Ключ "categories" не найден в ответе или пуст.');
            return Command::FAILURE;
        }

        $count = 0;
        foreach ($data['categories'] as $item) {
            // Находим по ID и обновляем имя. Если нет — создаем.
            Category::updateOrCreate(
                ['external_id' => $item['id']],
                [
                    'name' => $item['name'],
                    // Если parent_id пустой или null, записываем null
                    'parent_external_id' => !empty($item['parent_id']) ? $item['parent_id'] : null
                ]
            );
            $count++;
        }

        $this->info("Successfully synced {$count} categories!");
        return Command::SUCCESS;
    }
}