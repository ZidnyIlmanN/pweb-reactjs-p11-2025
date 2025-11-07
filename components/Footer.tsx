import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section 1: Logo & Description */}
          <div className="space-y-4 text-center md:text-left">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold justify-center md:justify-start"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IT</span>
              </div>
              <span className="font-pacifico text-lg">IT Literature Shop</span>
            </Link>
            <p className="text-sm text-gray-400">
              Your ultimate destination for the best IT literature and
              resources.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/books"
                className="text-sm text-gray-400 hover:text-white"
              >
                Books
              </Link>
              <Link
                href="/books/add"
                className="text-sm text-gray-400 hover:text-white"
              >
                Add Books
              </Link>
              <Link
                href="/transactions"
                className="text-sm text-gray-400 hover:text-white"
              >
                View Transactions
              </Link>
              <Link
                href="/transactions/statistics"
                className="text-sm text-gray-400 hover:text-white"
              >
                Statistics
              </Link>
            </nav>
          </div>

          {/* Section 3: Legal Links */} 
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/privacy-policy"
                className="text-sm text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm text-gray-400 hover:text-white"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Section 4: Social Media & Contact */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.636c-.78.302-1.45.73-2.114 1.394S.936 3.36.636 4.14c-.303.765-.504 1.635-.563 2.913C.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.564 2.913.302.78.73 1.45 1.394 2.114.664.664 1.334 1.092 2.114 1.394.765.303 1.635.504 2.913.563C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.261 2.913-.564.78-.302 1.45-.73 2.114-1.394.664-.664 1.092-1.334 1.394-2.114.303-.765.504-1.635.563-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.261-2.148-.564-2.913-.302-.78-.73-1.45-1.394-2.114S20.64 1.064 19.86 1.064c-.765-.303-1.635-.504-2.913-.563C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.899.42.42.68.818.899 1.382.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.013 3.585-.07 4.85c-.055 1.17-.249 1.805-.415 2.227-.217.562-.477.96-.899 1.382-.42.42-.818.68-1.382.899-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.013-4.85-.07c-1.17-.055-1.805-.249-2.227-.415-.217-.562-.477-.96-.899-1.382-.42-.42-.68-.818-.899-1.382-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.013-3.585.07-4.85c.055-1.17.249 1.805.415 2.227.217-.562.477.96.899-1.382.42-.42.818.68 1.382-.899.422-.164 1.057-.36 2.227-.413C8.415 2.173 8.82 2.16 12 2.16zM12 6a6 6 0 100 12 6 6 0 000-12zm0 1.92c-2.25 0-4.08 1.83-4.08 4.08s1.83 4.08 4.08 4.08 4.08-1.83 4.08-4.08-1.83-4.08-4.08-4.08zm0 1.92c1.17 0 2.16.99 2.16 2.16s-.99 2.16-2.16 2.16-2.16-.99-2.16-2.16.99-2.16 2.16-2.16zm6.406-5.613c-.81 0-1.47.66-1.47 1.47s.66 1.47 1.47 1.47 1.47-.66 1.47-1.47-.66-1.47-1.47-1.47z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012 10.772v.055a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Email:{" "}
              <a
                href="mailto:info@itlitshop.com"
                className="hover:text-white"
              >
                info@itlitshop.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} IT Literature Shop. All rights
            reserved.
          </p>
          <p className="mt-2">Designed and Developed by IT Enthusiasts.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;