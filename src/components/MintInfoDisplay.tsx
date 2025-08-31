import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Coins, 
  Users, 
  Star, 
  Clock,
  RefreshCw,
  AlertCircle,
  Shield,
  Crown,
  Zap
} from 'lucide-react';
import { useReadOnlyMintInfo } from '../hooks/useReadOnlyMintInfo';

export const MintInfoDisplay: React.FC = () => {
  const { mintInfo, loading, error, refresh } = useReadOnlyMintInfo();

  if (loading && !mintInfo) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-shibutis-border rounded-lg"></div>
              <div className="h-4 bg-shibutis-border rounded w-24"></div>
            </div>
            <div className="h-8 bg-shibutis-border rounded w-16 mb-2"></div>
            <div className="h-3 bg-shibutis-border rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center mb-12">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="font-pixel text-lg text-red-400 mb-2">Error Loading Mint Data</h3>
        <p className="text-red-300/80 text-sm mb-4">{error}</p>
        <button
          onClick={refresh}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-pixel transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!mintInfo) return null;

  return (
    <div className="space-y-8 mb-12">
      {/* Current Sale Phase Banner */}
      <div className={`bg-shibutis-panel rounded-xl p-6 border text-center ${
        mintInfo.isPresaleActive 
          ? 'border-shibutis-primary/50 shadow-lg shadow-shibutis-primary/10'
          : mintInfo.isPublicActive
          ? 'border-shibutis-orange/50 shadow-lg shadow-shibutis-orange/10'
          : 'border-shibutis-border/30'
      }`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${
            mintInfo.isPresaleActive 
              ? 'bg-shibutis-primary/20' 
              : mintInfo.isPublicActive 
              ? 'bg-shibutis-orange/20' 
              : 'bg-gray-500/20'
          }`}>
            {mintInfo.isPresaleActive ? (
              <Star className="w-6 h-6 text-shibutis-primary" />
            ) : mintInfo.isPublicActive ? (
              <Users className="w-6 h-6 text-shibutis-orange" />
            ) : (
              <Clock className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className={`font-pixel text-2xl ${
              mintInfo.isPresaleActive 
                ? 'text-shibutis-primary' 
                : mintInfo.isPublicActive 
                ? 'text-shibutis-orange' 
                : 'text-gray-400'
            }`}>
              {mintInfo.salePhaseText}
            </h3>
            <p className="text-shibutis-subtitle text-sm">
              {mintInfo.isClosed ? 'Minting is currently closed' : 'Minting is active'}
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="ml-4 p-2 bg-shibutis-dark/50 hover:bg-shibutis-dark rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={16} className={`text-shibutis-subtitle ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {!mintInfo.isClosed && (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-shibutis-dark/30 rounded-lg p-4">
              <div className="text-shibutis-subtitle text-sm mb-1">Current Price</div>
              <div className="font-pixel text-xl text-shibutis-text">
                {mintInfo.isPresaleActive ? mintInfo.presalePrice : mintInfo.mintPrice} ETH
                {mintInfo.isPresaleActive && mintInfo.presalePrice === '0.0' && (
                  <span className="text-shibutis-primary text-sm ml-2">(FREE!)</span>
                )}
              </div>
            </div>
            <div className="bg-shibutis-dark/30 rounded-lg p-4">
              <div className="text-shibutis-subtitle text-sm mb-1">Max Per Wallet</div>
              <div className="font-pixel text-xl text-shibutis-text">
                {mintInfo.isPresaleActive ? '2 NFTs' : mintInfo.maxPerWalletPublic === 0 ? 'Unlimited' : `${mintInfo.maxPerWalletPublic} NFTs`}
              </div>
            </div>
            <div className="bg-shibutis-dark/30 rounded-lg p-4">
              <div className="text-shibutis-subtitle text-sm mb-1">Remaining</div>
              <div className="font-pixel text-xl text-shibutis-text">
                {mintInfo.remainingSupply.toLocaleString()} NFTs
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Minted */}
        <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-shibutis-primary/20">
              <TrendingUp className="w-5 h-5 text-shibutis-primary" />
            </div>
            <h3 className="font-pixel text-lg text-shibutis-primary">Total Minted</h3>
          </div>
          <div className="text-3xl font-pixel text-shibutis-text mb-2">
            {mintInfo.totalSupply.toLocaleString()}
          </div>
          <div className="text-sm text-shibutis-subtitle">
            Out of {mintInfo.maxSupply.toLocaleString()} total
          </div>
        </div>

        {/* Remaining Supply */}
        <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-shibutis-orange/20">
              <BarChart3 className="w-5 h-5 text-shibutis-orange" />
            </div>
            <h3 className="font-pixel text-lg text-shibutis-orange">Remaining</h3>
          </div>
          <div className="text-3xl font-pixel text-shibutis-text mb-2">
            {mintInfo.remainingSupply.toLocaleString()}
          </div>
          <div className="text-sm text-shibutis-subtitle">
            {mintInfo.mintProgress.toFixed(1)}% minted
          </div>
        </div>

        {/* Public Sale Price */}
        <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Coins className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-pixel text-lg text-blue-400">Public Price</h3>
          </div>
          <div className="text-3xl font-pixel text-shibutis-text mb-2">
            {mintInfo.mintPrice} ETH
          </div>
          <div className="text-sm text-shibutis-subtitle">
            Per NFT
          </div>
        </div>

        {/* Presale Price */}
        <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-pixel text-lg text-purple-400">Presale Price</h3>
          </div>
          <div className="text-3xl font-pixel text-shibutis-text mb-2">
            {mintInfo.presalePrice} ETH
          </div>
          <div className="text-sm text-shibutis-subtitle">
            {mintInfo.presalePrice === '0.0' ? 'FREE for allowlist!' : 'Allowlist only'}
          </div>
        </div>
      </div>

      {/* Mint Progress Bar */}
      <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-pixel text-lg text-shibutis-primary">Mint Progress</h3>
          <div className="flex items-center gap-2 text-sm text-shibutis-subtitle">
            <Shield size={16} className="text-shibutis-primary" />
            <span>Live from blockchain</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-shibutis-subtitle">Progress</span>
            <span className="text-shibutis-text font-pixel">
              {mintInfo.totalSupply.toLocaleString()} / {mintInfo.maxSupply.toLocaleString()}
            </span>
          </div>
          
          <div className="w-full bg-shibutis-dark rounded-full h-4 border border-shibutis-border/30 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-shibutis-primary to-shibutis-orange rounded-full transition-all duration-1000 relative"
              style={{ width: `${Math.min(mintInfo.mintProgress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-2xl font-pixel text-shibutis-primary">
              {mintInfo.mintProgress.toFixed(1)}%
            </span>
            <span className="text-shibutis-subtitle text-sm ml-2">completed</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Collection Status */}
        <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-shibutis-primary" />
            <h3 className="font-pixel text-lg text-shibutis-primary">Collection Status</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-shibutis-subtitle">Reveal Status:</span>
              <span className={`font-pixel ${mintInfo.revealed ? 'text-green-400' : 'text-shibutis-orange'}`}>
                {mintInfo.revealed ? 'Revealed' : 'Hidden'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-shibutis-subtitle">Max Supply:</span>
              <span className="text-shibutis-text font-mono">{mintInfo.maxSupply.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-shibutis-subtitle">Current Phase:</span>
              <span className={`font-pixel ${
                mintInfo.isPresaleActive 
                  ? 'text-shibutis-primary' 
                  : mintInfo.isPublicActive 
                  ? 'text-shibutis-orange' 
                  : 'text-gray-400'
              }`}>
                {mintInfo.salePhaseText}
              </span>
            </div>
          </div>
        </div>

        {/* Phase Information */}
        <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-shibutis-orange" />
            <h3 className="font-pixel text-lg text-shibutis-orange">Phase Information</h3>
          </div>
          <div className="space-y-3 text-sm">
            {mintInfo.isPresaleActive && (
              <>
                <div className="text-shibutis-primary font-pixel">PRESALE ACTIVE</div>
                <div className="text-shibutis-subtitle">Allowlist members can mint for {mintInfo.presalePrice} ETH</div>
              </>
            )}
            {mintInfo.isPublicActive && (
              <>
                <div className="text-shibutis-orange font-pixel">PUBLIC SALE ACTIVE</div>
                <div className="text-shibutis-subtitle">Everyone can mint for {mintInfo.mintPrice} ETH</div>
              </>
            )}
            {mintInfo.isClosed && (
              <>
                <div className="text-gray-400 font-pixel">SALE CLOSED</div>
                <div className="text-shibutis-subtitle">Follow our social media for updates</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
