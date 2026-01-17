import { Mail, Instagram } from 'lucide-react';

export default function ContactSection() {
  return (
    <div className="mt-12 mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        Contact Us
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <a
          href="https://www.instagram.com/nn_group91?igsh=ZHdpdjk5Y3Q0ZmNy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-md hover:shadow-lg"
        >
          <Instagram className="w-5 h-5" />
          <span>Instagram</span>
        </a>
        <a
          href="mailto:noamharelnim@gmail.com"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <Mail className="w-5 h-5" />
          <span>noamharelnim@gmail.com</span>
        </a>
      </div>
    </div>
  );
}
