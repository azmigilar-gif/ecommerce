<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Jobs\SendDailySalesReport;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Run daily sales report every day at 5:00 PM
        $schedule->job(new SendDailySalesReport())->dailyAt('17:00');

        // Also run at 11:59 PM for end of day
        $schedule->job(new SendDailySalesReport())->dailyAt('23:59');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
