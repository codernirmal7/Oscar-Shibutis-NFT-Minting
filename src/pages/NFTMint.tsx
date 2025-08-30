import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useConnect, useDisconnect, useAccount, useChainId } from 'wagmi';
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
  AlertTriangle,
} from 'lucide-react';
import { useMinting } from '../hooks/useMinting';
import { setWalletInfo, disconnectWallet as disconnectWalletAction } from '../store/slices/walletSlice';
import { RootState } from '../store/index'; // Adjust path as needed
import { useEthersSigner } from '../hooks/useEthersSigner';

const NFTMintPage = () => {
  const dispatch = useDispatch();

  // Redux wallet state
  const { address, isConnected, chainId: reduxChainId } = useSelector((state: RootState) => state.wallet);

  // Wagmi hooks for connection management
  const { disconnect } = useDisconnect();
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const chainId = useChainId();
  const ethersSigner = useEthersSigner();

  const {
    config,
    userInfo,
    loading,
    isCorrectChain,
    presaleMint,
    publicMint,
    handleSwitchChain,
    checkAllowlist,
    isPresale,
    isPublic,
    isClosed,
    totalMinted,
    maxSupply,
    mintPriceEth,
    presalePriceEth,
  } = useMinting();

  // Local state
  const [mintQuantity, setMintQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync wagmi state with Redux
  useEffect(() => {
    if (wagmiConnected && wagmiAddress && chainId) {
      dispatch(setWalletInfo({
        address: wagmiAddress,
        isConnected: wagmiConnected,
        chainId,
        signer: ethersSigner,
      }));
    } else if (!wagmiConnected) {
      dispatch(disconnectWalletAction());
    }
  }, [wagmiConnected, wagmiAddress, chainId, ethersSigner, dispatch]);

  const phaseNames = ['Closed', 'Presale', 'Public Sale'];
  const currentPhase = phaseNames[config.salePhase] || 'Loading...';

  // Get user's allowlist status
  const allowlistInfo = address ? checkAllowlist(address) : {
    proof: [],
    isAllowlisted: false,
    allowance: 0
  };
  const { proof, isAllowlisted, allowance: userAllowance } = allowlistInfo;

  // Calculate user limits and remaining mints
  const userPresaleMinted = Number(userInfo.presaleMinted);
  const userPublicMinted = Number(userInfo.publicMinted);
  const maxPerWalletPublic = Number(config.maxPerWalletPublic);

  const userMinted = isPresale ? userPresaleMinted : userPublicMinted;
  const userLimit = isPresale ? userAllowance : (maxPerWalletPublic || 999);
  const remainingMints = Math.max(0, userLimit - userMinted);
  const canMint = remainingMints > 0 && !isClosed && (isAllowlisted || isPublic);

  const currentPrice = isPresale ? presalePriceEth : mintPriceEth;
  const totalCost = currentPrice * mintQuantity;


  // Disconnect wallet
  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      dispatch(disconnectWalletAction());
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(remainingMints, mintQuantity + delta));
    setMintQuantity(newQuantity);
  };

  // Handle minting
  const handleMint = async () => {
    if (!address || !canMint) return;

    try {
      if (isPresale) {
        await presaleMint(mintQuantity, userAllowance, proof);
        setMintQuantity(1)
      } else {
        await publicMint(mintQuantity);
        setMintQuantity(1)
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Mint failed:', error);
    }
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  // Reset quantity when switching between phases or connecting wallet
  useEffect(() => {
    setMintQuantity(1);
  }, [config.salePhase, address]);

  // Phase status component
  const PhaseStatus = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-pixel border ${isPresale
        ? 'bg-shibutis-primary/10 text-shibutis-primary border-shibutis-primary/30'
        : isPublic
          ? 'bg-shibutis-orange/10 text-shibutis-orange border-shibutis-orange/30'
          : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
        }`}>
        {isPresale ? <Star size={16} /> : isPublic ? <Users size={16} /> : <Clock size={16} />}
        {currentPhase} {config.salePhase !== 0 && 'Active'}
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
                  <p className="text-shibutis-subtitle text-sm">
                    {config.revealed ? 'Your unique Shibutis will be revealed after mint' : 'NFTs will be revealed after minting'}
                  </p>
                </div>
              </div>
            </div>

            {/* Collection Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 text-center">
                <div className="text-xl font-pixel text-shibutis-primary mb-1">
                  {loading.contract ? '...' : totalMinted}
                </div>
                <div className="text-sm text-shibutis-subtitle">Minted</div>
              </div>
              <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 text-center">
                <div className="text-xl font-pixel text-shibutis-orange mb-1">
                  {loading.contract ? '...' : maxSupply - totalMinted}
                </div>
                <div className="text-sm text-shibutis-subtitle">Remaining</div>
              </div>
            </div>
          </div>

          {/* Right: Mint Interface */}
          <div className="space-y-6">
            {/* Wrong Chain Warning */}
            {isConnected && !isCorrectChain && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                <AlertTriangle size={48} className="mx-auto text-yellow-400 mb-4" />
                <h3 className="font-pixel text-lg text-yellow-400 mb-2">Wrong Network</h3>
                <p className="text-yellow-300/80 text-sm mb-4">
                  Please switch to Ethereum Mainnet to continue
                </p>
                <button
                  onClick={handleSwitchChain}
                  disabled={loading.switchingChain}
                  className="bg-yellow-500 hover:bg-yellow-500/90 text-black px-6 py-2 rounded-lg font-pixel transition-all duration-300 flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {loading.switchingChain ? <Loader size={16} className="animate-spin" /> : null}
                  {loading.switchingChain ? 'Switching...' : 'Switch Network'}
                </button>
              </div>
            )}

            {/* Wallet Connection */}
            {!isConnected ? (
              <div className="bg-shibutis-panel rounded-xl p-8 border border-shibutis-border text-center">
                <Wallet size={48} className="mx-auto text-shibutis-primary mb-4" />
                <h3 className="font-pixel text-xl text-shibutis-primary mb-4">Connect Your Wallet</h3>
                <p className="text-shibutis-subtitle mb-6">
                  Connect your wallet to start minting your Shibutis NFT
                </p>

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
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                      </div>
                      <div className="text-xs text-shibutis-subtitle">
                        Connected {reduxChainId ? `• Chain ${reduxChainId}` : ''}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectWallet}
                    className="text-xs text-shibutis-subtitle hover:text-shibutis-text transition-colors"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Contract Loading */}
                {loading.contract && (
                  <div className="bg-shibutis-panel rounded-xl p-8 border border-shibutis-border text-center">
                    <Loader size={48} className="mx-auto text-shibutis-primary mb-4 animate-spin" />
                    <h3 className="font-pixel text-xl text-shibutis-primary mb-2">Loading Contract</h3>
                    <p className="text-shibutis-subtitle">Fetching contract information...</p>
                  </div>
                )}

                {/* Allowlist Status (Presale only) */}
                {isPresale && !loading.contract && isCorrectChain && (
                  <div className={`rounded-lg p-4 border flex items-center gap-3 ${isAllowlisted
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
                {!isClosed && !loading.contract && isCorrectChain && (isAllowlisted || isPublic) && (
                  <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border space-y-6">
                    <div className="text-center">
                      <h3 className="font-pixel text-xl text-shibutis-primary mb-2">
                        {isPresale ? 'Presale Mint' : 'Public Mint'}
                      </h3>
                      <p className="text-shibutis-subtitle text-sm">
                        {isPresale
                          ? `${currentPrice} ETH per NFT • ${remainingMints} remaining for you`
                          : `${currentPrice} ETH per NFT • ${maxPerWalletPublic === 0 ? 'No limit' : `Max ${maxPerWalletPublic} per wallet`}`
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
                          {totalCost.toFixed(4)} ETH
                        </span>
                      </div>
                      <div className="text-xs text-shibutis-subtitle">
                        {mintQuantity} × {currentPrice} ETH {isPresale && currentPrice === 0 && '(FREE!)'}
                      </div>
                    </div>

                    {/* Mint Button */}
                    <button
                      onClick={handleMint}
                      disabled={!canMint || loading.minting || remainingMints === 0}
                      className="w-full relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-shibutis-primary to-shibutis-orange rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                      <div className={`relative w-full py-4 px-6 rounded-lg font-pixel text-lg transition-all duration-300 flex items-center justify-center gap-3 ${canMint && !loading.minting
                        ? 'bg-shibutis-primary hover:bg-shibutis-primary/90 text-shibutis-dark hover:scale-[1.02]'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}>
                        {loading.minting ? (
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
                {isClosed && !loading.contract && isCorrectChain && (
                  <div className="bg-shibutis-panel rounded-xl p-8 border border-shibutis-border text-center">
                    <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="font-pixel text-xl text-gray-400 mb-2">Sale Not Active</h3>
                    <p className="text-shibutis-subtitle">
                      The mint is currently closed. Follow our social media for updates on when it opens!
                    </p>
                  </div>
                )}

                {/* Not Allowlisted Message */}
                {isPresale && !isAllowlisted && !loading.contract && isCorrectChain && (
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
          <div className={`bg-shibutis-panel rounded-xl p-6 border transition-all duration-300 ${isPresale
            ? 'border-shibutis-primary/50 shadow-lg shadow-shibutis-primary/10'
            : 'border-shibutis-border/30'
            }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isPresale ? 'bg-shibutis-primary/20' : 'bg-gray-500/20'
                }`}>
                <Star className={`w-5 h-5 ${isPresale ? 'text-shibutis-primary' : 'text-gray-400'
                  }`} />
              </div>
              <h3 className={`font-pixel text-lg ${isPresale ? 'text-shibutis-primary' : 'text-gray-400'
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
                  {loading.contract ? '...' : `${presalePriceEth} ETH`} {presalePriceEth === 0 && !loading.contract && '(FREE!)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Access:</span>
                <span className="text-shibutis-text">Allowlist Only</span>
              </div>
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Your Allocation:</span>
                <span className="text-shibutis-text">
                  {isConnected && address ? (
                    isAllowlisted ? `${userAllowance} NFTs` : 'Not Allowlisted'
                  ) : 'Connect Wallet'}
                </span>
              </div>
            </div>
          </div>


          {/* Public Sale Info */}
          <div className={`bg-shibutis-panel rounded-xl p-6 border transition-all duration-300 ${isPublic
            ? 'border-shibutis-orange/50 shadow-lg shadow-shibutis-orange/10'
            : 'border-shibutis-border/30'
            }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isPublic ? 'bg-shibutis-orange/20' : 'bg-gray-500/20'
                }`}>
                <Users className={`w-5 h-5 ${isPublic ? 'text-shibutis-orange' : 'text-gray-400'
                  }`} />
              </div>
              <h3 className={`font-pixel text-lg ${isPublic ? 'text-shibutis-orange' : 'text-gray-400'
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
                <span className="text-shibutis-text font-mono">
                  {loading.contract ? '...' : `${mintPriceEth} ETH`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Access:</span>
                <span className="text-shibutis-text">Open to All</span>
              </div>
              <div className="flex justify-between">
                <span className="text-shibutis-subtitle">Max per Wallet:</span>
                <span className="text-shibutis-text">
                  {loading.contract ? '...' : maxPerWalletPublic === 0 ? 'Unlimited' : `${maxPerWalletPublic} NFTs`}
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
              {loading.contract ? '...' : `${totalMinted} / ${maxSupply}`}
            </span>
          </div>
          <div className="w-full bg-shibutis-dark rounded-full h-3 border border-shibutis-border/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-shibutis-primary to-shibutis-orange rounded-full transition-all duration-500 relative"
              style={{ width: loading.contract ? '0%' : `${(totalMinted / maxSupply) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-center mt-2 text-xs text-shibutis-subtitle">
            {loading.contract ? '...' : `${((totalMinted / maxSupply) * 100).toFixed(1)}% minted`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTMintPage;
