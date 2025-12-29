<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }

        .header {
            background-color: #059669;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
        }

        .content {
            background-color: white;
            padding: 20px;
        }

        .summary-box {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 16px;
        }

        .summary-label {
            font-weight: bold;
        }

        .summary-value {
            font-size: 20px;
            font-weight: bold;
        }

        .orders-section {
            margin: 20px 0;
        }

        .order-card {
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            background-color: #f9fafb;
        }

        .order-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }

        .order-id {
            font-weight: bold;
            color: #059669;
        }

        .order-amount {
            font-size: 18px;
            font-weight: bold;
            color: #059669;
        }

        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 14px;
        }

        .item-name {
            color: #374151;
        }

        .item-price {
            color: #6b7280;
        }

        .no-orders {
            text-align: center;
            padding: 30px;
            color: #9ca3af;
            background-color: #f3f4f6;
            border-radius: 5px;
        }

        .footer {
            background-color: #f3f4f6;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 5px 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        th,
        td {
            border: 1px solid #e5e7eb;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #374151;
        }

        tr:nth-child(even) {
            background-color: #f9fafb;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>📊 Daily Sales Report</h1>
            <p>{{ now()->format('l, F d, Y') }}</p>
        </div>

        <div class="content">
            <p>Hello Admin,</p>

            <p>Here's your daily sales summary for {{ now()->format('F d, Y') }}:</p>

            @if ($totalOrders > 0)
                <div class="summary-box">
                    <div class="summary-row">
                        <span class="summary-label">Total Orders:</span>
                        <span class="summary-value">{{ $totalOrders }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Total Revenue:</span>
                        <span class="summary-value">${{ number_format($totalSales, 2) }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Average Order Value:</span>
                        <span class="summary-value">${{ number_format($totalSales / $totalOrders, 2) }}</span>
                    </div>
                </div>

                <div class="orders-section">
                    <h2 style="color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Order Details
                    </h2>

                    @foreach ($orders as $order)
                        <div class="order-card">
                            <div class="order-header">
                                <div class="order-id">Order #{{ $order->id }}</div>
                                <div>
                                    <span
                                        style="color: #6b7280; margin-right: 10px;">{{ $order->created_at->format('Y-m-d H:i:s') }}</span>
                                    <span class="order-amount">${{ number_format($order->total_amount, 2) }}</span>
                                </div>
                            </div>

                            @if ($order->orderItems->count() > 0)
                                <table style="margin: 0;">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($order->orderItems as $item)
                                            <tr>
                                                <td>{{ $item->product->name }}</td>
                                                <td style="text-align: center;">{{ $item->quantity }}</td>
                                                <td>${{ number_format($item->price, 2) }}</td>
                                                <td>${{ number_format($item->quantity * $item->price, 2) }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            @endif
                        </div>
                    @endforeach
                </div>
            @else
                <div class="no-orders">
                    <p style="font-size: 16px; margin: 0;">No orders placed today</p>
                </div>
            @endif

            <div
                style="margin-top: 30px; padding: 15px; background-color: #f0fdf4; border-left: 4px solid #059669; border-radius: 3px;">
                <p style="margin: 0;">
                    <strong>📈 Insight:</strong>
                    @if ($totalOrders > 0)
                        You received <strong>{{ $totalOrders }}</strong> order(s) generating
                        <strong>${{ number_format($totalSales, 2) }}</strong> in revenue today.
                    @else
                        No orders were placed today. Keep promoting your products!
                    @endif
                </p>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated report from your E-Commerce System</p>
            <p>Generated: {{ now()->format('Y-m-d H:i:s') }}</p>
        </div>
    </div>
</body>

</html>
