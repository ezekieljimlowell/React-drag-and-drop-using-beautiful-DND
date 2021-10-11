import React, { useState, useRef, useEffect } from "react";
import { DragHandle } from "./partials/DragHandle";
import { ListContainer, ListItem } from "./styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const App = () => {
  let [addButtonArray, setArray] = useState([]);
  let [places, setPlaces] = useState("");
  let [origin, setOrigin] = useState("");
  let [destination, setDestination] = useState("");
  let handleAddInput = (e) => {
    e.preventDefault();
    setArray([...addButtonArray,
    { name: `Stop ${addButtonArray.length + 1}`, id: addButtonArray.length++ }]);
  };

  let handleDelete = (e) => {
    e.preventDefault();
    const nonMutable = [...addButtonArray];
    nonMutable.splice(nonMutable.indexOf(), 1);
    setArray(nonMutable);
  };

  const objMethod = {
    array: addButtonArray,
    getList: function () {
      return (
        (localStorage.getItem("list1") &&
          JSON.parse(localStorage.getItem("list1"))) ||
        this.array
      );
    },
    saveList: (array) => {
      localStorage.setItem("list1", JSON.stringify(array));
    },
  }
  const list = objMethod.getList();

  const [isEditing, setEditing] = useState(false);
  const toggleEditing = () => {
    setEditing(!isEditing);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  let handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setPlaces([
      ...places,
      {[name]: value}
    ]);
    console.log(places,name,value);
  }
  

  let handleChangeOrigin = (e) => {
    e.preventDefault();
    setOrigin(e.target.value);
  }

  let handleChangeDestination = (e) => {
    e.preventDefault();
    setDestination(e.target.value);
  }

  return (
    <div>
      <input
        name="origin"
        type="text"
        onChange={handleChangeOrigin}
        value={origin}
        placeholder="origin"
      />
      <DragDropContext
        onDragEnd={(param) => {
          const srcI = param.source.index;
          const desI = param.destination?.index;
          list.splice(desI, 0, list.splice(srcI, 1)[0]);
          objMethod.saveList(list);
        }}
      >
        <ListContainer>
          <Droppable droppableId="droppable-1">
            {(provided, _) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {addButtonArray.map((item, i) => {
                  return (
                    <div>
                      <Draggable
                        key={item.id}
                        draggableId={"draggable-" + item.id}
                        index={item.id}
                      >
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              boxShadow: snapshot.isDragging
                                ? "0 0 .4rem #666"
                                : "none",
                            }}
                          >
                            <div>
                              <div>{item.name}</div>
                              <input
                                name={item.name}
                                type="text"
                                onChange={handleChange}
                                value={places.name}
                                placeholder="City, Province/State, Postalcode"
                                ref={inputRef}
                              />
                              <button type="button" onClick={toggleEditing}>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.52533 1.34608L8.52533 1.34608C9.18673 0.684667 10.2633 0.6846 10.9243 1.34612L11.653 2.07492L8.52533 1.34608ZM8.52533 1.34608L1.96613 7.90597M8.52533 1.34608L1.96613 7.90597M0.994591 12.0054L0.994271 12.0051L0.994272 12.0051C0.868487 11.8785 0.819474 11.6937 0.869046 11.5206L1.01325 11.5619L0.869018 11.5207L0.994591 12.0054ZM0.994591 12.0054C1.08892 12.0997 1.2147 12.15 1.34381 12.15C1.38867 12.15 1.4345 12.144 1.47963 12.1309C1.47985 12.1308 1.48007 12.1308 1.48029 12.1307L4.88039 11.159C4.8805 11.159 4.88061 11.1589 4.88072 11.1589C4.96148 11.136 5.03517 11.0926 5.09447 11.0333L4.99003 10.9289M0.994591 12.0054L4.99003 10.9289M4.99003 10.9289L5.09447 11.0333L11.653 4.47405M4.99003 10.9289L11.653 4.47405M1.96613 7.90597C1.96613 7.90598 1.96613 7.90598 1.96612 7.90598M1.96613 7.90597L1.96612 7.90598M1.96612 7.90598C1.90715 7.96495 1.86356 8.03804 1.84052 8.11929M1.96612 7.90598L1.84052 8.11929M1.84052 8.11929C1.8405 8.11937 1.84048 8.11945 1.84046 8.11952L1.98479 8.16037L1.84056 8.11917L1.84052 8.11929ZM11.653 4.47405C11.9737 4.15392 12.15 3.72738 12.15 3.27448C12.15 2.82163 11.9738 2.39513 11.6531 2.07501L11.653 4.47405ZM10.9558 2.77345L10.9559 2.77363C11.09 2.9073 11.1634 3.08499 11.1635 3.2747C11.163 3.46377 11.0894 3.64141 10.9552 3.77608C10.9552 3.77612 10.9551 3.77617 10.9551 3.77621L10.3324 4.39891L8.60091 2.66739L9.22377 2.04452C9.4998 1.76847 9.95 1.76862 10.2269 2.04461C10.227 2.04464 10.227 2.04466 10.227 2.04469L10.9558 2.77345ZM9.63449 5.09682L4.48603 10.2454L2.06177 10.9377L2.75455 8.5139L7.90301 3.3653L9.63449 5.09682Z" fill="#393939" stroke="#393939" stroke-width="0.3" />
                                </svg>
                              </button>
                              <button type="button" onClick={handleDelete}>
                                Delete
                              </button>
                              <DragHandle {...provided.dragHandleProps} />
                            </div>
                          </ListItem>
                        )}
                      </Draggable>
                    </div>)
                })}
                {provided.placeholder}
                <button type="button" onClick={handleAddInput}>Add Stop</button>
              </div>
            )}
          </Droppable>
        </ListContainer>
      </DragDropContext>
      <input
        name="destination"
        type="text"
        onChange={handleChangeDestination}
        value={destination}
        placeholder="destination"
      />
    </div>
  );
};

export default App;
