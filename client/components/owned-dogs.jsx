import React from 'react';
import Accordion from './accordion';
import Header from './header';
import Loading from './loading';
import DeleteModal from './delete-modal';
import { Link } from 'react-router-dom';

export default class OwnedDogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownedDogs: [],
      selectedDog: null,
      value: '',
      isLoading: true
    };
    this.handleLongPress = this.handleLongPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  componentDidMount() {
    this.getDogInfo();
  }

  cancelEdit() {
    this.setState({ selectedDog: null, value: '' });
  }

  handleChange(e) {
    this.setState({ value: e.currentTarget.value });
  }

  handleUpdate(e) {
    if (this.state.value) {
      fetch(`/api/owned-dogs/${this.props.userId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dogId: this.state.selectedDog[0],
          name: this.state.value,
          breedId: this.state.selectedDog[2]
        })
      })
        .then(response => response.json())
        .then(dog => {
          const dogs = this.state.ownedDogs;
          const dogIndex = dogs.indexOf(dogs.find(object => {
            return object.ownedDogId === dog.ownedDogId;
          }));
          dogs.splice(dogIndex, 1, dog);
          this.setState({ ownedDogs: dogs, selectedDog: null, value: '' });
        })
        .catch(err => console.error(err));
    } else {
      this.setState({ selectedDog: null, value: '' });
    }
  }

  handleDelete() {
    fetch(`/api/owned-dogs/${this.props.userId}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dogId: this.state.selectedDog[0] })
    })
      .then(response => response.json())
      .then(dog => {
        const dogs = this.state.ownedDogs;
        const dogIndex = dogs.indexOf(dogs.find(object => {
          return object.ownedDogId === dog.ownedDogId;
        }));
        dogs.splice(dogIndex, 1);
        this.setState({ ownedDogs: dogs, selectedDog: null, value: '' });
      })
      .catch(err => console.error(err));
  }

  getDogInfo() {
    fetch(`/api/owned-dogs/${this.props.userId}`)
      .then(response => response.json())
      .then(dogs => {
        this.setState({ ownedDogs: dogs, isLoading: false });
      })
      .catch(err => console.error(err));
  }

  renderDogInfo() {
    const dogs = this.state.ownedDogs.map((dog, index) => {
      const breed = dog.breed;
      const breedWords = breed.split(' ');
      const capitalizedWords = breedWords.map(word => word[0].toUpperCase() + word.slice(1));
      const capitalizedBreed = capitalizedWords.join(' ');
      const pawprint = index ? <i className="fas fa-paw text-center pb-3"></i> : '';
      return (
        <div className="d-flex flex-column justify-content-center" key={dog.ownedDogId}>
          {pawprint}
          <Accordion
            callback={this.handleLongPress}
            getDogName={this.getDogName}
            imageUrl={dog.imageUrl}
            dogName={dog.name}
            dogId={dog.ownedDogId}
            breedId={dog.breedId}
            breedName={capitalizedBreed}
            shortDescription={dog.shortDescription}
            changeCurrentBreed={this.props.changeCurrentBreed}
            changeCurrentDog={this.props.changeCurrentDog}
          />
        </div>
      );
    });

    return this.state.selectedDog
      ? (
        <div className='text-center'>
          <div className='d-flex align-items-baseline'>
            <button onClick={this.cancelEdit} className='btn close-button m-1'><i className="fas fa-times"></i></button>
            <label htmlFor='col-8 editInput'>
              <input className='form-control btn-light' onChange={this.handleChange} value={this.state.value} id='editInput' type='text' placeholder={this.state.selectedDog[1]} />
            </label>
            <button onClick={this.handleUpdate} className='btn m-1 btn-secondary'>Update</button>
          </div>
          <DeleteModal
            buttonLabel={`Delete ${this.state.selectedDog[1]}`}
            dog={this.state.selectedDog}
            deleteHandler={this.handleDelete} />
          {dogs}
        </div >
      )
      : dogs;
  }

  renderDogInfoDesktop() {
    const dogs = this.state.ownedDogs.map((dog, index) => {
      const breed = dog.breed;
      const breedWords = breed.split(' ');
      const capitalizedWords = breedWords.map(word => word[0].toUpperCase() + word.slice(1));
      const capitalizedBreed = capitalizedWords.join(' ');
      const pawprint = index ? <i className="fas fa-paw text-center pb-3"></i> : '';
      return (
        <div className="d-flex flex-column justify-content-center" key={dog.ownedDogId}>
          <div className='text-center'>
            {pawprint}
          </div>
          < div className='d-flex m-2 align-items-center justify-content-center' >
            <img src={dog.imageUrl} className='col-5' />
            <div className='col-5'>
              <h4>{dog.name}</h4>
              <div className='text-center'>
                <p>Breed: {capitalizedBreed}</p>
                <p>Short Description: {dog.shortDescription}</p>
                <div className="d-flex flex-column align-items-center">
                  <Link className="btn btn-sm btn-light mb-1" to="/ViewInfo"
                    onClick={() => this.props.changeCurrentBreed(dog.breed)}>
                    <span>Learn more about {capitalizedBreed}s</span>
                  </Link>
                  <Link className="btn btn-sm btn-light mb-1" to="/ViewPhotos"
                    onClick={() => this.props.changeCurrentDog(dog.ownedDogId)}>
                    <span>{`View photos of ${dog.name}`}</span>
                  </Link>
                </div>
                <DeleteModal buttonLabel={`Delete ${dog.name}`} dog={[dog.ownedDogId, dog.name]} deleteHandler={this.handleDelete} />
              </div>
            </div>
          </div>
        </div>
      );
    });
    return dogs;
  }

  handleLongPress(dogId, dogName, breedId) {
    this.setState({ selectedDog: [dogId, dogName, breedId] });
  }

  render() {
    return this.state.isLoading
      ? <Loading />
      : this.state.ownedDogs.length > 0
        ? (
          <div>
            <div className='container-fluid d-flex justify-content-center flex-wrap align-content-between d-lg-none'>
              <Header pageName="My Dogs" />
              <div className='d-flex flex-column w-100'>
                {this.renderDogInfo()}
              </div>
            </div>
            <div className='d-none d-lg-block'>
              <Header />
              <div className='d-flex flex-column w-100'>
                {this.renderDogInfoDesktop()}
              </div>
            </div>
          </div>
        )
        : <div>
          <div className="p-0 text-left col-12 mb-2">
            <Header pageName="My Dogs" />
          </div>
          <h1>No Saved Dogs</h1>;
        </div>;
  }
}
