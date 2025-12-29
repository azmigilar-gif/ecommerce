import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    ShoppingBag,
    DollarSign,
    ShoppingCart,
    Package,
    TrendingUp,
    AlertTriangle,
    Calendar,
} from "lucide-react";

export default function Dashboard({
    auth,
    userStats,
    recentOrders,
    lowStockProducts,
    todayOrders,
    todayRevenue,
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, {auth.user.name}! 
                        </h1>
                        <p className="text-indigo-100">
                            Here's what's happening with your account today.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Your Orders */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <ShoppingBag
                                        className="text-blue-600"
                                        size={24}
                                    />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">
                                {userStats.total_orders}
                            </div>
                            <div className="text-sm text-gray-600">
                                Your Orders
                            </div>
                        </div>

                        {/* Total Spent */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <DollarSign
                                        className="text-green-600"
                                        size={24}
                                    />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">
                                ${parseFloat(userStats.total_spent).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Spent
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <ShoppingCart
                                        className="text-purple-600"
                                        size={24}
                                    />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">
                                {userStats.cart_items}
                            </div>
                            <div className="text-sm text-gray-600">
                                Items in Cart
                            </div>
                        </div>

                        {/* Today's Sales */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <TrendingUp
                                        className="text-orange-600"
                                        size={24}
                                    />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">
                                {todayOrders}
                            </div>
                            <div className="text-sm text-gray-600">
                                Orders Today
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => router.visit("/products")}
                                className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                            >
                                <Package
                                    className="text-indigo-600"
                                    size={24}
                                />
                                <div className="text-left">
                                    <div className="font-semibold text-gray-800">
                                        Browse Products
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Discover new items
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => router.visit("/cart")}
                                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                            >
                                <ShoppingCart
                                    className="text-purple-600"
                                    size={24}
                                />
                                <div className="text-left">
                                    <div className="font-semibold text-gray-800">
                                        View Cart
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {userStats.cart_items} items waiting
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => router.visit("/profile")}
                                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
                            >
                                <Calendar
                                    className="text-green-600"
                                    size={24}
                                />
                                <div className="text-left">
                                    <div className="font-semibold text-gray-800">
                                        My Profile
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Update your info
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ShoppingBag size={20} />
                                Recent Orders
                            </h3>

                            {recentOrders.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingBag
                                        size={48}
                                        className="mx-auto mb-2 text-gray-300"
                                    />
                                    <p>No orders yet</p>
                                    <button
                                        onClick={() =>
                                            router.visit("/products")
                                        }
                                        className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
                                    >
                                        Start Shopping →
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border rounded-lg p-4 hover:border-indigo-300 transition"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-semibold text-gray-800">
                                                        Order #{order.id}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(
                                                            order.created_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold text-indigo-600">
                                                    $
                                                    {parseFloat(
                                                        order.total_amount
                                                    ).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {order.order_items.length}{" "}
                                                item(s)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Low Stock Alert */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <AlertTriangle
                                    size={20}
                                    className="text-orange-500"
                                />
                                Low Stock Products
                            </h3>

                            {lowStockProducts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Package
                                        size={48}
                                        className="mx-auto mb-2 text-gray-300"
                                    />
                                    <p>All products are well stocked!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {lowStockProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="border rounded-lg p-4 hover:border-orange-300 transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-grow">
                                                    <div className="font-semibold text-gray-800">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        $
                                                        {parseFloat(
                                                            product.price
                                                        ).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold">
                                                        Only{" "}
                                                        {product.stock_quantity}{" "}
                                                        left
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            router.visit(
                                                                "/products"
                                                            )
                                                        }
                                                        className="text-xs text-indigo-600 hover:text-indigo-700 mt-2"
                                                    >
                                                        Buy Now →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Today's Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Today's Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <ShoppingBag
                                        className="text-blue-600"
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {todayOrders}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Orders Today
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <DollarSign
                                        className="text-green-600"
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        ${parseFloat(todayRevenue).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Revenue Today
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 text-center">
                            <p>
                                📧 Daily sales reports are automatically sent to
                                admin every day at 23:59
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
