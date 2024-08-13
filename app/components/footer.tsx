import React from 'react';

const Footer = () => {
  return (
    <div>
      <footer className="footer footer-center bg-base-300 text-base-content p-4 fixed bottom-0 left-[180px] w-full z-5">
        <aside>
          <p className="text-sm">
            Created in {new Date().getFullYear()} - by{' '}
            <a href="https://www.osworld.dev/" className="text-green-600">
              Oscar Leal
            </a>
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
