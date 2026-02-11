import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Plus, RotateCcw, Moon, Sun, Download, Image as ImageIcon, X } from 'lucide-react';
import { AppState, Item, Tier } from './types';
import { INITIAL_DATA, generateId } from './constants';
import TierRow from './components/TierRow';
import Bank from './components/Bank';

const App: React.FC = () => {
  // State
  const [data, setData] = useState<AppState>(() => {
    const saved = localStorage.getItem('rankmaster-data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  // Persist Data
  useEffect(() => {
    localStorage.setItem('rankmaster-data', JSON.stringify(data));
  }, [data]);

  // Persist Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Drag End Handler
  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Helper to get list from ID
    const getList = (id: string) => {
      if (id === 'bank') return data.bankItemIds;
      return data.tiers[id].itemIds;
    };

    const sourceList = getList(source.droppableId);
    const destList = getList(destination.droppableId);

    // Create copies
    const newSourceList = Array.from(sourceList);
    const newDestList = source.droppableId === destination.droppableId ? newSourceList : Array.from(destList);

    // Move logic
    newSourceList.splice(source.index, 1);
    newDestList.splice(destination.index, 0, draggableId);

    const newState = { ...data };

    if (source.droppableId === 'bank') {
      newState.bankItemIds = newSourceList;
    } else {
      newState.tiers[source.droppableId] = {
        ...newState.tiers[source.droppableId],
        itemIds: newSourceList,
      };
    }

    if (destination.droppableId === 'bank') {
      newState.bankItemIds = newDestList;
    } else {
      newState.tiers[destination.droppableId] = {
        ...newState.tiers[destination.droppableId],
        itemIds: newDestList,
      };
    }

    setData(newState);
  }, [data]);

  // Actions
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newId = generateId();
    const newItem: Item = {
      id: newId,
      content: newItemName.trim(),
      imageUrl: newItemImage.trim() || undefined,
    };

    setData(prev => ({
      ...prev,
      items: { ...prev.items, [newId]: newItem },
      bankItemIds: [...prev.bankItemIds, newId]
    }));

    setNewItemName('');
    setNewItemImage('');
    setIsModalOpen(false);
  };

  const deleteItem = (id: string) => {
    if (!window.confirm('Delete this item?')) return;
    
    setData(prev => {
      // Remove from items map
      const newItems = { ...prev.items };
      delete newItems[id];

      // Remove from bank
      const newBank = prev.bankItemIds.filter(itemId => itemId !== id);

      // Remove from tiers
      const newTiers: Record<string, Tier> = {};
      Object.keys(prev.tiers).forEach(key => {
        newTiers[key] = {
          ...prev.tiers[key],
          itemIds: prev.tiers[key].itemIds.filter(itemId => itemId !== id)
        };
      });

      return {
        ...prev,
        items: newItems,
        bankItemIds: newBank,
        tiers: newTiers
      };
    });
  };

  const updateTierTitle = (tierId: string, newTitle: string) => {
    setData(prev => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [tierId]: { ...prev.tiers[tierId], title: newTitle }
      }
    }));
  };

  const updateTierColor = (tierId: string, newColor: string) => {
    setData(prev => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [tierId]: { ...prev.tiers[tierId], color: newColor }
      }
    }));
  };

  const resetAll = () => {
    if (!window.confirm("Reset all items to unassigned?")) return;
    
    // Move all item IDs to bank
    const allItemIds = Object.keys(data.items);
    
    // Clear tiers
    const emptyTiers = { ...data.tiers };
    Object.keys(emptyTiers).forEach(key => {
      emptyTiers[key].itemIds = [];
    });

    setData({
      ...data,
      tiers: emptyTiers,
      bankItemIds: allItemIds
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-slate-50 dark:bg-gray-950 transition-colors duration-200">
      
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg rotate-3">
            <RotateCcw className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              RankMaster
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Drag. Drop. Rank.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-750 transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-gray-800 dark:text-yellow-400 dark:border-gray-700 dark:hover:bg-gray-750 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-transform active:scale-95"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </header>

      {/* Main Board */}
      <div className="w-full max-w-5xl">
        <DragDropContext onDragEnd={onDragEnd}>
          
          {/* Tier List */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-gray-800">
            {data.tierOrder.map(tierId => {
              const tier = data.tiers[tierId];
              const items = tier.itemIds.map(itemId => data.items[itemId]);
              
              return (
                <TierRow
                  key={tier.id}
                  tier={tier}
                  items={items}
                  onUpdateTitle={updateTierTitle}
                  onUpdateColor={updateTierColor}
                  onDeleteItem={deleteItem}
                />
              );
            })}
          </div>

          {/* Bank / Unassigned */}
          <Bank 
            items={data.bankItemIds.map(id => data.items[id])} 
            onDeleteItem={deleteItem} 
          />

        </DragDropContext>
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-slate-400 dark:text-gray-600 text-sm">
        <p>Pro Tip: Click tier names to edit them. Click the gear icon to change colors.</p>
        <p className="mt-1">Changes are saved automatically.</p>
      </footer>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Item</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddItem}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={30}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-750 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g., Cyberpunk 2077"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Image URL (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="url"
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-750 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Leaves empty for a text-only card.</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
