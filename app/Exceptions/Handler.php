<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Support\Facades\Log as LogFacade;

class Handler extends ExceptionHandler
{
    /**
     * Report or log an exception.
     */
    public function report(Throwable $exception)
    {
        try {
            $trace = $exception->getTraceAsString();

            if (strpos($trace, 'SendLowStockNotification') !== false || strpos($trace, 'LowStockNotification') !== false) {
                LogFacade::channel('low_stock')->error('Exception from low-stock flow', [
                    'message' => $exception->getMessage(),
                    'exception' => \get_class($exception),
                    'trace' => $trace,
                ]);

                return; // avoid logging to default laravel.log for these
            }
        } catch (\Throwable $e) {
            // If logging to low_stock fails, fall back to parent reporting to avoid silent failures
            parent::report($exception);
            return;
        }

        parent::report($exception);
    }
}
