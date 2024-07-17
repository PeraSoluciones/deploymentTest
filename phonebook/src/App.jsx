import { useEffect, useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [copyPersons, setCopyPersons] = useState([]);
  const [message, setMessage] = useState(null);

  const initialState = () => {
    personService.getAll().then((initialState) => {
      setPersons(initialState);
      setCopyPersons(initialState);
    });
  };

  const resetFormFields = () => {
    setNewName('');
    setNewNumber('');
  };

  useEffect(() => initialState(), []);

  const addRegister = (event) => {
    event.preventDefault();
    const objectPerson = {
      name: newName,
      number: newNumber,
    };
    const personFounded = hasName(newName);
    if (personFounded) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      )
        personService
          .update(personFounded.id, objectPerson)
          .then((updatedPerson) => {
            const updatedPersons = persons.map((person) =>
              person.id != personFounded.id ? person : updatedPerson
            );
            setPersons(updatedPersons);
            setCopyPersons(updatedPersons);
            resetFormFields();
          })
          .catch((error) => {
            setMessage({
              error: `Information of ${personFounded.name} has already been removed from server`,
            });
            setTimeout(() => setMessage(null), 2000);
            filterPerson(personFounded.id);
          });
    } else {
      personService.create(objectPerson).then((newPerson) => {
        const newPersons = persons.concat(newPerson);
        setPersons(newPersons);
        setCopyPersons(newPersons);
        resetFormFields();
        setMessage({ success: `Added ${newPerson.name}` });
        setTimeout(() => setMessage(null), 2000);
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    const value = event.target.value;
    setFilter(value);
    setCopyPersons(
      persons.filter((person) =>
        person.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);
    if (confirm(`Delete ${person.name}?`))
      personService.remove(id).then((person) => filterPerson(person.id));
  };
  const hasName = (name) => {
    return persons.find(
      (persons) => persons.name.toLowerCase() === name.toLowerCase()
    );
  };

  const filterPerson = (id) => {
    const newPersons = persons.filter((person) => person.id !== id);
    setPersons(newPersons);
    setCopyPersons(newPersons);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>add new register</h2>
      <PersonForm
        addRegister={addRegister}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={copyPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
