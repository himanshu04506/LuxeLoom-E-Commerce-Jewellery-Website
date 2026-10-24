import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { formatINR, formatGram } from '../../utils/currencyFormatter';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 10000;
  const currentTotal = cart.totalAmount || 0;
  const freeShippingProgress = Math.min(100, (currentTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gold-300 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-gold-200 flex items-center justify-between bg-ivory">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif font-bold text-lg text-obsidian">Your Jewellery Shopping Cart</h2>
              <span className="bg-gold-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.totalItemsCount || 0}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-gold-50 px-5 py-3 border-b border-gold-200 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-gold-900 mb-1.5 flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-gold-600 shrink-0" />
                Add <strong>{formatINR(remainingForFreeShipping)}</strong> more for FREE Insured Express Delivery!
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Congratulations! You qualified for FREE Insured Pan-India Express Delivery!
              </p>
            )}
            <div className="w-full bg-gold-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gold-500 h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-zinc-100">
            {cart.items && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div key={item._id} className="pt-4 first:pt-0 flex gap-3">
                  <img
                    src={
                      item.product.images && item.product.images.length > 0
                        ? item.product.images[0]
                        : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'
                    }
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gold-200 bg-ivory shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif font-bold text-obsidian text-sm line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-zinc-500 font-medium mt-0.5">
                        {item.product.metalType} ({item.product.purity}) | {formatGram(item.product.weight)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gold-300 rounded-md overflow-hidden bg-ivory">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gold-200 text-obsidian font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-semibold text-obsidian">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gold-200 text-obsidian font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-sm text-gold-700">
                          {formatINR(item.itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gold-300 mx-auto" />
                <h3 className="font-serif text-base font-bold text-obsidian">Your cart is empty</h3>
                <p className="text-xs text-zinc-500">Explore our gold and silver collections to add items.</p>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.items && cart.items.length > 0 && (
            <div className="p-5 border-t border-gold-200 bg-ivory space-y-4">
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal (Live Rate):</span>
                  <span className="font-semibold text-obsidian">{formatINR(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3% Govt Tax):</span>
                  <span className="font-semibold text-obsidian">+{formatINR(cart.gst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold text-emerald-600">
                    {cart.subtotal >= freeShippingThreshold ? 'FREE' : '₹250'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold font-serif text-obsidian pt-2 border-t border-gold-200">
                  <span>Grand Total:</span>
                  <span className="text-gold-600">{formatINR(cart.totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-obsidian text-white hover:bg-gold-500 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
