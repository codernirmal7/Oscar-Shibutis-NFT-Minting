import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-shibutis-panel border-t border-shibutis-border py-6 mt-12">
            <div className="flex flex-col items-center space-y-4">
                <img
                    src="/logo.png"
                    alt="Shibutis Logo"
                    className="w-14 h-14 rounded-full border-2 border-shibutis-border"
                />
                <nav className="flex space-x-6 text-sm text-shibutis-subtitle">
                    <a href="https://x.com/oscar_shibutis" target='_blank'>Twitter</a>
                    <a href="#">Telegram</a>
                    <a href="#">Contact</a>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;
