import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { CheckCircle, ShoppingBag, Home, FileText } from "lucide-react";

export default function OrderSuccess({ auth, order }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Order Confirmation
                </h2>
            }
        >
            <Head title="Order Confirmed" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {/* Success Message */}
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <CheckCircle
                                size={80}
                                className="text-green-500 animate-bounce"
                            />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-gray-600 text-lg mb-8">
                            Thank you for your purchase. We're processing your
                            order now.
                        </p>

                        {/* Order Details */}
                        <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
                            <h2 className="font-bold text-lg text-gray-800 mb-4">
                                Order Details
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-600">
                                        Order ID
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        #{order.id}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-600">
                                        Order Date
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {new Date(
                                            order.created_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-600">
                                        Status
                                    </span>
                                    <span className="font-semibold text-green-600 capitalize">
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Total Amount
                                    </span>
                                    <span className="font-bold text-lg text-indigo-600">
                                        $
                                        {parseFloat(order.total_amount).toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
                            <h2 className="font-bold text-lg text-gray-800 mb-4">
                                Items Ordered
                            </h2>

                            <div className="space-y-3">
                                {order.order_items &&
                                    order.order_items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center border-b pb-3 last:border-b-0"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-800">
                                                $
                                                {(
                                                    item.quantity *
                                                    parseFloat(item.price)
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                            <h3 className="font-bold text-blue-900 mb-3">
                                What happens next?
                            </h3>
                            <ul className="text-blue-800 space-y-2 text-sm">
                                <li>
                                    ✓ A confirmation email will be sent to your
                                    email address
                                </li>
                                <li>
                                    ✓ We're preparing your items for shipment
                                </li>
                                <li>
                                    ✓ You'll receive a tracking number via email
                                    once it ships
                                </li>
                                <li>
                                    ✓ Estimated delivery time: 3-5 business days
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                onClick={() => router.visit("/products")}
                                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                            >
                                <ShoppingBag size={20} />
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => router.visit("/dashboard")}
                                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                <Home size={20} />
                                Back to Home
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <p className="text-sm text-gray-500">
                                Need help? Contact us at support@ecommerce.local
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
