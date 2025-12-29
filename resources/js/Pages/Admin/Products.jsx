import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Edit2, Trash2, Plus } from "lucide-react";

export default function AdminProducts({ auth, products: initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        image: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleAddClick = () => {
        setEditingId(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock_quantity: "",
            image: "",
        });
        setShowForm(true);
    };

    const handleEditClick = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock_quantity: product.stock_quantity,
            image: product.image || "",
        });
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            const url = editingId
                ? `/admin/products/${editingId}`
                : "/admin/products";
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: editingId
                        ? "✅ Product updated successfully!"
                        : "✅ Product created successfully!",
                });

                // Refresh products list
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setMessage({
                    type: "error",
                    text: `❌ Error: ${data.message}`,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage({ type: "error", text: "❌ Failed to save product" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setLoading(true);

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            const response = await fetch(`/admin/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "✅ Product deleted successfully!",
                });

                // Refresh products list
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setMessage({
                    type: "error",
                    text: `❌ Error: ${data.message}`,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage({ type: "error", text: "❌ Failed to delete product" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Products
                </h2>
            }
        >
            <Head title="Manage Products" />

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

                    {/* Add Product Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            <Plus size={20} />
                            Add New Product
                        </button>
                    </div>

                    {/* Add/Edit Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    {editingId
                                        ? "Edit Product"
                                        : "Add New Product"}
                                </h3>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Stock Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="stock_quantity"
                                            value={formData.stock_quantity}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Image URL
                                        </label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
                                        >
                                            {loading
                                                ? "Saving..."
                                                : "Save Product"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {product.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="font-medium">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                    {product.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                $
                                                {Number(product.price).toFixed(
                                                    2
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        product.stock_quantity <=
                                                        10
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {product.stock_quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(product)
                                                    }
                                                    className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition text-xs"
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                    disabled={loading}
                                                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 transition text-xs"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {products.length === 0 && (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No products found. Click "Add New Product" to
                                create one.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
