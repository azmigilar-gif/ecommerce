import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import NotificationModal from "@/Components/NotificationModal";

export default function CartIndex({ auth, cartItems, total }) {
    const [items, setItems] = useState(cartItems);
    const [cartTotal, setCartTotal] = useState(total);
    const [loading, setLoading] = useState({});
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const updateQuantity = async (cartItem, newQuantity) => {
        if (newQuantity < 1 || newQuantity > cartItem.product.stock_quantity)
            return;

        setLoading((prev) => ({ ...prev, [cartItem.id]: true }));

        try {
            const response = await fetch(`/cart/${cartItem.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update local state
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === cartItem.id
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );

                // Recalculate total
                const newTotal = items.reduce((sum, item) => {
                    const qty =
                        item.id === cartItem.id ? newQuantity : item.quantity;
                    return sum + qty * parseFloat(item.product.price);
                }, 0);
                setCartTotal(newTotal);
            } else {
                setNotification({
                    message: data.message || "Failed to update cart",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Error updating cart:", error);
            setNotification({
                message: "Failed to update cart",
                type: "error",
            });
        } finally {
            setLoading((prev) => ({ ...prev, [cartItem.id]: false }));
        }
    };

    const removeItem = async (cartItem) => {
        if (!confirm(`Remove ${cartItem.product.name} from cart?`)) return;

        setLoading((prev) => ({ ...prev, [cartItem.id]: true }));

        try {
            const response = await fetch(`/cart/${cartItem.id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            });

            if (response.ok) {
                // Remove from local state
                setItems((prevItems) =>
                    prevItems.filter((item) => item.id !== cartItem.id)
                );

                // Recalculate total
                const newTotal = items
                    .filter((item) => item.id !== cartItem.id)
                    .reduce(
                        (sum, item) =>
                            sum +
                            item.quantity * parseFloat(item.product.price),
                        0
                    );
                setCartTotal(newTotal);
                setNotification({
                    message: `${cartItem.product.name} removed from cart`,
                    type: "success",
                });
            } else {
                setNotification({
                    message: "Failed to remove item",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Error removing item:", error);
            setNotification({
                message: "Failed to remove item",
                type: "error",
            });
        } finally {
            setLoading((prev) => ({ ...prev, [cartItem.id]: false }));
        }
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            if (!csrfToken) {
                setNotification({
                    message: "CSRF token not found. Please refresh the page.",
                    type: "error",
                });
                setCheckoutLoading(false);
                return;
            }

            const response = await fetch("/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to success page
                router.visit(data.redirect);
            } else {
                setNotification({
                    message: data.message || "Failed to place order",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            setNotification({
                message: "Failed to place order",
                type: "error",
            });
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Shopping Cart
                    </h2>
                    <button
                        onClick={() => router.visit("/products")}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
                    >
                        <ArrowLeft size={20} />
                        <span>Continue Shopping</span>
                    </button>
                </div>
            }
        >
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {items.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <ShoppingBag
                                size={64}
                                className="mx-auto text-gray-300 mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Add some products to get started!
                            </p>
                            <button
                                onClick={() => router.visit("/products")}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg shadow-md p-6"
                                    >
                                        <div className="flex gap-4">
                                            {/* Product Image Placeholder */}
                                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <ShoppingBag
                                                    size={32}
                                                    className="text-indigo-300"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {item.product.description}
                                                </p>
                                                <div className="text-xl font-bold text-indigo-600">
                                                    $
                                                    {parseFloat(
                                                        item.product.price
                                                    ).toFixed(2)}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {
                                                        item.product
                                                            .stock_quantity
                                                    }{" "}
                                                    available
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col items-end justify-between">
                                                <button
                                                    onClick={() =>
                                                        removeItem(item)
                                                    }
                                                    disabled={loading[item.id]}
                                                    className="text-red-600 hover:text-red-700 transition disabled:opacity-50"
                                                >
                                                    <Trash2 size={20} />
                                                </button>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item,
                                                                item.quantity -
                                                                    1
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity <=
                                                                1 ||
                                                            loading[item.id]
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="font-semibold text-lg w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item,
                                                                item.quantity +
                                                                    1
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity >=
                                                                item.product
                                                                    .stock_quantity ||
                                                            loading[item.id]
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="text-lg font-bold text-gray-800">
                                                    $
                                                    {(
                                                        item.quantity *
                                                        parseFloat(
                                                            item.product.price
                                                        )
                                                    ).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                                    <h3 className="font-bold text-xl text-gray-800 mb-4">
                                        Order Summary
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>
                                                Subtotal (
                                                {items.reduce(
                                                    (sum, item) =>
                                                        sum + item.quantity,
                                                    0
                                                )}{" "}
                                                items)
                                            </span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                                            <span>Total</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
                                    >
                                        {checkoutLoading
                                            ? "Processing..."
                                            : "Proceed to Checkout"}
                                    </button>

                                    <div className="mt-4 text-sm text-gray-500 text-center">
                                        <p>
                                            Secure checkout powered by Laravel
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Modal */}
            {notification && (
                <NotificationModal
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}
