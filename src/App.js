import './App.css';
import {useEffect, useState} from "react";

// interface Car {
//   title: string;
//   link: URL;
//   options: Object [option]:true;
// }


//TODO: add good styling
//TODO: add copy options feature and link to JSON diff
//TODO: add remove button
//TODO: add remove all duplicate options and see diff between cars


function getCarsFromLS() {
  return localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];
}

function App() {
  const [cars, setCars] = useState(getCarsFromLS());

  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [options, setOptions] = useState('');

  const handleInputChange = (e, method) => {
    method(e.target.value);
    setError('');
  };

  const handleAddCard = () => {
    if (!title || !link || !options) {
      setError('Please fill all fields')
      return;
    }

    setCars([...cars, {title, link, options: JSON.parse(options)}]);

    setTitle('');
    setLink('');
    setOptions('');
  };

  const handleSaveToLS = (data) => {
    localStorage.setItem('data', JSON.stringify(data));
  };

  const handleDelete = (title) => {
    setCars(cars.filter(car => car.title !== title));
  }

  const handleRemoveDuplicates = () => {
    // setCars(cars.map(car => {
    //   return {
    //     ...car,
    //     options: car
    //   }
    // }))
  }

  useEffect(() => {
    handleSaveToLS(cars);
  }, [cars])

  return (
    <div>
      <h1 align='center'>Cars options viewer and comparer</h1>

      <div style={style.addBar}>
        <input type="text" placeholder='enter title' value={title} onChange={e => handleInputChange(e, setTitle)}/>
        <input type="text" placeholder='enter link' value={link} onChange={e => handleInputChange(e, setLink)}/>
        <input type="text" placeholder='enter options' value={options} onChange={e => handleInputChange(e, setOptions)}/>
        <button onClick={handleAddCard}>Add car</button>
        <button onClick={handleRemoveDuplicates}>Remove duplicates options</button>
      </div>

      <p style={style.error}>{error}</p>

      <div style={style.cars}>
        {cars.map(car => {
          return (
              <div style={style.car}>
                <div style={style.carHeader}>
                  <a href={car.link} target='_blank' rel='noreferrer'>{car.title}</a>
                  <button style={style.deleteButton} onClick={() => handleDelete(car.title)}>x</button>
                </div>

                <div style={style.options}>
                  {Object.keys(car.options).map((option) => {
                    return <div style={style.option}>- {option}</div>
                  })}
                </div>
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;


const style = {
  addBar: {display: 'flex', alignItems: 'center', justifyContent: 'center'},
  cars: {overflowX: 'auto', display: 'flex'},
  car: {minWidth: '300px', border: '1px solid black', margin: '3px'},
  carHeader: {borderBottom: '1px solid black', padding: '5px'},
  title: {},
  options: {padding: '5px'},
  option: {fontSize: '12px'},
  error: {color: 'red', height: '20px'},
  deleteButton: {marginLeft: '10px', background: 'none', border: '1px solid black', borderRadius: '5px'}
}