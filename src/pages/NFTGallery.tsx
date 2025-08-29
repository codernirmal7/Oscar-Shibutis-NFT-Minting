import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  ExternalLink,
  User,
  Star,
  Zap,
  Crown,
  Shield,
  Copy,
  CheckCircle,
  SortAsc,
  SortDesc,
  X,
} from 'lucide-react';

// ===== Types =====
type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

type Traits = {
  background: string;
  body: string;
  eyes: string;
  accessory: string;
  rarity: Rarity;
};

type NFT = {
  id: number;
  name: string;
  image: string;
  owner: string;
  traits: Traits;
  rarityScore: number;
  lastSale: number; // ETH
  mintDate: string; // ISO
};

type SortBy = 'id' | 'rarity' | 'price';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

// ===== Component =====
const NFTGallery: React.FC = () => {
  // Mock NFT data
  const [nfts] = useState<NFT[]>([
    {
      id: 1,
      name: 'Shibutis #001',
      image: '/images/home-nft1.jpg',
      owner: '0x742d35Cc6634C0532925a3b8D47de5a5d2b92e5c',
      traits: {
        background: 'Cosmic Blue',
        body: 'Golden',
        eyes: 'Laser Red',
        accessory: 'Crown',
        rarity: 'Legendary',
      },
      rarityScore: 95.2,
      lastSale: 2.5,
      mintDate: '2024-01-15',
    },
    {
      id: 23,
      name: 'Shibutis #023',
      image: '/images/home-nft1.jpg',
      owner: '0x8ba1f109551bD432803012645Hac136c5c8b2e5c',
      traits: {
        background: 'Forest Green',
        body: 'Silver',
        eyes: 'Diamond Blue',
        accessory: 'Sword',
        rarity: 'Epic',
      },
      rarityScore: 78.5,
      lastSale: 1.8,
      mintDate: '2024-01-16',
    },
    {
      id: 156,
      name: 'Shibutis #156',
      image: '/images/home-nft1.jpg',
      owner: '0x9cd2462048b9a3b8D47de5a5d2b92e5c742d35Ca',
      traits: {
        background: 'Sunset Orange',
        body: 'Platinum',
        eyes: 'Fire Orange',
        accessory: 'Shield',
        rarity: 'Rare',
      },
      rarityScore: 65.8,
      lastSale: 1.2,
      mintDate: '2024-01-17',
    },
    {
      id: 247,
      name: 'Shibutis #247',
      image: '/images/home-nft1.jpg',
      owner: '0x456d35Cc6634C0532925a3b8D47de5a5d2b92123',
      traits: {
        background: 'Purple Haze',
        body: 'Bronze',
        eyes: 'Green Glow',
        accessory: 'Wings',
        rarity: 'Common',
      },
      rarityScore: 42.1,
      lastSale: 0.8,
      mintDate: '2024-01-18',
    },
    {
      id: 334,
      name: 'Shibutis #334',
      image: '/images/home-nft1.jpg',
      owner: '0x789d35Cc6634C0532925a3b8D47de5a5d2b92456',
      traits: {
        background: 'Midnight Black',
        body: 'Diamond',
        eyes: 'Purple Storm',
        accessory: 'Cape',
        rarity: 'Mythic',
      },
      rarityScore: 98.7,
      lastSale: 5.2,
      mintDate: '2024-01-19',
    },
    {
      id: 445,
      name: 'Shibutis #445',
      image: '/images/home-nft1.jpg',
      owner: '0xabcd35Cc6634C0532925a3b8D47de5a5d2b92789',
      traits: {
        background: 'Ocean Blue',
        body: 'Steel',
        eyes: 'Ice Blue',
        accessory: 'Helmet',
        rarity: 'Rare',
      },
      rarityScore: 58.3,
      lastSale: 1.1,
      mintDate: '2024-01-20',
    },
  ]);

  useEffect(()=> {
      scrollTo(0,0)
  },[])

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<'All' | Rarity>('All');
  const [selectedTrait, setSelectedTrait] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortBy>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string>('');

  // Get unique traits for filters
  const rarities: Array<'All' | Rarity> = useMemo(() => {
    const set = new Set<Rarity>(nfts.map((n) => n.traits.rarity));
    return ['All', ...Array.from(set)];
  }, [nfts]);

  const backgrounds: string[] = useMemo(() => {
    const set = new Set<string>(nfts.map((n) => n.traits.background));
    return ['All', ...Array.from(set)];
  }, [nfts]);

  // Copy address function
  const copyAddress = async (address: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Filter and sort NFTs
  const filteredAndSortedNFTs = useMemo(() => {
    const filtered = nfts.filter((nft) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        nft.name.toLowerCase().includes(q) ||
        nft.id.toString().includes(q) ||
        nft.owner.toLowerCase().includes(q);

      const matchesRarity =
        selectedRarity === 'All' || nft.traits.rarity === selectedRarity;

      const matchesTrait =
        selectedTrait === 'All' || nft.traits.background === selectedTrait;

      return matchesSearch && matchesRarity && matchesTrait;
    });

    const sorted = [...filtered].sort((a, b) => {
      let aVal: number;
      let bVal: number;
      switch (sortBy) {
        case 'id':
          aVal = a.id;
          bVal = b.id;
          break;
        case 'rarity':
          aVal = a.rarityScore;
          bVal = b.rarityScore;
          break;
        case 'price':
          aVal = a.lastSale;
          bVal = b.lastSale;
          break;
        default:
          aVal = a.id;
          bVal = b.id;
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  }, [nfts, searchQuery, selectedRarity, selectedTrait, sortBy, sortOrder]);

  const rarityTextColor: Record<Rarity, string> = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-400',
    Legendary: 'text-yellow-400',
    Mythic: 'text-pink-400',
  };

  const rarityBg: Record<Rarity, string> = {
    Common: 'bg-gray-500/10 border-gray-500/30',
    Rare: 'bg-blue-500/10 border-blue-500/30',
    Epic: 'bg-purple-500/10 border-purple-500/30',
    Legendary: 'bg-yellow-500/10 border-yellow-500/30',
    Mythic: 'bg-pink-500/10 border-pink-500/30',
  };

  const getRarityColor = (rarity: Rarity): string => rarityTextColor[rarity];
  const getRarityBg = (rarity: Rarity): string => rarityBg[rarity];

  // ----- Subcomponents -----
  const NFTCard: React.FC<{ nft: NFT }> = ({ nft }) => (
    <div className="group bg-shibutis-panel rounded-xl border border-shibutis-border hover:border-shibutis-primary/50 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-shibutis-primary/10">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Rarity badge */}
        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-pixel border ${getRarityBg(
            nft.traits.rarity
          )}`}
        >
          <span className={getRarityColor(nft.traits.rarity)}>
            {nft.traits.rarity}
          </span>
        </div>

        {/* View button */}
        <button
          type="button"
          onClick={() => setSelectedNFT(nft)}
          className="absolute top-3 right-3 w-8 h-8 bg-shibutis-dark/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-shibutis-primary hover:text-shibutis-dark"
          aria-label="View NFT details"
        >
          <Eye size={16} />
        </button>

        {/* Rarity score */}
        <div className="absolute bottom-3 right-3 bg-shibutis-dark/80 backdrop-blur-sm px-2 py-1 rounded-lg">
          <span className="text-xs text-shibutis-primary font-pixel">
            {nft.rarityScore}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-pixel text-lg text-shibutis-primary">
            {nft.name}
          </h3>
          <div className="text-sm text-shibutis-orange font-mono">#{nft.id}</div>
        </div>

        {/* Owner */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={14} className="text-shibutis-subtitle" />
            <span className="text-xs text-shibutis-subtitle">Owner:</span>
          </div>
          <button
            type="button"
            onClick={() => copyAddress(nft.owner)}
            className="flex items-center gap-1 text-xs text-shibutis-text hover:text-shibutis-primary transition-colors font-mono"
            aria-label="Copy owner address"
            title="Copy owner address"
          >
            {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
            {copiedAddress === nft.owner ? (
              <CheckCircle size={12} className="text-green-400" />
            ) : (
              <Copy size={12} />
            )}
          </button>
        </div>

        {/* Last Sale */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-shibutis-subtitle">Last Sale:</span>
          <span className="text-shibutis-text font-mono">{nft.lastSale} ETH</span>
        </div>
      </div>
    </div>
  );

  const NFTModal: React.FC<{ nft: NFT; onClose: () => void }> = ({
    nft,
    onClose,
  }) => {
    const traitKeys = ['background', 'body', 'eyes', 'accessory'] as const;
    return (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-shibutis-panel rounded-xl border border-shibutis-border max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-sm font-pixel border ${getRarityBg(
                    nft.traits.rarity
                  )}`}
                >
                  <span className={getRarityColor(nft.traits.rarity)}>
                    {nft.traits.rarity}
                  </span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 bg-shibutis-primary/10 hover:bg-shibutis-primary/20 text-shibutis-primary border border-shibutis-primary/30 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ExternalLink size={16} />
                  View on OpenSea
                </button>
                <button
                  type="button"
                  className="flex-1 bg-shibutis-orange/10 hover:bg-shibutis-orange/20 text-shibutis-orange border border-shibutis-orange/30 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Star size={16} />
                  Add to Favorites
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-pixel text-2xl text-shibutis-primary">
                  {nft.name}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 bg-shibutis-dark rounded-lg flex items-center justify-center hover:bg-shibutis-border transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Owner Info */}
              <div className="bg-shibutis-dark/50 rounded-lg p-4 border border-shibutis-border/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-pixel text-sm text-shibutis-orange">
                    OWNER
                  </h3>
                  <div className="flex items-center gap-2">
                    <Crown size={14} className="text-shibutis-primary" />
                    <span className="text-xs text-shibutis-subtitle">
                      Club Member
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-shibutis-text">
                    {nft.owner.slice(0, 10)}...{nft.owner.slice(-8)}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyAddress(nft.owner)}
                    className="flex items-center gap-1 text-xs text-shibutis-subtitle hover:text-shibutis-primary transition-colors"
                    aria-label="Copy owner address"
                  >
                    {copiedAddress === nft.owner ? (
                      <CheckCircle size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-shibutis-dark/50 rounded-lg p-3 border border-shibutis-border/30 text-center">
                  <div className="text-lg font-pixel text-shibutis-primary mb-1">
                    {nft.rarityScore}
                  </div>
                  <div className="text-xs text-shibutis-subtitle">Rarity Score</div>
                </div>
                <div className="bg-shibutis-dark/50 rounded-lg p-3 border border-shibutis-border/30 text-center">
                  <div className="text-lg font-pixel text-shibutis-orange mb-1">
                    {nft.lastSale} ETH
                  </div>
                  <div className="text-xs text-shibutis-subtitle">Last Sale</div>
                </div>
              </div>

              {/* Traits */}
              <div>
                <h3 className="font-pixel text-sm text-shibutis-primary mb-3">
                  TRAITS
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {traitKeys.map((traitKey) => (
                    <div
                      key={traitKey}
                      className="bg-shibutis-dark/30 rounded-lg p-3 border border-shibutis-border/20"
                    >
                      <div className="text-xs text-shibutis-subtitle capitalize mb-1">
                        {traitKey}
                      </div>
                      <div className="text-sm text-shibutis-text">
                        {nft.traits[traitKey]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mint Info */}
              <div className="bg-shibutis-primary/5 rounded-lg p-4 border border-shibutis-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-shibutis-primary" />
                  <span className="font-pixel text-sm text-shibutis-primary">
                    MINT INFO
                  </span>
                </div>
                <div className="text-xs text-shibutis-subtitle">
                  Minted on {new Date(nft.mintDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-shibutis-dark text-shibutis-text font-body min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-pixel text-4xl lg:text-6xl text-shibutis-primary mb-4">
            SHIBUTIS GALLERY
          </h1>
          <p className="text-shibutis-subtitle text-lg lg:text-xl max-w-2xl mx-auto">
            Explore the complete collection of minted Shibutis NFTs
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 text-center">
            <div className="text-xl font-pixel text-shibutis-primary mb-1">
              {nfts.length}
            </div>
            <div className="text-sm text-shibutis-subtitle">Total Minted</div>
          </div>
          <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 text-center">
            <div className="text-xl font-pixel text-shibutis-orange mb-1">
              {new Set(nfts.map((n) => n.owner)).size}
            </div>
            <div className="text-sm text-shibutis-subtitle">Unique Owners</div>
          </div>
          <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 text-center">
            <div className="text-xl font-pixel text-shibutis-primary mb-1">2.1</div>
            <div className="text-sm text-shibutis-subtitle">Floor Price</div>
          </div>
          <div className="bg-shibutis-panel/50 rounded-lg p-4 border border-shibutis-border/30 text-center">
            <div className="text-xl font-pixel text-shibutis-orange mb-1">156</div>
            <div className="text-sm text-shibutis-subtitle">Total Volume</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-shibutis-panel rounded-xl p-6 border border-shibutis-border mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-shibutis-subtitle"
              />
              <input
                type="text"
                placeholder="Search by ID, name, or owner address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-shibutis-dark border border-shibutis-border rounded-lg text-shibutis-text placeholder-shibutis-subtitle focus:border-shibutis-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-shibutis-primary/20 border-shibutis-primary/50 text-shibutis-primary'
                  : 'bg-shibutis-dark border-shibutis-border text-shibutis-text hover:border-shibutis-primary/30'
              }`}
            >
              <Filter size={16} />
              <span className="font-pixel text-sm">Filters</span>
            </button>

            {/* View Mode */}
            <div className="flex items-center gap-2 bg-shibutis-dark rounded-lg border border-shibutis-border p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-shibutis-primary text-shibutis-dark'
                    : 'text-shibutis-subtitle hover:text-shibutis-text'
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-shibutis-primary text-shibutis-dark'
                    : 'text-shibutis-subtitle hover:text-shibutis-text'
                }`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-shibutis-border/30">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Rarity Filter */}
                <div>
                  <label className="block text-xs text-shibutis-subtitle mb-2 font-pixel">
                    RARITY
                  </label>
                  <select
                    value={selectedRarity}
                    onChange={(e) =>
                      setSelectedRarity(e.target.value as 'All' | Rarity)
                    }
                    className="w-full bg-shibutis-dark border border-shibutis-border rounded-lg px-3 py-2 text-sm text-shibutis-text focus:border-shibutis-primary/50 focus:outline-none"
                  >
                    {rarities.map((rarity) => (
                      <option key={rarity} value={rarity}>
                        {rarity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Background Filter */}
                <div>
                  <label className="block text-xs text-shibutis-subtitle mb-2 font-pixel">
                    BACKGROUND
                  </label>
                  <select
                    value={selectedTrait}
                    onChange={(e) => setSelectedTrait(e.target.value)}
                    className="w-full bg-shibutis-dark border border-shibutis-border rounded-lg px-3 py-2 text-sm text-shibutis-text focus:border-shibutis-primary/50 focus:outline-none"
                  >
                    {backgrounds.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs text-shibutis-subtitle mb-2 font-pixel">
                    SORT BY
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full bg-shibutis-dark border border-shibutis-border rounded-lg px-3 py-2 text-sm text-shibutis-text focus:border-shibutis-primary/50 focus:outline-none"
                  >
                    <option value="id">Token ID</option>
                    <option value="rarity">Rarity Score</option>
                    <option value="price">Last Sale</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-xs text-shibutis-subtitle mb-2 font-pixel">
                    ORDER
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
                    }
                    className="w-full bg-shibutis-dark border border-shibutis-border rounded-lg px-3 py-2 text-sm text-shibutis-text hover:border-shibutis-primary/50 transition-colors flex items-center justify-center gap-2"
                  >
                    {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRarity('All');
                    setSelectedTrait('All');
                    setSortBy('id');
                    setSortOrder('asc');
                  }}
                  className="text-sm text-shibutis-subtitle hover:text-shibutis-text transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="px-6 py-4 border-t border-shibutis-border/30 bg-shibutis-dark/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-shibutis-subtitle">
              Showing {filteredAndSortedNFTs.length} of {nfts.length} NFTs
            </span>
            <div className="flex items-center gap-2 text-xs text-shibutis-subtitle">
              <Shield size={12} className="text-shibutis-primary" />
              <span>All verified on-chain</span>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="p-6">
          {filteredAndSortedNFTs.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {filteredAndSortedNFTs.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="font-pixel text-xl text-gray-400 mb-2">No NFTs Found</h3>
              <p className="text-shibutis-subtitle">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <NFTModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />
      )}
    </div>
  );
};

export default NFTGallery;
