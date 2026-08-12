import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-950 via-green-00 to-green-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="ReLife Hub"
                className="w-20 h-20"
              />

              <div>
                <h2 className="text-xl font-bold">
                  ReLife Hub
                </h2>

                <p className="text-xs text-green-300">
                  Share • Donate • Reuse
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mt-4 leading-6">
              ReLife Hub connects donors,
              volunteers and receivers to
              share useful items and build
              a better community.
            </p>

            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-600 flex items-center justify-center duration-300"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-600 flex items-center justify-center duration-300"
              >
                < FaTwitter size={18} />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-600 flex items-center justify-center duration-300"
              >
                <  FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-600 flex items-center justify-center duration-300"
              >
                <  FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="font-bold text-lg mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">Donate</a></li>
              <li><a href="#">Find Items</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Categories */}

          <div>
            <h3 className="font-bold text-lg mb-4">
              Categories
            </h3>

            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Food</li>
              <li>Clothes</li>
              <li>Books</li>
              <li>Electronics</li>
              <li>Furniture</li>
              <li>Others</li>
            </ul>
          </div>

          {/* Support */}

          <div>
            <h3 className="font-bold text-lg mb-4">
              Support
            </h3>

            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Help Center</li>
              <li>Safety Tips</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* Newsletter */}

          <div>
            <h3 className="font-bold text-lg mb-4">
              Newsletter
            </h3>

            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter
              for latest updates.
            </p>

            <input
  type="email"
  placeholder="Enter your email"
  className="w-full bg-white rounded-md px-4 py-2 text-black outline-none border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
/>

            <button
              className="mt-3 w-full bg-green-600 hover:bg-green-700 rounded-md py-2 font-semibold transition"
            >
              Subscribe
            </button>
          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-green-800 mt-8 pt-5 flex flex-col md:flex-row justify-between items-center">

          <p className="text-sm text-gray-300">
            © 2024 ReLife Hub. All rights reserved.
          </p>

          <img
            src="/footer-leaf.png"
            alt=""
            className="w-32 mt-4 md:mt-0"
          />
        </div>

      </div>
    </footer>
  );
}