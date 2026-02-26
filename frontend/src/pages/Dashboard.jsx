import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            let allProducts = res.data.data;

            // Filter products: 'user' can ONLY see their own products.
            if (user?.role === 'user') {
                allProducts = allProducts.filter(p => p.user?._id === user._id);
            }

            setProducts(allProducts);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/products/${currentProductId}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setFormData({ name: '', description: '', price: '' });
            setIsEditing(false);
            setCurrentProductId(null);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save product');
        }
    };

    const editProduct = (product) => {
        setIsEditing(true);
        setCurrentProductId(product._id);
        setFormData({ name: product.name, description: product.description, price: product.price });
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to delete product');
            }
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setCurrentProductId(null);
        setFormData({ name: '', description: '', price: '' });
        setError('');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span>{' '}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 ml-2">
                            {user?.role}
                        </span>
                    </p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Column */}
                <div className="md:col-span-1 border border-gray-100 bg-white shadow rounded-xl p-6 self-start">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                placeholder="Product Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                                placeholder="Brief description..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex space-x-3 pt-4 border-t">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
                            >
                                {isEditing ? 'Update' : 'Create'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex-1 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Column */}
                <div className="md:col-span-2 bg-white shadow rounded-xl p-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Product Catalog</h2>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="mt-4 text-gray-500 font-medium">No products found. Create one to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => (
                                <div key={product._id} className="group border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all bg-white relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                                                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{product.description}</p>
                                            <div className="mt-4 flex items-center text-xs text-gray-500 bg-gray-50 inline-block px-3 py-1.5 rounded-md border border-gray-100">
                                                <svg className="h-4 w-4 mr-1.5 text-gray-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Added by <span className="font-medium text-gray-700 ml-1">{product.user?.name || 'Unknown'}</span>
                                            </div>
                                        </div>
                                        {/* Admin can edit/delete ALL. User/Mod can only edit/delete THEIR OWN */}
                                        {(user?.role === 'admin' || product.user?._id === user?._id) && (
                                            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 mt-4 sm:mt-0">
                                                <button
                                                    onClick={() => editProduct(product)}
                                                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md hover:bg-indigo-600 hover:text-white transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product._id)}
                                                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
