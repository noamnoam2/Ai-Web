'use client';

import { useState, useEffect } from 'react';

export default function RTLToggle() {
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedRTL = localStorage.getItem('aitf_rtl') === 'true';
    setIsRTL(savedRTL);
    updateDirection(savedRTL);
  }, []);

  const updateDirection = (rtl: boolean) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', rtl ? 'he' : 'en');
    }
  };

  const handleToggle = () => {
    const newRTL = !isRTL;
    setIsRTL(newRTL);
    localStorage.setItem('aitf_rtl', newRTL.toString());
    updateDirection(newRTL);
  };

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      title={isRTL ? 'Switch to LTR' : 'Switch to RTL'}
    >
      {isRTL ? '← LTR' : 'RTL →'}
    </button>
  );
}
