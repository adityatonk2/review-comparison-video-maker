import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Item } from '../types';
import { Trash2, GripVertical } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  index: number;
  onDelete: (id: string) => void;
  isDragDisabled?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, index, onDelete, isDragDisabled = false }) => {
  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            relative group flex flex-col items-center justify-between
            w-24 h-28 m-1 p-2 rounded-lg shadow-sm border
            transition-all duration-200 ease-in-out
            ${snapshot.isDragging 
              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 scale-105 shadow-xl z-50' 
              : 'bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 hover:shadow-md'
            }
          `}
        >
          {/* Image or Placeholder */}
          <div className="w-16 h-16 rounded overflow-hidden bg-slate-100 dark:bg-gray-700 flex-shrink-0 mb-2">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.content} 
                className="w-full h-full object-cover pointer-events-none" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <GripVertical size={20} />
              </div>
            )}
          </div>

          {/* Content Text */}
          <span className="text-xs font-semibold text-center text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight w-full break-words">
            {item.content}
          </span>

          {/* Delete Button (Visible on Hover) */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag start
              onDelete(item.id);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
            title="Delete item"
            aria-label="Delete item"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default ItemCard;
