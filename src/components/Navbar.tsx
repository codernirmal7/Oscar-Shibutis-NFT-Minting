import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Palette, ShoppingBag, DoorClosedLocked, DoorClosedLockedIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { useToast } from '../hooks/use-toast';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { disconnectWallet, setWalletInfo } from '../store/slices/walletSlice';
import { ConnectButton } from '@rainbow-me/rainbowkit';


const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { address, isConnected, chainId } = useAccount();

  const initialAccountAddress = useSelector((state: RootState) => state.wallet.address)

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const signer = useEthersSigner();

  useEffect(() => {
    if (isConnected && address && chainId && signer) {
      dispatch(setWalletInfo({ address, isConnected, chainId, signer }));
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet.",
      });

    } else {
      dispatch(disconnectWallet());
    }

    if (initialAccountAddress && address !== initialAccountAddress) {
      dispatch(disconnectWallet());
      window.location.reload(); // Optional: reload page to reset state
    }
  }, [address, isConnected, chainId, signer]);

  // Scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { href: '/', label: 'Home', icon: Home, hasLocked: false },
    { href: '/minting', label: 'Mint', icon: Palette, hasLocked: false },
    { href: '/gallery', label: 'Gallery', icon: ShoppingBag, hasLocked: true },
  ];

  return (
    <nav
      id="navbar"
      className={`w-full max-w-screen-xl mx-auto fixed left-0 right-0 top-2 z-50 rounded-xl transition-all duration-300 bg-shibutis-primary ${isScrolled ? 'shadow-lg' : ''
        }`}
      style={{
        boxShadow: '5px 5px 0px #a3fab9',
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative group">
              <img
                src="/logo.png"
                alt="Shibutis logo"
                className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 border-3 sm:border-4 border-white rounded-full bg-black transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </div>
            <span className="font-bold text-white text-2xl tracking-wider hover:text-primary-100 transition-colors duration-200 cursor-pointer">
              Shibutis
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              !item.hasLocked ?
                <Link
                  key={item.href}
                  to={item.href}
                  className="group relative text-white font-semibold hover:text-green-300 transition-all duration-200 flex items-center text-lg py-2 px-3 rounded-lg hover:bg-white/10"
                >

                  <item.icon className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
                  <span>{item.label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-200 group-hover:w-full transition-all duration-300"></div>
                </Link>
                :
                <Link
                  key={item.href}
                  to="#"
                  className="group relative text-gray-300 cursor-default font-semibold transition-all duration-200 flex items-center text-lg py-2 px-3 rounded-lg "
                >

                  <svg className="MuiSvgIcon-root fill-gray-300" width={30} height={20} focusable="false" viewBox="0 0 24 24" aria-hidden="true" style={{ fontSize: "18px", marginRight: "5px" }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>
                  <span>{item.label}</span>
                  {/* <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-200 group-hover:w-full transition-all duration-300"></div> */}
                </Link>
            ))}
            <ConnectButton label="Connect Wallet" />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-primary-200  focus:outline-none focus:text-primary-200 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-200 rotate-0" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0 pb-0 pointer-events-none'
            }`}
        >
          <div className="pt-2 pb-3 space-y-1 border-t border-white/20 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group flex items-center px-4 py-3 text-lg text-white font-semibold hover:text-primary-200 hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
              >

                <item.icon className="w-5 h-5 mr-3 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="text-base">{item.label}</span>
              </Link>
            ))}
            <div className="pt-2 px-2">
              <ConnectButton label="Connect Wallet" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
