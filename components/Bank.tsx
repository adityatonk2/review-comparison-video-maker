import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Item } from '../types';
import ItemCard from './ItemCard';

interface BankProps {
  items: Item[];
  onDeleteItem: (id: string) => void;
}

const Bank: React.FC<BankProps> = ({ items, onDeleteItem }) => {
  return (
    <div className="mt-6 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl p-4 bg-slate-50/50 dark:bg-gray-900/50 min-h-[140px]">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 select-none">
        Unassigned Items ({items.length})
      </h3>
      
      <Droppable droppableId="bank" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex flex-wrap gap-2 min-h-[100px] transition-colors duration-200 rounded-lg p-2
              ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
            `}
          >
            {items.length === 0 && !snapshot.isDraggingOver && (
              <div className="w-full h-24 flex items-center justify-center text-slate-400 italic">
                Drag items here to unassign them
              </div>
            )}
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

export default Bank;
