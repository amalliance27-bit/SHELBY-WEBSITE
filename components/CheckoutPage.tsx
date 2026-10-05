import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

export const CheckoutPage: React.FC = () => {
  const { items, cartTotal } = useCart();
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('cashapp_zelle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the order
    alert('Order placed! Thank you for your business.');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-stone-400 mb-4">Your cart is empty</h2>
        <p className="text-stone-500 max-w-md">Add some delicious items from our menu to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 font-serif text-red-900">CHECKOUT</h1>
      
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
        {/* Billing Details */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-stone-800">Billing details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">First name <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Last name <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Company name (optional)</label>
              <input type="text" className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Country / Region <span className="text-red-500">*</span></label>
              <div className="w-full p-3 border border-stone-300 rounded bg-stone-50 font-bold">United States (US)</div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Street address <span className="text-red-500">*</span></label>
              <input required type="text" placeholder="House number and street name" className="w-full p-3 border border-stone-300 rounded mb-2 focus:outline-none focus:border-red-500" />
              <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Town / City <span className="text-red-500">*</span></label>
              <input required type="text" className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">State <span className="text-red-500">*</span></label>
              <select required className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500 bg-white">
                <option value="FL">Florida</option>
                <option value="NY">New York</option>
                <option value="CA">California</option>
                {/* Add more states as needed */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">ZIP Code <span className="text-red-500">*</span></label>
              <input required type="text" className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Phone <span className="text-red-500">*</span></label>
              <input required type="tel" className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Email address <span className="text-red-500">*</span></label>
              <input required type="email" className="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-stone-800">Additional information</h2>
          <div>
            <label className="block text-sm font-bold mb-1">Order notes (optional)</label>
            <textarea placeholder="Notes about your order, e.g. special notes for delivery." className="w-full p-3 border border-stone-300 rounded h-32 focus:outline-none focus:border-red-500"></textarea>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-stone-50 p-8 rounded-xl h-fit border border-stone-200">
          <h2 className="text-2xl font-bold mb-6 text-stone-800 text-center">Your Order</h2>
          
          <div className="bg-white rounded border border-stone-200 mb-8">
            <div className="flex justify-between p-4 border-b border-stone-200 font-bold text-stone-500 text-sm uppercase tracking-wider">
              <span>Product</span>
              <span>Subtotal</span>
            </div>
            
            {items.map(item => (
              <div key={item.id} className="flex justify-between p-4 border-b border-stone-100 text-stone-700">
                <span>{item.name} <span className="text-stone-400">× {item.quantity}</span></span>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="flex justify-between p-4 border-b border-stone-100 font-bold text-stone-700">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-4 font-bold text-xl text-red-900">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded border border-stone-200 mb-8">
            <h3 className="text-xl font-bold mb-4">Payment</h3>
            
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="payment" 
                  value="cashapp_zelle" 
                  checked={paymentMethod === 'cashapp_zelle'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold block mb-2">CashApp / Zelle - Acceptable</span>
                  <div className="text-stone-600 text-sm bg-stone-50 p-3 rounded border border-stone-200">
                    <p className="mb-1">Zelle – (786) 877-7585</p>
                    <p>or</p>
                    <p>CashApp – $sherlbysfinecuisines</p>
                  </div>
                </div>
              </label>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-100">
              <label className="flex items-start gap-3 cursor-pointer text-sm text-stone-600">
                <input type="checkbox" className="mt-1" />
                <span>I would like to receive exclusive emails with discounts and product information</span>
              </label>
              
              <p className="text-xs text-stone-500 mt-4 leading-relaxed">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a href="#" className="text-red-600 hover:underline">privacy policy</a>.
              </p>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-[#8E44AD] text-white font-bold text-lg rounded hover:bg-[#7D3C98] transition-colors shadow-lg uppercase tracking-wide">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};
