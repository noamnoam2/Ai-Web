import { Mail, Instagram } from 'lucide-react';

export default function ContactSection() {
  return (
    <div className="mt-12 mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        Contact Us
      </h2>
      <div className="flex items-center justify-center gap-4">
        <a
          href="https://www.instagram.com/nn_group91?igsh=ZHdpdjk5Y3Q0ZmNy"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          aria-label="Instagram"
        >
          <Instagram className="w-6 h-6 text-gray-900" />
        </a>
        <a
          href="mailto:noamharelnim@gmail.com?subject=Contact from AI Tool Founder"
          className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          aria-label="Email noamharelnim@gmail.com"
          title="noamharelnim@gmail.com"
        >
          <Mail className="w-6 h-6 text-gray-900" />
        </a>
      </div>
    </div>
  );
}
