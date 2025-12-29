import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Mail, TrendingUp, ShoppingCart, DollarSign, Send } from "lucide-react";

export default function AdminDashboard({
    auth,
    todayOrders,
    todaySales,
    totalOrders,
    totalRevenue,
}) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendDailyReport = async () => {
        setLoading(true);
        setMessage("");

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            const response = await fetch("/admin/send-daily-report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "✅ Daily sales report sent! Check storage/logs/daily-reports.log for the email.",
                });
            } else {
                setMessage({
                    type: "error",
                    text: `❌ Error: ${data.message}`,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage({
                type: "error",
                text: "❌ Failed to send report",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Status Message */}
                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-lg ${
                                message.type === "success"
                                    ? "bg-green-100 text-green-800 border border-green-300"
                                    : "bg-red-100 text-red-800 border border-red-300"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Today's Orders */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Today's Orders
                                    </p>
                                    <p className="text-3xl font-bold text-indigo-600">
                                        {todayOrders || 0}
                                    </p>
                                </div>
                                <ShoppingCart
                                    size={40}
                                    className="text-indigo-300"
                                />
                            </div>
                        </div>

                        {/* Today's Sales */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Today's Revenue
                                    </p>
                                    <p className="text-3xl font-bold text-green-600">
                                        ${Number(todaySales || 0).toFixed(2)}
                                    </p>
                                </div>
                                <DollarSign
                                    size={40}
                                    className="text-green-300"
                                />
                            </div>
                        </div>

                        {/* Total Orders */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Total Orders
                                    </p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {totalOrders || 0}
                                    </p>
                                </div>
                                <TrendingUp
                                    size={40}
                                    className="text-blue-300"
                                />
                            </div>
                        </div>

                        {/* Total Revenue */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Total Revenue
                                    </p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        ${Number(totalRevenue || 0).toFixed(2)}
                                    </p>
                                </div>
                                <DollarSign
                                    size={40}
                                    className="text-purple-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Quick Actions
                        </h3>

                        <div className="space-y-6">
                            {/* Send Daily Report Button */}
                            <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
                                <div className="flex items-start gap-4">
                                    <Mail
                                        size={32}
                                        className="text-indigo-600 flex-shrink-0 mt-1"
                                    />
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-lg text-gray-800 mb-2">
                                            Send Daily Sales Report
                                        </h4>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Manually trigger and send today's
                                            sales report to admin email. The
                                            report will be logged to{" "}
                                            <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                                                storage/logs/laravel.log
                                            </code>
                                        </p>
                                        <button
                                            onClick={handleSendDailyReport}
                                            disabled={loading}
                                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
                                        >
                                            <Send size={18} />
                                            {loading
                                                ? "Sending..."
                                                : "Send Report Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Information */}
                            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                                <h4 className="font-bold text-gray-800 mb-3">
                                    📋 How It Works
                                </h4>
                                <ul className="text-gray-700 text-sm space-y-2">
                                    <li>
                                        ✓ Reports are sent to{" "}
                                        <code className="bg-blue-100 px-2 py-1 rounded">
                                            admin@ecommerce.test
                                        </code>
                                    </li>
                                    <li>
                                        ✓ Emails are logged to{" "}
                                        <code className="bg-blue-100 px-2 py-1 rounded">
                                            storage/logs/laravel.log
                                        </code>
                                    </li>
                                    <li>
                                        ✓ Daily report normally runs at 23:59
                                        (11:59 PM) via scheduler
                                    </li>
                                    <li>
                                        ✓ Use this button for testing during
                                        video creation
                                    </li>
                                    <li>
                                        ✓ Queue worker must be running:{" "}
                                        <code className="bg-blue-100 px-2 py-1 rounded">
                                            php artisan queue:work database
                                        </code>
                                    </li>
                                </ul>
                            </div>

                            {/* Monitoring */}
                            <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                                <h4 className="font-bold text-gray-800 mb-3">
                                    🔍 Monitor Emails
                                </h4>
                                <p className="text-gray-700 text-sm mb-3">
                                    Watch logs in real-time:
                                </p>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
                                    {`tail -f storage/logs/laravel.log | grep -i "mailing\\|mail"`}
                                </pre>
                            </div>

                            {/* Manage Products */}
                            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl flex-shrink-0">
                                        📦
                                    </span>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-lg text-gray-800 mb-2">
                                            Manage Products
                                        </h4>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Add, edit, or delete products from
                                            your catalog. Track stock levels and
                                            manage inventory.
                                        </p>
                                        <a
                                            href="/admin/products"
                                            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                                        >
                                            Manage Products
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
