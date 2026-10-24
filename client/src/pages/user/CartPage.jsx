import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { formatINR, formatGram } from '../../utils/currencyFormatter';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clear } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gold-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-obsidian flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-gold-600" /> Shopping Cart
          </h1>
          <p className="text-xs text-zinc-500">
            Item prices are dynamically calculated based on today's gold & silver bullion market rates.
          </p>
        </div>

        {cart.items && cart.items.length > 0 && (
          <button
            onClick={clear}
            className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Clear All Items
          </button>
        )}
      </div>

      {cart.items && cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gold-200 p-5 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-xs"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl border border-gold-200 bg-ivory shrink-0"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-obsidian">{item.product.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {item.product.metalType} ({item.product.purity}) | Net Weight: {formatGram(item.product.weight)}
                    </p>
                    <p className="text-xs text-gold-700 font-semibold mt-1">
                      Unit Price: {formatINR(item.unitPricing?.finalPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-gold-300 rounded-lg bg-ivory overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="px-3 py-1 font-bold text-obsidian hover:bg-gold-200"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="px-3 py-1 font-bold text-obsidian hover:bg-gold-200"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-lg text-gold-700 block">
                      {formatINR(item.itemTotal)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-xs text-zinc-400 hover:text-rose-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="bg-white border border-gold-300 p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="font-serif font-bold text-xl text-obsidian border-b border-gold-200 pb-3">
              Cart Summary
            </h3>

            <div className="space-y-3 text-xs text-zinc-600">
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
                <span>Subtotal (Before Tax):</span>
                <span>{formatINR(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (3% Govt Tax):</span>
                <span className="font-semibold text-obsidian">+{formatINR(cart.gst)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Express Delivery:</span>
                <span className="font-semibold text-emerald-600">
                  {cart.subtotal >= 10000 ? 'FREE' : '₹250'}
                </span>
              </div>

              <div className="pt-3 border-t border-gold-200 flex justify-between items-baseline text-lg font-bold font-serif text-obsidian">
                <span>Grand Total:</span>
                <span className="text-gold-600 text-2xl">{formatINR(cart.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-obsidian text-white hover:bg-gold-500 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span> <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-zinc-400 space-y-1 pt-2">
              <p className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-gold-500" /> BIS Hallmarked Certified Guarantee</p>
              <p className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-gold-500" /> 100% Transit Insured Pan-India Express</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-gold-200 p-16 rounded-3xl text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-gold-300 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-obsidian">Your Cart is Currently Empty</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Discover our certified 24K, 22K, 18K Gold and 925 Silver jewellery collections.
          </p>
          <Link
            to="/catalog"
            className="inline-block bg-obsidian text-gold-400 font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-white transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
