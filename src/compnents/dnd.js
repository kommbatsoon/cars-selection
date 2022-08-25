import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const grid = 4;

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,
    ...draggableStyle,
});
const getListStyle = () => ({
    display: 'flex',
    padding: grid,
    overflow: 'auto',
});

export const DnD = ({cars, setCars}) => {
    const onDragEnd = (result) => {
        if (!result.destination) return; // dropped outside the list

        const items = reorder(cars, result.source.index, result.destination.index);
        setCars(items);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                    >
                        {cars.map((car, index) => (
                            <Draggable key={car.id} draggableId={car.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        <div key={car.id} style={style.car}>
                                            <div style={style.carHeader}>
                                                <a href={car.link} target='_blank' rel='noreferrer'>{car.title}</a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

const style = {
    car: {minWidth: '300px', maxWidth: '300px', border: '1px solid black', margin: '3px'},
    carHeader: {borderBottom: '1px solid black', padding: '5px'},
}
