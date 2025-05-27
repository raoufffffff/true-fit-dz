import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import states from './states';
import etat from './etat';
import "swiper/swiper-bundle.css";

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import './App.css';
import axios from 'axios';

function App() {
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];
  const imgs = ['/img-1.jpg', '/img-2.jpg', '/img-3.jpg'];
  const basePrice = 2450;
  const [good, setgood] = useState(false);
  const [eror, seteror] = useState(false);
  const [loading, setloading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    state: '',
    city: 't',
    size: 'L',
  });

  const [ridePrice, setRidePrice] = useState(0);
  const totalPrice = useMemo(() => basePrice + ridePrice, [ridePrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'state') {
      const selected = states.find((s) => s.code === value);
      if (selected) {
        setRidePrice(selected.prix_initial);
      }
    }
  };

  const postorder = async () => {
    setloading(true);
    seteror(false);
    try {
      const res = await axios.post(`https://true-fit-dz-api.vercel.app/`, {
        ...form,
        price: totalPrice,
        ride: ridePrice,
      });
      if (res.data.good) {
        setgood(true);
        // Facebook Pixel event tracking on successful submit
        if (window.fbq) {
          window.fbq('track', 'SubmitApplication');
        }
      } else {
        seteror(true);
      }
    } catch {
      seteror(true);
    } finally {
      setloading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postorder();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <img src="/logo.jpg" className="h-20 w-20 animate-bounce" alt="Loading..." />
      </div>
    );
  }

  if (good) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-4">
        <img src="/logo.jpg" className="h-24 w-24 rounded-full mb-6" />
        <h2 className="text-2xl font-bold mb-2">شكرًا لطلبك!</h2>
        <p className="text-lg text-gray-700">سنتواصل معك قريبًا لتأكيد الطلب 😊</p>
      </div>
    );
  }

  return (
    <div className='bg-[#f0f0f0] text-black min-h-screen'>
      <header className='flex justify-around items-center py-2 shadow-2xl'>
        <img src='/logo.jpg' className='h-16 w-16 rounded-full' />
      </header>

      <main className="py-6 px-4 flex flex-col items-center">
        <motion.h1
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          تيشيرت صيفي أنيق - فقط {basePrice} دج
        </motion.h1>

        <motion.div
          className="w-full max-w-md mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <PhotoProvider>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
            >
              {imgs.map((src, index) => (
                <SwiperSlide key={index}>
                  <PhotoView src={src}>
                    <img
                      src={src}
                      alt={`tshirt-${index}`}
                      className="rounded-xl w-full object-cover h-72 cursor-zoom-in"
                    />
                  </PhotoView>
                </SwiperSlide>
              ))}
            </Swiper>
          </PhotoProvider>
        </motion.div>

        <motion.div
          className="bg-white shadow-md p-6 rounded-xl w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            اطلب الآن - الدفع عند الاستلام
          </h2>
          {eror && (
            <p className="text-red-500 text-center mb-4">
              حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="الاسم الكامل"
              value={form.name}
              onChange={handleChange}
              required
              className="p-3 rounded-md border text-black placeholder-gray-600"
            />
            <input
              type="tel"
              name="phone"
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={handleChange}
              required
              className="p-3 rounded-md border text-black placeholder-gray-600"
            />
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="p-3 rounded-md border text-black bg-white"
            >
              <option value="" disabled>اختر ولايتك</option>
              {states.map((w, i) => (
                <option key={i} value={w.code}>{w.ar_name}</option>
              ))}
            </select>

            <div className="flex flex-col gap-2">
              <label className="text-right font-semibold mb-2">اختر المقاس</label>
              <div className="flex justify-center flex-wrap gap-2">
                {sizeOptions.map((e, i) => (
                  <span
                    key={i}
                    className={`flex px-3 rounded-xl py-1 border-[0.5px] border-[#000] cursor-pointer ${e === form.size ? 'bg-black text-white' : ''}`}
                    onClick={() => setForm({ ...form, size: e })}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right text-gray-700 space-y-1">
              <p>سعر التوصيل: <strong>{ridePrice} دج</strong></p>
              <p>السعر الإجمالي: <strong>{totalPrice} دج</strong></p>
            </div>

            <button
              type="submit"
              className="bg-[#313439] text-white font-bold py-3 rounded-md hover:bg-[#505357] transition-colors duration-300"
            >
              إرسال الطلب
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
