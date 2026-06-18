<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // 🚀 Production එකේදී assets සහ routes සේරම HTTPS වලින්ම load කරන්න බල කිරීම:
        if (app()->isProduction()) {
            URL::forceScheme('https');

            // ⚡ Railway Background Workers Setup (Console/Build වලදී දුවන්නේ නැත)
            if (!app()->runningInConsole()) {
                // Reverb එක 8090 පෝට් එකේ දැනටමත් දුවනවාද කියා සර්වර් එක ඇතුළෙන්ම චෙක් කරයි.
                $connection = @fsockopen('127.0.0.1', 8090);

                if (!is_resource($connection)) {
                    // දැනටමත් රන් වෙන්නේ නැත්නම් පමණක් නිශ්ශබ්දව (Background) Reverb සහ Queue Worker ස්ටාර්ට් කරයි.
                    exec('php artisan reverb:start --host=0.0.0.0 --port=8090 > /dev/null 2>&1 &');
                    exec('php artisan queue:work --tries=3 > /dev/null 2>&1 &');
                } else {
                    fclose($connection);
                }
            }
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
                : null,
        );
    }
}
