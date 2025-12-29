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
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }

        .header {
            background-color: #dc2626;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            background-color: white;
            padding: 20px;
        }

        .alert-box {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
        }

        .product-details {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
        }

        .label {
            font-weight: bold;
            color: #4b5563;
        }

        .value {
            color: #333;
        }

        .footer {
            background-color: #f3f4f6;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 5px 5px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Low Stock Alert</h1>
        </div>

        <div class="content">
            <p>Hello Admin,</p>

            <p>We wanted to notify you that one of your products is running low on stock.</p>

            <div class="alert-box">
                <strong>Immediate Action Required:</strong><br>
                Please restock the following product soon to avoid stockouts.
            </div>

            <h2 style="color: #dc2626;">Product Details</h2>

            <div class="product-details">
                <div class="detail-row">
                    <span class="label">Product Name:</span>
                    <span class="value"><strong>{{ $product->name }}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="label">Product ID:</span>
                    <span class="value">#{{ $product->id }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Current Stock:</span>
                    <span class="value" style="color: #dc2626;"><strong>{{ $product->stock_quantity }}
                            units</strong></span>
                </div>
                <div class="detail-row">
                    <span class="label">Product Price:</span>
                    <span class="value">${{ number_format($product->price, 2) }}</span>
                </div>
                @if ($product->description)
                    <div class="detail-row">
                        <span class="label">Description:</span>
                    </div>
                    <div
                        style="margin-left: 0; margin-top: 8px; padding: 10px; background-color: #fafafa; border-radius: 3px;">
                        {{ $product->description }}
                    </div>
                @endif
            </div>

            <p style="margin-top: 20px;">Please log in to your admin dashboard to manage stock levels and place a
                restock order.</p>

            <p style="color: #666; font-size: 14px;">
                <strong>Recommendation:</strong> Stock threshold is set at 10 units or below. Consider adjusting restock
                levels based on your sales velocity.
            </p>
        </div>

        <div class="footer">
            <p>This is an automated alert from your E-Commerce System</p>
            <p>Sent: {{ now()->format('Y-m-d H:i:s') }}</p>
        </div>
    </div>
</body>

</html>
