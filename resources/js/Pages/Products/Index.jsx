import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import NotificationModal from "@/Components/NotificationModal";

export default function ProductsIndex({ auth, products }) {
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState({});
    const [cartCount, setCartCount] = useState(0);
    const [notification, setNotification] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalQuantity, setModalQuantity] = useState(1);
    // Local copy of products so we can update stock in UI without a full page reload
    const [productList, setProductList] = useState(products || []);

    React.useEffect(() => {
        fetchCartCount();
    }, []);

    React.useEffect(() => {
        setProductList(products || []);
    }, [products]);

    const fetchCartCount = async () => {
        try {
            const response = await fetch("/cart/count");
            const data = await response.json();
            setCartCount(data.count);
        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    };

    const handleQuantityChange = (productId, change) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change),
        }));
    };

    const addToCart = async (product) => {
        setLoading((prev) => ({ ...prev, [product.id]: true }));

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            if (!csrfToken) {
                alert("CSRF token not found. Please refresh the page.");
                setLoading((prev) => ({ ...prev, [product.id]: false }));
                return;
            }

            const response = await fetch("/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantities[product.id] || 1,
                }),
            });

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Response is not JSON:", response);
                const text = await response.text();
                console.error("Response body:", text);
                alert("Server error: Invalid response format");
                setLoading((prev) => ({ ...prev, [product.id]: false }));
                return;
            }

            const data = await response.json();

            if (response.ok) {
                const qty = quantities[product.id] || 1;
                setNotification({
                    message: `${product.name} added to cart!`,
                    type: "success",
                });
                setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
                // Update local product stock so UI reflects deduction immediately
                setProductList((prev) =>
                    prev.map((p) =>
                        p.id === product.id
                            ? { ...p, stock_quantity: Math.max(0, p.stock_quantity - qty) }
                            : p
                    )
                );
                // If the selected product modal is open, update it too
                if (selectedProduct && selectedProduct.id === product.id) {
                    setSelectedProduct((prev) => ({
                        ...prev,
                        stock_quantity: Math.max(0, prev.stock_quantity - qty),
                    }));
                }
                fetchCartCount();
            } else {
                setNotification({
                    message: data.message || "Failed to add to cart",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            setNotification({
                message: "Failed to add to cart: " + error.message,
                type: "error",
            });
        } finally {
            setLoading((prev) => ({ ...prev, [product.id]: false }));
        }
    };

    const addToCartFromModal = async () => {
        if (!selectedProduct) return;

        setLoading((prev) => ({ ...prev, [selectedProduct.id]: true }));

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            if (!csrfToken) {
                alert("CSRF token not found. Please refresh the page.");
                setLoading((prev) => ({
                    ...prev,
                    [selectedProduct.id]: false,
                }));
                return;
            }

            const response = await fetch("/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    product_id: selectedProduct.id,
                    quantity: modalQuantity,
                }),
            });

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Response is not JSON:", response);
                const text = await response.text();
                console.error("Response body:", text);
                alert("Server error: Invalid response format");
                setLoading((prev) => ({
                    ...prev,
                    [selectedProduct.id]: false,
                }));
                return;
            }

            const data = await response.json();

            if (response.ok) {
                const qty = modalQuantity;
                setNotification({
                    message: `${selectedProduct.name} added to cart!`,
                    type: "success",
                });
                // Update local product list and selected product stock
                setProductList((prev) =>
                    prev.map((p) =>
                        p.id === selectedProduct.id
                            ? { ...p, stock_quantity: Math.max(0, p.stock_quantity - qty) }
                            : p
                    )
                );
                setSelectedProduct((prev) => ({
                    ...prev,
                    stock_quantity: Math.max(0, prev.stock_quantity - qty),
                }));
                setSelectedProduct(null);
                setModalQuantity(1);
                fetchCartCount();
            } else {
                setNotification({
                    message: data.message || "Failed to add to cart",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            setNotification({
                message: "Failed to add to cart: " + error.message,
                type: "error",
            });
        } finally {
            setLoading((prev) => ({
                ...prev,
                [selectedProduct.id]: false,
            }));
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0)
            return {
                text: "Out of Stock",
                color: "text-red-600",
                bgColor: "bg-red-100",
            };
        if (stock <= 10)
            return {
                text: "Low Stock",
                color: "text-orange-600",
                bgColor: "bg-orange-100",
            };
        return {
            text: "In Stock",
            color: "text-green-600",
            bgColor: "bg-green-100",
        };
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Products
                    </h2>
                    <button
                        onClick={() => router.visit("/cart")}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <ShoppingCart size={20} />
                        <span>Cart ({cartCount})</span>
                    </button>
                </div>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productList.map((product) => {
                            const stockStatus = getStockStatus(
                                product.stock_quantity
                            );
                            const quantity = quantities[product.id] || 1;
                            const isLoading = loading[product.id];

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setModalQuantity(1);
                                    }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition flex flex-col h-full cursor-pointer"
                                >
                                    {/* Product Image Placeholder */}
                                    <div className="flex-shrink-0">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                                <ShoppingCart
                                                    size={64}
                                                    className="text-indigo-300"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow gap-2">
                                        {/* Product Name */}
                                        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 h-14">
                                            {product.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 line-clamp-2 h-10">
                                            {product.description}
                                        </p>

                                        {/* Price */}
                                        <div className="text-2xl font-bold text-indigo-600">
                                            $
                                            {parseFloat(product.price).toFixed(
                                                2
                                            )}
                                        </div>

                                        {/* Stock Status */}
                                        <div className="flex items-center justify-between h-7">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color} font-semibold`}
                                            >
                                                {stockStatus.text}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {product.stock_quantity}{" "}
                                                available
                                            </span>
                                        </div>

                                        {/* Spacer - pushes button to bottom */}
                                        <div className="flex-grow"></div>

                                        {/* Quantity Selector */}
                                        {product.stock_quantity > 0 && (
                                            <div className="flex items-center gap-3 justify-center h-9">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(
                                                            product.id,
                                                            -1
                                                        );
                                                    }}
                                                    disabled={quantity <= 1}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-semibold text-lg w-8 text-center">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(
                                                            product.id,
                                                            1
                                                        );
                                                    }}
                                                    disabled={
                                                        quantity >=
                                                        product.stock_quantity
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                            disabled={
                                                product.stock_quantity === 0 ||
                                                isLoading
                                            }
                                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2 h-10"
                                        >
                                            {isLoading ? (
                                                <span>Adding...</span>
                                            ) : (
                                                <>
                                                    <ShoppingCart size={18} />
                                                    <span>Add to Cart</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-12">
                            <ShoppingCart
                                size={64}
                                className="mx-auto text-gray-300 mb-4"
                            />
                            <p className="text-gray-500 text-lg">
                                No products available
                            </p>
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

            {/* Product Details Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {selectedProduct.name}
                            </h2>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="text-gray-500 hover:text-gray-700 transition text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Product Image */}
                            <div className="h-40 rounded-lg overflow-hidden">
                                {selectedProduct.image ? (
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                        <ShoppingCart size={64} className="text-indigo-300" />
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <p className="text-gray-600 text-sm font-semibold mb-1">
                                    Price
                                </p>
                                <p className="text-3xl font-bold text-indigo-600">
                                    ${parseFloat(selectedProduct.price).toFixed(2)}
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-gray-600 text-sm font-semibold mb-2">
                                    Description
                                </p>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {selectedProduct.description}
                                </p>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-semibold">
                                    Available Stock
                                </span>
                                <span className="text-xl font-bold text-indigo-600">
                                    {selectedProduct.stock_quantity}
                                </span>
                            </div>

                            {/* Quantity Selector */}
                            {selectedProduct.stock_quantity > 0 && (
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold mb-3">
                                        Quantity
                                    </p>
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() =>
                                                setModalQuantity(
                                                    Math.max(1, modalQuantity - 1)
                                                )
                                            }
                                            disabled={modalQuantity <= 1}
                                            className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="font-bold text-2xl w-12 text-center">
                                            {modalQuantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setModalQuantity(
                                                    Math.min(
                                                        selectedProduct.stock_quantity,
                                                        modalQuantity + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                modalQuantity >=
                                                selectedProduct.stock_quantity
                                            }
                                            className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 border-t bg-gray-50">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addToCartFromModal}
                                disabled={
                                    selectedProduct.stock_quantity === 0 ||
                                    loading[selectedProduct.id]
                                }
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
                            >
                                {loading[selectedProduct.id] ? (
                                    <span>Adding...</span>
                                ) : (
                                    <>
                                        <ShoppingCart size={18} />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
