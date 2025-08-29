import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  Minus, 
  Clock, 
  Users, 
  Star, 
  Shield, 
  Zap,
  CheckCircle,
  XCircle,
  Loader,
  Trophy
} from 'lucide-react';

const NFTMintPage = () => {
  // Mock wallet state
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  
  // Contract state
  const [salePhase, setSalePhase] = useState(0); // 0: Closed, 1: Allowlist, 2: Public
  const [totalMinted, setTotalMinted] = useState(247);
  const [maxSupply] = useState(1000);
  const [mintPrice] = useState(0.05);
  const [presalePrice] = useState(0);
  const [maxPerWallet] = useState(3);
  
  // User state
  const [mintQuantity, setMintQuantity] = useState(1);
  const [userPresaleMinted, setUserPresaleMinted] = useState(0);
  const [userPublicMinted, setUserPublicMinted] = useState(0);
  const [isAllowlisted, setIsAllowlisted] = useState(true); // Mock allowlist status
  const [userAllowance, setUserAllowance] = useState(2); // Mock user allowance
  
  // UI state
  const [showSuccess, setShowSuccess] = useState(false);

  const phaseNames = ['Closed', 'Presale', 'Public Sale'];
  const currentPhase = phaseNames[salePhase];
  const isPresale = salePhase === 1;
  const isPublic = salePhase === 2;
  const isClosed = salePhase === 0;
  
  const currentPrice = isPresale ? presalePrice : mintPrice;
  const totalCost = currentPrice * mintQuantity;
  
  // Calculate remaining mints for user
  const userMinted = isPresale ? userPresaleMinted : userPublicMinted;
  const userLimit = isPresale ? userAllowance : maxPerWallet;
  const remainingMints = userLimit - userMinted;
  const canMint = remainingMints > 0 && !isClosed;

  // Mock wallet connection
  const connectWallet = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b8D47de5a5d2b92e5c');
      setIsLoading(false);
    }, 1500);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  // Mock minting function
  const handleMint = async () => {
    setTxLoading(true);
    // Simulate transaction
    setTimeout(() => {
      if (isPresale) {
        setUserPresaleMinted(prev => prev + mintQuantity);
      } else {
        setUserPublicMinted(prev => prev + mintQuantity);
      }
      setTotalMinted(prev => prev + mintQuantity);
      setShowSuccess(true);
      setTxLoading(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  useEffect(()=> {
    scrollTo(0,0)
  },[])

  const adjustQuantity = (delta : any) => {
    const newQuantity = Math.max(1, Math.min(remainingMints, mintQuantity + delta));
    setMintQuantity(newQuantity);
  };

  // Phase status component
  const PhaseStatus = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-pixel border ${
        isPresale 
          ? 'bg-shibutis-primary/10 text-shibutis-primary border-shibutis-primary/30'
          : isPublic
          ? 'bg-shibutis-orange/10 text-shibutis-orange border-shibutis-orange/30'
          : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
      }`}>
        {isPresale ? <Star size={16} /> : isPublic ? <Users size={16} /> : <Clock size={16} />}
        {currentPhase} {salePhase !== 0 && 'Active'}
      </div>
      
      {isPresale && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-shibutis-panel border border-shibutis-border">
          <Shield size={12} className="text-shibutis-primary" />
          <span className="text-shibutis-text">Allowlist Only</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-shibutis-dark text-shibutis-text font-body min-h-screen mt-20">
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg border border-green-400/50 flex items-center gap-2 animate-pulse">
          <CheckCircle size={20} />
          <span className="font-pixel">Mint successful! 🎉</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-pixel text-4xl lg:text-6xl text-shibutis-primary mb-4">
            MINT YOUR SHIBUTIS
          </h1>
          <p className="text-shibutis-subtitle text-lg lg:text-xl max-w-2xl mx-auto">
            Join the exclusive Shibutis Social Club by minting your unique NFT
          </p>
        </div>

        <PhaseStatus />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: NFT Preview */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-shibutis-primary to-shibutis-orange rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-shibutis-panel rounded-xl p-6 border border-shibutis-border">
                <img
                  src="/images/home-nft1.jpg"
                  alt="Shibutis NFT Preview"
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <div className="text-center">
                  <h3 className="font-pixel text-xl text-shibutis-primary mb-2">SHIBUTIS #???</h3>
                  <p className="text-shibutis-subtitle text-sm">Your unique Shibutis will be revealed after mint</p>
                </div>
              </div>
            </div>

            {/* Collection Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 text-center">
                <div className="text-xl font-pixel text-shibutis-primary mb-1">{totalMinted}</div>
                <div className="text-sm text-shibutis-subtitle">Minted</div>
              </div>
              <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 text-center">
                <div className="text-xl font-pixel text-shibutis-orange mb-1">{maxSupply - totalMinted}</div>
                <div className="text-sm text-shibutis-subtitle">Remaining</div>
              </div>
            </div>
          </div>

          {/* Right: Mint Interface */}
          <div className="space-y-6">
            {/* Wallet Connection */}
            {!isConnected ? (
              <div className="bg-shibutis-panel rounded-xl p-8 border border-shibutis-border text-center">
                <Wallet size={48} className="mx-auto text-shibutis-primary mb-4" />
                <h3 className="font-pixel text-xl text-shibutis-primary mb-4">Connect Your Wallet</h3>
                <p className="text-shibutis-subtitle mb-6">
                  Connect your wallet to start minting your Shibutis NFT
                </p>
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="bg-shibutis-primary hover:bg-shibutis-primary/90 text-shibutis-dark px-8 py-3 rounded-lg font-pixel transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {isLoading ? <Loader size={20} className="animate-spin" /> : <Wallet size={20} />}
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            ) : (
              <>
                {/* Wallet Info */}
                <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-shibutis-primary rounded-full flex items-center justify-center">
                      <Wallet size={16} className="text-shibutis-dark" />
                    </div>
                    <div>
                      <div className="text-sm text-shibutis-text font-mono">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </div>
                      <div className="text-xs text-shibutis-subtitle">Connected</div>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="text-xs text-shibutis-subtitle hover:text-shibutis-text transition-colors"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Allowlist Status (Presale only) */}
                {isPresale && (
                  <div className={`rounded-lg p-4 border flex items-center gap-3 ${
                    isAllowlisted
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {isAllowlisted ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <div>
                      <div className="font-pixel text-sm">
                        {isAllowlisted ? 'Allowlist Verified' : 'Not Allowlisted'}
                      </div>
                      <div className="text-xs opacity-80">
                        {isAllowlisted 
                          ? `You can mint up to ${userAllowance} NFTs in presale`
                          : 'You need to be on the allowlist for presale'
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Mint Interface */}
                {!isClosed && (isAllowlisted || isPublic) && (
                  <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border space-y-6">
                    <div className="text-center">
                      <h3 className="font-pixel text-xl text-shibutis-primary mb-2">
                        {isPresale ? 'Presale Mint' : 'Public Mint'}
                      </h3>
                      <p className="text-shibutis-subtitle text-sm">
                        {isPresale 
                          ? `${currentPrice} ETH per NFT • ${remainingMints} remaining for you`
                          : `${currentPrice} ETH per NFT • Max ${maxPerWallet} per wallet`
                        }
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="space-y-4">
                      <label className="block text-center font-pixel text-shibutis-text">
                        Quantity
                      </label>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => adjustQuantity(-1)}
                          disabled={mintQuantity <= 1}
                          className="w-10 h-10 bg-shibutis-dark border border-shibutis-border rounded-lg flex items-center justify-center hover:border-shibutis-primary/50 transition-colors disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        
                        <div className="text-2xl font-pixel text-shibutis-primary min-w-[3rem] text-center">
                          {mintQuantity}
                        </div>
                        
                        <button
                          onClick={() => adjustQuantity(1)}
                          disabled={mintQuantity >= remainingMints}
                          className="w-10 h-10 bg-shibutis-dark border border-shibutis-border rounded-lg flex items-center justify-center hover:border-shibutis-primary/50 transition-colors disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-center text-sm text-shibutis-subtitle">
                        {remainingMints} remaining • {userMinted} already minted
                      </div>
                    </div>

                    {/* Total Cost */}
                    <div className="bg-shibutis-dark/50 rounded-lg p-4 border border-shibutis-border/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-shibutis-subtitle">Total Cost:</span>
                        <span className="font-pixel text-xl text-shibutis-primary">
                          {totalCost.toFixed(3)} ETH
                        </span>
                      </div>
                      <div className="text-xs text-shibutis-subtitle">
                        {mintQuantity} × {currentPrice} ETH {isPresale && currentPrice === 0 && '(FREE!)'}
                      </div>
                    </div>

                    {/* Mint Button */}
                    <button
                      onClick={handleMint}
                      disabled={!canMint || txLoading || remainingMints === 0}
                      className="w-full relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-shibutis-primary to-shibutis-orange rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                      <div className={`relative w-full py-4 px-6 rounded-lg font-pixel text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                        canMint && !txLoading
                          ? 'bg-shibutis-primary hover:bg-shibutis-primary/90 text-shibutis-dark hover:scale-[1.02]'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}>
                        {txLoading ? (
                          <>
                            <Loader size={20} className="animate-spin" />
                            Processing...
                          </>
                        ) : remainingMints === 0 ? (
                          'Limit Reached'
                        ) : !canMint ? (
                          'Cannot Mint'
                        ) : (
                          <>
                            <Zap size={20} />
                            MINT {mintQuantity} SHIBUTIS
                          </>
                        )}
                      </div>
                    </button>

                    {/* Mint Info */}
                    <div className="text-center text-xs text-shibutis-subtitle space-y-1">
                      <div>Gas fees not included in price estimate</div>
                      <div>NFTs will be revealed after minting</div>
                    </div>
                  </div>
                )}

                {/* Phase Closed Message */}
                {isClosed && (
                  <div className="bg-shibutis-panel rounded-xl p-8 border border-shibutis-border text-center">
                    <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="font-pixel text-xl text-gray-400 mb-2">Sale Not Active</h3>
                    <p className="text-shibutis-subtitle">
                      The mint is currently closed. Follow our social media for updates on when it opens!
                    </p>
                  </div>
                )}

                {/* Not Allowlisted Message */}
                {isPresale && !isAllowlisted && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                    <XCircle size={48} className="mx-auto text-red-400 mb-4" />
                    <h3 className="font-pixel text-lg text-red-400 mb-2">Not Allowlisted</h3>
                    <p className="text-red-300/80 text-sm">
                      You're not on the allowlist for presale. Wait for public sale or check if you're using the correct wallet.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sale Info Cards */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Presale Info */}
          <div className={`bg-shibutis-panel rounded-xl p-6 border transition-all duration-300 ${
            isPresale 
              ? 'border-shibutis-primary/50 shadow-lg shadow-shibutis-primary/10' 
              : 'border-shibutis-border/30'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                isPresale ? 'bg-shibutis-primary/20' : 'bg-gray-500/20'
              }`}>
                <Star className={`w-5 h-5 ${
                  isPresale ? 'text-shibutis-primary' : 'text-gray-400'
                }`} />
              </div>
              <h3 className={`font-pixel text-lg ${
                isPresale ? 'text-shibutis-primary' : 'text-gray-400'
              }`}>
                Presale Phase
              </h3>
              {isPresale && (
                <span className="bg-shibutis-primary/10 text-shibutis-primary text-xs px-2 py-1 rounded-full font-pixel">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Price:</span>
                <span className="text-shibutis-text font-mono">
                  {presalePrice} ETH {presalePrice === 0 && '(FREE!)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Access:</span>
                <span className="text-shibutis-text">Allowlist Only</span>
              </div>
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Your Allocation:</span>
                <span className="text-shibutis-text">{userAllowance} NFTs</span>
              </div>
            </div>
          </div>

          {/* Public Sale Info */}
          <div className={`bg-shibutis-panel rounded-xl p-6 border transition-all duration-300 ${
            isPublic 
              ? 'border-shibutis-orange/50 shadow-lg shadow-shibutis-orange/10' 
              : 'border-shibutis-border/30'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                isPublic ? 'bg-shibutis-orange/20' : 'bg-gray-500/20'
              }`}>
                <Users className={`w-5 h-5 ${
                  isPublic ? 'text-shibutis-orange' : 'text-gray-400'
                }`} />
              </div>
              <h3 className={`font-pixel text-lg ${
                isPublic ? 'text-shibutis-orange' : 'text-gray-400'
              }`}>
                Public Sale
              </h3>
              {isPublic && (
                <span className="bg-shibutis-orange/10 text-shibutis-orange text-xs px-2 py-1 rounded-full font-pixel">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Price:</span>
                <span className="text-shibutis-text font-mono">{mintPrice} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Access:</span>
                <span className="text-shibutis-text">Open to All</span>
              </div>
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Max per Wallet:</span>
                <span className="text-shibutis-text">
                  {maxPerWallet === 0 ? 'Unlimited' : `${maxPerWallet} NFTs`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-shibutis-subtitle">Mint Progress</span>
            <span className="text-sm text-shibutis-text">
              {totalMinted} / {maxSupply}
            </span>
          </div>
          <div className="w-full bg-shibutis-dark rounded-full h-3 border border-shibutis-border/30 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-shibutis-primary to-shibutis-orange rounded-full transition-all duration-500 relative"
              style={{ width: `${(totalMinted / maxSupply) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-center mt-2 text-xs text-shibutis-subtitle">
            {((totalMinted / maxSupply) * 100).toFixed(1)}% minted
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default NFTMintPage;