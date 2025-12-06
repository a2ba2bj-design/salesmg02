'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import WEB from "../../../../public/firspage0.jpeg";
import { createUser } from "@/app/actions/createUser";

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState('')
  const [time, setTime] = useState("1:14");
  const [date, setDate] = useState("۶ شهریور");
  const router = useRouter();

  // تابع تبدیل تاریخ به شمسی (بدون کتابخانه خارجی)
  const convertToPersianDate = (date: Date): string => {
    // تبدیل ساده - برای دقت بیشتر از این تابع استفاده کنید
    const gregorianToJalali = (gy: number, gm: number, gd: number) => {
      const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      const gy2 = (gm > 2) ? (gy + 1) : gy;
      let days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
      let jy = -1595 + (33 * ~~(days / 12053));
      days %= 12053;
      jy += 4 * ~~(days / 1461);
      days %= 1461;
      if (days > 365) {
        jy += ~~((days - 1) / 365);
        days = (days - 1) % 365;
      }
      const jm = (days < 186) ? 1 + ~~(days / 31) : 7 + ~~((days - 186) / 30);
      const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
      return [jy, jm, jd];
    };

    const now = date;
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    
    const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
    
    const persianMonths = [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];
    
    // تبدیل اعداد انگلیسی به فارسی
    const toPersianDigits = (num: number): string => {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
    };
    
    return `${toPersianDigits(jd)} ${persianMonths[jm - 1]}`;
  };

  // تبدیل تاریخ به شمسی
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
      
      // تبدیل تاریخ به شمسی
      const persianDate = convertToPersianDate(now);
      setDate(persianDate);
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
   
    setLoading(true);
    setError("");
  
      if (mobileNumber.length !== 11) {
        setError("شماره موبایل باید ۱۱ رقم باشد");
        return;
      }
       const formData = new FormData()
    formData.append('phone', mobileNumber)

    setLoading(true)
    setMessage('')
    try {
      const result1 = await createUser(formData)
    
      setMessage(result1.message)
     
    } catch (error) {
      setMessage('خطا در ارسال کد')
    } finally {
      setLoading(false)
    }
    
  };

  const formatMobileNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length > 0 && !cleaned.startsWith('0')) {
      const formatted = cleaned.substring(0, 11);
      return formatted.startsWith('0') ? formatted : `0${formatted}`;
    }
    
    return cleaned;
  };

  // تابع تبدیل اعداد به فارسی برای placeholder
  const toPersianDigits = (numStr: string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return numStr.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  };

  return (
    <main className="relative w-full flex-grow min-h-screen z-0">
      <Image
        src={WEB}
        alt="Background image"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        className="object-cover object-bottom"
        priority
      />
      
      <div className="absolute top-1/2 right-4 md:right-8 lg:right-16 xl:right-24 transform -translate-y-1/2 z-10">
        <div className="w-full max-w-xs md:max-w-sm">
          <div className="text-right mb-4">
            <h1 className="text-2xl md:text-3xl text-white drop-shadow-lg">
               کاربر گرامی خوش آمدید
            </h1>
            
          </div>

          <div className="bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/25 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700/95 to-blue-700/95 p-5 relative">
              <div className="relative flex justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 border-3 border-white/40 flex items-center justify-center shadow-xl backdrop-blur-sm">
                  <div className="text-white text-4xl">👤</div>
                </div>
              </div>
              <p className="text-center text-white/95 mt-4 text-lg font-medium drop-shadow">
                ورود با شماره موبایل
              </p>
            </div>

            <div className="p-5 md:p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/25 backdrop-blur-sm border border-red-500/40 text-red-100 rounded-lg text-xs text-center">
                  <div className="flex items-center justify-center">
                    <span className="ml-1">⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 text-right">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70">
                      📱
                    </div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(formatMobileNumber(e.target.value))}
                      className="w-full py-3 pr-10 pl-3 bg-white/10 border border-white/30 rounded-xl focus:border-purple-400 focus:outline-none text-white transition-all duration-200 text-left text-sm backdrop-blur-sm"
                      placeholder={toPersianDigits("09123456789")}
                      required
                      pattern="09[0-9]{9}"
                      maxLength={11}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-right text-xs text-white/60 mt-1">
                    ۱۱ رقم وارد کنید
                  </p>
                </div>

                <button
                onClick={handleSubmit}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                      در حال ارسال...
                    </div>
                  ) : (
                    "ارسال رمز یکبار مصرف"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/20">
                <div className="text-center">
                  <p className="text-white/70 text-xs mb-2">
                    اولین بار است؟
                  </p>
                  <a href="#" className="text-purple-300 hover:text-white text-xs font-medium inline-flex items-center transition-colors">
                    <span className="ml-1">📝</span>
                    ثبت نام جدید
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-black/25 py-3 px-4 text-center">
              <div className="flex items-center justify-end mt-2 text-white/90 text-sm">
              <div className="flex items-center">
                <span className="ml-1">📅</span>
                <span className="font-medium mr-1">{date}</span>
                <div className="flex items-center ml-3">
                <span className="ml-1">🕐</span>
                <span className="font-medium mr-1">{time}</span>
              </div>
              </div>
            </div>
            </div>
            <div className="bg-black/25 py-3 px-4 text-center">
              
                    <p className="text-white/60 text-xs font-light">© 1404 - نسخه 1.۰
                    </p>
              
            </div>
          </div>

         </div>
      </div>
    </main>
  );
}