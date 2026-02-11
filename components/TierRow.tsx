import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Tier, Item } from '../types';
import ItemCard from './ItemCard';
import { Settings } from 'lucide-react';

interface TierRowProps {
  tier: Tier;
  items: Item[];
  onUpdateTitle: (tierId: string, newTitle: string) => void;
  onUpdateColor: (tierId: string, newColor: string) => void;
  onDeleteItem: (itemId: string) => void;
}

const COLORS = [
  { label: 'Rose', class: 'bg-rose-500' },
  { label: 'Orange', class: 'bg-orange-400' },
  { label: 'Amber', class: 'bg-amber-400' },
  { label: 'Emerald', class: 'bg-emerald-400' },
  { label: 'Blue', class: 'bg-blue-400' },
  { label: 'Violet', class: 'bg-violet-500' },
  { label: 'Gray', class: 'bg-slate-500' },
  { label: 'Black', class: 'bg-black' },
];

const TierRow: React.FC<TierRowProps> = ({ tier, items, onUpdateTitle, onUpdateColor, onDeleteItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div 
      className="flex w-full mb-1 min-h-[8rem] bg-white dark:bg-gray-800 border-y border-r border-slate-200 dark:border-gray-700 shadow-sm first:rounded-t-lg last:rounded-b-lg overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowColorPicker(false);
      }}
    >
      {/* Tier Label Header */}
      <div 
        className={`
          ${tier.color} 
          w-24 sm:w-32 flex-shrink-0 flex flex-col justify-center items-center 
          text-center p-2 relative group select-none transition-colors duration-300
        `}
      >
        {isEditing ? (
          <textarea
            autoFocus
            className="w-full bg-transparent text-white text-lg font-bold text-center resize-none outline-none overflow-hidden"
            value={tier.title}
            onChange={(e) => onUpdateTitle(tier.id, e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <span 
            className="text-white text-lg sm:text-xl font-bold uppercase break-words w-full cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setIsEditing(true)}
          >
            {tier.title}
          </span>
        )}

        {/* Settings / Color Picker Trigger */}
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`absolute bottom-1 left-1 p-1 rounded hover:bg-black/20 text-white/50 hover:text-white transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <Settings size={14} />
        </button>

        {/* Color Picker Popover */}
        {showColorPicker && (
          <div className="absolute top-full left-0 z-20 mt-1 p-2 bg-white dark:bg-gray-800 rounded shadow-xl border dark:border-gray-600 grid grid-cols-4 gap-1 w-32">
            {COLORS.map((c) => (
              <button
                key={c.class}
                className={`${c.class} w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform`}
                onClick={() => {
                  onUpdateColor(tier.id, c.class);
                  setShowColorPicker(false);
                }}
                title={c.label}
              />
            ))}
          </div>
        )}
      </div>

      {/* Droppable Item Area */}
      <Droppable droppableId={tier.id} direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 flex flex-wrap items-center content-center p-2 gap-2 transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-gray-750' : ''}
            `}
          >
            {items.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} onDelete={onDeleteItem} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TierRow;
