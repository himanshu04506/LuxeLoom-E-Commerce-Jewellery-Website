import React, { useState, useEffect } from 'react';
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from '../../services/orderService';
import { getCurrentUserLocation } from '../../utils/locationHelper';
import { MapPin, Plus, Trash2, CheckCircle2, Navigation, Compass, AlertCircle } from 'lucide-react';
import Toast from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [geoLoading, setGeoLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    house: '',
    street: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    latitude: 28.6139,
    longitude: 77.2090,
    isDefault: false,
  });

  const fetchAddressList = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error('Error fetching addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressList();
  }, []);

  const handleUseCurrentLocation = async () => {
    try {
      setGeoLoading(true);
      const loc = await getCurrentUserLocation();
      setFormData((prev) => ({
        ...prev,
        latitude: loc.latitude,
        longitude: loc.longitude,
      }));
      setToast({
        message: loc.isFallback
          ? 'Location set to Central Delhi Hub.'
          : 'Captured GPS coordinates successfully!',
        type: 'success',
      });
    } catch (err) {
      setToast({ message: 'Could not access GPS location.', type: 'error' });
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await addAddress(formData);
      if (res.success) {
        setToast({ message: 'Address saved successfully!', type: 'success' });
        setShowForm(false);
        setFormData({
          fullName: '',
          phone: '',
          house: '',
          street: '',
          locality: '',
          city: '',
          state: '',
          pincode: '',
          landmark: '',
          latitude: 28.6139,
          longitude: 77.2090,
          isDefault: false,
        });
        fetchAddressList();
      } else {
        setToast({ message: res.message, type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Failed to save address.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAddress(id);
      if (res.success) {
        setToast({ message: 'Address deleted.', type: 'success' });
        fetchAddressList();
      }
    } catch (err) {
      setToast({ message: 'Failed to delete address.', type: 'error' });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await setDefaultAddress(id);
      if (res.success) {
        setToast({ message: 'Default address updated.', type: 'success' });
        fetchAddressList();
      }
    } catch (err) {
      setToast({ message: 'Failed to set default address.', type: 'error' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="bg-ivory border border-gold-300 p-6 rounded-3xl flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gold-600" /> Saved Delivery Addresses
          </h1>
          <p className="text-xs text-zinc-500">Manage shipping addresses for fast, insured checkout</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-obsidian text-gold-400 hover:bg-gold-500 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {/* Add New Address Form Modal / Drawer */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gold-300 shadow-xl space-y-4 text-xs animate-in zoom-in-95">
          <div className="flex justify-between items-center border-b border-gold-200 pb-3">
            <h3 className="font-serif font-bold text-base text-obsidian">Add Shipping Address</h3>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="bg-gold-50 border border-gold-300 text-gold-900 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gold-100 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-gold-600 animate-spin" style={{ animationDuration: '8s' }} />
              {geoLoading ? 'Detecting GPS...' : 'Use My Current Location'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Contact Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-zinc-700 block mb-1">House / Flat / Building No. *</label>
              <input
                type="text"
                required
                value={formData.house}
                onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Street / Colony *</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-zinc-700 block mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-zinc-700 block mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Pincode *</label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="accent-gold-500 w-4 h-4"
            />
            <label htmlFor="isDefault" className="font-medium text-zinc-700">Set as my default shipping address</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-ivory border border-gold-300 rounded-lg font-semibold text-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-obsidian text-white font-bold rounded-lg hover:bg-gold-500 transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {/* Address List Grid */}
      {loading ? (
        <LoadingSpinner text="Loading saved addresses..." />
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-6 rounded-2xl border transition-all ${
                addr.isDefault
                  ? 'bg-white border-gold-500 shadow-md ring-2 ring-gold-200'
                  : 'bg-white border-gold-200 shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-serif font-bold text-base text-obsidian">{addr.fullName}</h4>
                  <p className="text-xs text-zinc-500 font-medium">{addr.phone}</p>
                </div>
                {addr.isDefault && (
                  <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> DEFAULT
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-700 leading-relaxed">
                {addr.house}, {addr.street}, {addr.locality ? `${addr.locality}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
              </p>

              <div className="mt-4 pt-3 border-t border-gold-100 flex justify-between items-center text-xs">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="text-gold-700 font-bold hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-rose-600 font-semibold hover:underline flex items-center gap-1 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gold-200 p-12 rounded-2xl text-center space-y-3">
          <MapPin className="w-12 h-12 text-gold-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-obsidian">No Saved Addresses Found</h3>
          <p className="text-xs text-zinc-500">Add an address to enable one-click insured checkout.</p>
        </div>
      )}

    </div>
  );
};

export default SavedAddresses;
