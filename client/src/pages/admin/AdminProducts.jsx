import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import { addAdminProduct, updateAdminProduct, deleteAdminProduct } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { Package, Plus, Trash2, Edit3, X, Save, Scale } from 'lucide-react';
import { formatINR, formatGram } from '../../utils/currencyFormatter';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Rings',
    subcategory: 'General',
    metalType: 'GOLD',
    purity: '22K',
    weight: 10,
    makingCharges: 800,
    wastagePercentage: 3.5,
    stoneCharges: 0,
    gstPercentage: 3.0,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'],
    stock: 10,
    sku: '',
    isFeatured: false,
    isBestSeller: false,
  });

  const fetchProductsList = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ limit: 100 });
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      category: 'Rings',
      subcategory: 'General',
      metalType: 'GOLD',
      purity: '22K',
      weight: 10,
      makingCharges: 800,
      wastagePercentage: 3.5,
      stoneCharges: 0,
      gstPercentage: 3.0,
      images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'],
      stock: 10,
      sku: `JW-${Date.now().toString().slice(-6)}`,
      isFeatured: false,
      isBestSeller: false,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory || 'General',
      metalType: product.metalType,
      purity: product.purity,
      weight: product.weight,
      makingCharges: product.makingCharges,
      wastagePercentage: product.wastagePercentage,
      stoneCharges: product.stoneCharges,
      gstPercentage: product.gstPercentage || 3.0,
      images: product.images,
      stock: product.stock,
      sku: product.sku,
      isFeatured: product.isFeatured || false,
      isBestSeller: product.isBestSeller || false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await updateAdminProduct(editingId, formData);
      } else {
        res = await addAdminProduct(formData);
      }

      if (res.success) {
        setToast({ message: res.message || 'Product saved successfully!', type: 'success' });
        setShowModal(false);
        fetchProductsList();
      } else {
        setToast({ message: res.message || 'Failed to save product', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error saving product.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this jewellery item?')) return;
    try {
      const res = await deleteAdminProduct(id);
      if (res.success) {
        setToast({ message: 'Product deleted.', type: 'success' });
        fetchProductsList();
      }
    } catch (err) {
      setToast({ message: 'Failed to delete product.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="bg-ivory border border-gold-300 p-6 rounded-3xl flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian flex items-center gap-2">
            <Package className="w-6 h-6 text-gold-600" /> Admin Product Inventory
          </h1>
          <p className="text-xs text-zinc-500">Manage jewellery specifications, weights, purities & stock quantities</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-obsidian text-gold-400 hover:bg-gold-500 hover:text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Product List Table */}
      {loading ? (
        <LoadingSpinner text="Fetching product inventory..." />
      ) : (
        <div className="bg-white border border-gold-300 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="bg-ivory text-zinc-500 uppercase font-bold text-[10px] border-b border-gold-200">
                <tr>
                  <th className="p-4">Jewellery Item</th>
                  <th className="p-4">SKU / Metal</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Live Computed Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gold-50/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gold-200"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-obsidian text-sm">{p.name}</h4>
                        <span className="text-[11px] text-zinc-500">{p.category}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold block">{p.sku}</span>
                      <span className="text-[10px] bg-gold-100 text-gold-800 px-2 py-0.5 rounded font-bold">
                        {p.metalType} ({p.purity})
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-obsidian">{formatGram(p.weight)}</td>
                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          p.stock <= 3 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} remaining
                      </span>
                    </td>
                    <td className="p-4 font-serif font-bold text-gold-700 text-sm">
                      {formatINR(p.dynamicPricing?.finalPrice || p.price)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-zinc-600 hover:text-gold-600 bg-ivory border border-gold-200 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-zinc-600 hover:text-rose-600 bg-ivory border border-gold-200 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gold-300 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-gold-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-obsidian">
                {editingId ? 'Edit Product Details' : 'Add New Jewellery Product'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold text-zinc-700 block mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-700 block mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                >
                  {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Chains', 'Pendants'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Metal Type *</label>
                <select
                  value={formData.metalType}
                  onChange={(e) => setFormData({ ...formData, metalType: e.target.value })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                >
                  <option value="GOLD">GOLD</option>
                  <option value="SILVER">SILVER</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Purity *</label>
                <select
                  value={formData.purity}
                  onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                >
                  <option value="24K">24K</option>
                  <option value="22K">22K</option>
                  <option value="18K">18K</option>
                  <option value="925">925 (Silver)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Weight (grams) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Making Charges (₹)</label>
                <input
                  type="number"
                  value={formData.makingCharges}
                  onChange={(e) => setFormData({ ...formData, makingCharges: Number(e.target.value) })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Wastage %</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.wastagePercentage}
                  onChange={(e) => setFormData({ ...formData, wastagePercentage: Number(e.target.value) })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Stone Charges (₹)</label>
                <input
                  type="number"
                  value={formData.stoneCharges}
                  onChange={(e) => setFormData({ ...formData, stoneCharges: Number(e.target.value) })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Stock Units *</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-700 block mb-1">Image URL</label>
              <input
                type="url"
                value={formData.images[0] || ''}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-1.5 font-semibold text-zinc-700">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="accent-gold-500"
                />
                Featured Product
              </label>

              <label className="flex items-center gap-1.5 font-semibold text-zinc-700">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="accent-gold-500"
                />
                Best Seller
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gold-200">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-ivory border border-gold-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-obsidian text-white font-bold rounded-lg hover:bg-gold-500 transition-colors flex items-center gap-1"
              >
                <Save className="w-4 h-4" /> Save Product
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
