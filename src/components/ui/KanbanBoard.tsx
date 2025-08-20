import React, { ReactNode, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { clsx } from 'clsx';

interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  wipLimit?: number;
}

interface KanbanCard {
  id: string;
  title: string;
  content?: ReactNode;
  columnId: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardMove: (cardId: string, fromColumn: string, toColumn: string) => void;
  onCardClick?: (card: KanbanCard) => void;
  onAddCard?: (columnId: string) => void;
  renderCard?: (card: KanbanCard) => ReactNode;
}

interface SortableCardProps {
  card: KanbanCard;
  onCardClick?: (card: KanbanCard) => void;
  renderCard?: (card: KanbanCard) => ReactNode;
}

const SortableCard: React.FC<SortableCardProps> = ({
  card,
  onCardClick,
  renderCard,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow',
        isDragging && 'opacity-50'
      )}
      onClick={() => onCardClick?.(card)}
    >
      {renderCard ? renderCard(card) : (
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-1">{card.title}</h4>
          {card.content}
        </div>
      )}
    </div>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  cards,
  onCardMove,
  onCardClick,
  onAddCard,
  renderCard,
}) => {
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find(c => c.id === event.active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveCard(null);
      return;
    }

    const activeCard = cards.find(c => c.id === active.id);
    const overColumnId = over.id as string;

    if (activeCard && activeCard.columnId !== overColumnId) {
      onCardMove(activeCard.id, activeCard.columnId, overColumnId);
    }

    setActiveCard(null);
  };

  const getColumnCards = (columnId: string) => 
    cards.filter(card => card.columnId === columnId);

  const isWipLimitExceeded = (column: KanbanColumn) => {
    if (!column.wipLimit) return false;
    return getColumnCards(column.id).length >= column.wipLimit;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {columns.map((column) => {
          const columnCards = getColumnCards(column.id);
          const isWipExceeded = isWipLimitExceeded(column);

          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <Badge variant={isWipExceeded ? 'error' : 'secondary'}>
                    {columnCards.length}
                    {column.wipLimit && ` / ${column.wipLimit}`}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {onAddCard && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddCard(column.id)}
                      disabled={isWipExceeded}
                    >
                      <Plus size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </div>

              <SortableContext
                items={columnCards.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[200px]">
                  {columnCards.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      onCardClick={onCardClick}
                      renderCard={renderCard}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 rotate-3">
            {renderCard ? renderCard(activeCard) : (
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">{activeCard.title}</h4>
                {activeCard.content}
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};