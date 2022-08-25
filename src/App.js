import './App.css';
import {useEffect, useState} from "react";
import {copyToClipboard} from "./util/copy";
import {DnD} from "./compnents/dnd";

// interface Car {
//   title: string;
//   link: URL;
//   options: Object [option]:true;
// }


//TODO: add good styling
//TODO: add copy options feature and link to JSON diff
//TODO: add remove button
//TODO: add remove all duplicate options and see diff between cars

const generateId = () => (Date.now() * Math.random()).toString();

function getCarsFromLS() {
  return localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];
}

function App() {
  const [collapsed, setCollapsed] = useState(true);

  const [cars, setCars] = useState(getCarsFromLS());
  const [carsWithUniqOptions, setCarsWithUniqOptions] = useState(null);

  const [highlightedOptions, setHighlightedOptions] = useState([]);

  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [options, setOptions] = useState('');
  const [comment, setComment] = useState('');

  const handleInputChange = (e, method) => {
    method(e.target.value);
    setError('');
  };

  const resetForm = () => {
    setTitle('');
    setLink('');
    setOptions('');
    setComment('');
  }

  const handleAddCard = () => {
    if (!title || !link || !options) {
      setError('Please fill all fields')
      return;
    }

    const newValue = [...cars, {id: generateId(), title, link, options: JSON.parse(options), comment}];
    setCars(newValue);
    resetForm();
  };

  const handleSaveToLS = (data) => {
    localStorage.setItem('data', JSON.stringify(data));
  };

  const handleDelete = (title) => {
    setCars(cars.filter(car => car.title !== title));
  }

  const handleRemoveDuplicates = () => {
    const carsCopy = JSON.parse(JSON.stringify((cars)));

    const checkIfOptionExistInAllCars = (option) => {
      return cars.every(car => Object.keys(car.options).includes(option));
    };

    carsCopy.forEach(car => {
      Object.keys(car.options).forEach(option => {
        if(!checkIfOptionExistInAllCars(option)) return;

        delete car.options[option];
      })
    });

    setCarsWithUniqOptions(carsCopy);
  };

  const isHighlighted = (option) => {
    return highlightedOptions.includes(option)
  }

  const handleOptionClick = (option) => {
    const newValue = isHighlighted(option)
        ? highlightedOptions.filter(o => o !== option)
        : [...highlightedOptions, option];

    setHighlightedOptions(newValue)
  }

  useEffect(() => {
    handleSaveToLS(cars);
  }, [cars])

  return (
    <div>
      <h1 align='center'>Cars options viewer and comparer</h1>

      <div style={style.addBar}>
        <input style={style.form.input} type="text" placeholder='enter title*' value={title} onChange={e => handleInputChange(e, setTitle)}/>
        <input style={style.form.input} type="text" placeholder='enter link*' value={link} onChange={e => handleInputChange(e, setLink)}/>
        <input style={style.form.input} type="text" placeholder='enter options*' value={options} onChange={e => handleInputChange(e, setOptions)}/>
        <button style={style.form.button} onClick={handleAddCard}>+ Add car</button>
      </div>

      <p style={style.error}>{error}</p>

      <div style={style.buttonBar}>
        <button style={style.form.button} onClick={() => setCollapsed(!collapsed)}>{collapsed ? 'Expand' : 'Collapse'}</button>
        {!carsWithUniqOptions && <button style={style.form.button} onClick={handleRemoveDuplicates}>Remove duplicates options</button>}
        {carsWithUniqOptions && <button style={style.form.button} onClick={() => setCarsWithUniqOptions(null)}>Show with all options</button>}
        {!!highlightedOptions.length && <button style={style.form.button} onClick={() => setHighlightedOptions([])}>Reset highlighted options</button>}
      </div>


      {/*{collapsed && <div style={style.cars}>*/}
      {/*  <DnD cars={cars} setCars={setCars}/>*/}
      {/*</div>}*/}

      <div style={style.cars}>
        {(carsWithUniqOptions || cars).map(car => {
          return (
              <div key={car.title} style={style.car}>
                <div style={style.carHeader}>
                  <a href={car.link} target='_blank' rel='noreferrer'>{car.title}</a>
                  <button style={style.deleteButton} onClick={() => handleDelete(car.title)}>x</button>
                  <button style={style.deleteButton} onClick={() => copyToClipboard(JSON.stringify(car.options))}>copy
                  </button>
                </div>

                {!collapsed && <div style={style.options}>
                  {Object.keys(car.options).map((option) => {
                    return (
                        <div
                            key={`${car.title}-${option}`}
                            style={style.option}
                            onClick={() => handleOptionClick(option)}
                        >
                          <span style={isHighlighted(option) ? style.highlighted : undefined}>- {option}</span>
                        </div>
                    )
                  })}
                </div>}
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;


const style = {
  form: {
    input: {marginLeft: '5px', padding: '5px'},
    button: {marginLeft: '5px', padding: '5px'},
  },

  buttonBar: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px'
  },

  addBar: {display: 'flex', alignItems: 'center', justifyContent: 'center'},
  cars: {overflowX: 'auto', display: 'flex', justifyContent: 'center'},
  car: {minWidth: '300px', maxWidth: '300px', border: '1px solid black', margin: '3px'},
  carHeader: {borderBottom: '1px solid black', padding: '5px'},
  title: {},
  options: {padding: '5px'},
  option: {fontSize: '12px', cursor: 'pointer'},
  error: {color: 'red', height: '15px', textAlign: 'center'},
  deleteButton: {marginLeft: '10px', background: 'none', border: '1px solid black', borderRadius: '5px'},
  highlighted: {background: 'lightblue'}
}

//https://www.mdecoder.com/decode/wba5v91010fh12105