<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class DailySalesReport extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public array $reportData
    )
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Daily Sales Report - ' . now()->format('Y-m-d'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-sales-report',
            with: $this->reportData,
        );
    }

    public function attachments(): array
    {
        return [];
    }

    public function sent($message)
    {
        Log::channel('daily_reports')->info('Daily sales report email sent', [
            'timestamp' => now(),
            'data' => $this->reportData,
        ]);
    }
}
