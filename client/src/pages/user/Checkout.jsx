import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getAddresses, createOrder } from '../../services/orderService';
import { verifyPayment } from '../../services/paymentService';
import { ShieldCheck, MapPin, CreditCard, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatINR, formatGram } from '../../utils/currencyFormatter';
import Toast from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoading(true);
        const data = await getAddresses();
        if (data.success && data.addresses.length > 0) {
          setAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a) => a.isDefault) || data.addresses[0];
          setSelectedAddressId(defaultAddr._id);
        }
      } catch (err) {
        console.error('Error fetching addresses', err);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleProceedPayment = async () => {
    if (!selectedAddressId) {
      setToast({ message: 'Please select a delivery address.', type: 'error' });
      return;
    }

    try {
      setProcessingPayment(true);

      // Step 1: Create backend Order & Razorpay payment order ID
      const orderRes = await createOrder({ addressId: selectedAddressId });

      if (!orderRes.success) {
        setToast({ message: orderRes.message || 'Order creation failed.', type: 'error' });
        setProcessingPayment(false);
        return;
      }

      const { order, razorpayOrder, razorpayKeyId } = orderRes;

      // Step 2: Open Razorpay Modal or Demo Simulator
      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'LuxeLoom Fine Jewellery',
        description: `Insured Order #${order.orderId}`,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // Step 3: Verify Razorpay signature on server
          try {
            const verifyRes = await verifyPayment({
              orderId: order.orderId,
              razorpayOrderId: response.razorpay_order_id || razorpayOrder.id,
              razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'mock_signature',
            });

            if (verifyRes.success) {
              await fetchCart();
              navigate(`/order-confirmation/${order.orderId}`);
            } else {
              setToast({ message: verifyRes.message || 'Payment verification failed.', type: 'error' });
            }
          } catch (verifyErr) {
            setToast({ message: 'Payment verification failed on server.', type: 'error' });
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: order.shippingAddress.fullName,
          contact: order.shippingAddress.phone,
        },
        theme: {
          color: '#C5A059',
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            setToast({ message: 'Payment cancelled. You can retry payment anytime.', type: 'error' });
          },
        },
      };

      // Check if Razorpay JS script exists, else fallback to instant demo verification
      if (window.Razorpay && !razorpayOrder.isMock) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Test Mode Mock Fallback Payment Execution
        setTimeout(async () => {
          const verifyRes = await verifyPayment({
            orderId: order.orderId,
            razorpayOrderId: razorpayOrder.id,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: 'mock_signature',
          });

          if (verifyRes.success) {
            await fetchCart();
            navigate(`/order-confirmation/${order.orderId}`);
          } else {
            setToast({ message: 'Payment failed.', type: 'error' });
          }
          setProcessingPayment(false);
        }, 1200);
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Checkout error.', type: 'error' });
      setProcessingPayment(false);
    }
  };

  if (loading) return <LoadingSpinner text="Recalculating live checkout pricing..." />;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-obsidian">Your cart is empty</h2>
        <button onClick={() => navigate('/catalog')} className="bg-gold-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          Browse Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />

      <div className="border-b border-gold-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-obsidian flex items-center gap-2">
          <Lock className="w-7 h-7 text-gold-600" /> Secure Checkout
        </h1>
        <p className="text-xs text-zinc-500">
          Verify shipping location, review live itemized price breakdown & proceed to Razorpay payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Delivery Address Selector */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gold-300 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gold-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-obsidian flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-600" /> 1. Select Insured Delivery Address
              </h3>
              <button
                onClick={() => navigate('/addresses')}
                className="text-xs font-bold text-gold-700 hover:underline"
              >
                + Add / Manage Addresses
              </button>
            </div>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressId === addr._id
                        ? 'bg-gold-50/50 border-gold-500 ring-2 ring-gold-300 shadow-md'
                        : 'bg-white border-gold-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif font-bold text-sm text-obsidian">{addr.fullName}</h4>
                      {selectedAddressId === addr._id && (
                        <CheckCircle2 className="w-4 h-4 text-gold-600" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-600">{addr.phone}</p>
                    <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                      {addr.house}, {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-zinc-500 space-y-3">
                <p>No saved addresses found.</p>
                <button
                  onClick={() => navigate('/addresses')}
                  className="bg-gold-500 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Add Delivery Address
                </button>
              </div>
            )}
          </div>

          {/* Items Review List */}
          <div className="bg-white border border-gold-300 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-obsidian border-b border-gold-100 pb-3">
              2. Order Items Review ({cart.totalItemsCount} items)
            </h3>

            <div className="space-y-3 divide-y divide-zinc-100">
              {cart.items.map((item) => (
                <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gold-200 bg-ivory"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-obsidian">{item.product.name}</h4>
                      <p className="text-zinc-500 text-[11px]">
                        Qty: {item.quantity} | {item.product.metalType} ({item.product.purity}) | {formatGram(item.product.weight)}
                      </p>
                    </div>
                  </div>

                  <span className="font-serif font-bold text-gold-700 text-sm">
                    {formatINR(item.itemTotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Final Order Summary & Razorpay Action */}
        <div className="bg-white border border-gold-300 p-6 rounded-2xl shadow-xl space-y-6">
          <h3 className="font-serif font-bold text-xl text-obsidian border-b border-gold-200 pb-3">
            Payment Breakdown
          </h3>

          <div className="space-y-2.5 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Base Metal Charges:</span>
              <span className="font-semibold text-obsidian">{formatINR(cart.metalCharges)}</span>
            </div>
            <div className="flex justify-between">
              <span>Making Charges:</span>
              <span className="font-semibold text-obsidian">{formatINR(cart.makingCharges)}</span>
            </div>
            <div className="flex justify-between">
              <span>Wastage Charges:</span>
              <span className="font-semibold text-obsidian">{formatINR(cart.wastageCharges)}</span>
            </div>
            {cart.stoneCharges > 0 && (
              <div className="flex justify-between">
                <span>Gemstone Charges:</span>
                <span className="font-semibold text-obsidian">{formatINR(cart.stoneCharges)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-obsidian pt-2 border-t border-zinc-100">
              <span>Subtotal:</span>
              <span>{formatINR(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (3% Govt Tax):</span>
              <span className="font-semibold text-obsidian">+{formatINR(cart.gst)}</span>
            </div>
            <div className="flex justify-between">
              <span>Insured Transit Fee:</span>
              <span className="font-semibold text-emerald-600">
                {cart.subtotal >= 10000 ? 'FREE' : '₹250'}
              </span>
            </div>

            <div className="pt-3 border-t border-gold-200 flex justify-between items-baseline text-xl font-bold font-serif text-obsidian">
              <span>Amount Payable:</span>
              <span className="text-gold-600 text-2xl">{formatINR(cart.totalAmount)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedPayment}
            disabled={processingPayment || !selectedAddressId}
            className="w-full bg-gold-500 hover:bg-gold-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl transition-all transform hover:scale-[1.01] disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {processingPayment ? 'Opening Razorpay Gateway...' : 'Pay via Razorpay Gateway'}
          </button>

          <div className="text-[11px] text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-100">
            <p className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-gold-500" /> 256-Bit SSL Encrypted Razorpay Checkout</p>
            <p className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-gold-500" /> BIS Hallmarked 100% Insured Delivery</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
