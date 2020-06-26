import React from 'react';
import InfoDropDown from './info-dropdown';
import Header from './header';

class ViewInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: '',
      imageUrls: ''
    };
  }

  componentDidMount() {
    this.fetchInfo();
  }

  fetchInfo() {
    fetch(`/api/breeds/${this.props.currentBreed}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ info: data });
        fetch(`https://dog.ceo/api/breed/${data.apiKeyWord}/images/random/3`)
          .then(res => res.json())
          .then(data => this.setState({ imageUrls: data.message }));
      })
      .catch(err => console.error(err));
  }

  render() {
    const { info, imageUrls } = this.state;
    const noDataText = 'No data found on the database.';
    let currentBreedImages;
    if (imageUrls) {
      currentBreedImages = imageUrls.map((url, index) => {
        return (
          <img src={url} key={index}
            className={`img-thumbnail
             img-fluid view-info-image`} />
        );
      });
    }
    return (
      <div>
        <Header pageName="Breeds" />
        <InfoDropDown title={ info.name }
          description={info.shortDescription}
          imageUrl={info.imageUrl || './images/user-icon.png'}>
        </InfoDropDown>
        <InfoDropDown title={'History'}
          description={info.historicalUsage || noDataText}
          imageUrl={info.imageUrl || './images/user-icon.png'}>
        </InfoDropDown>
        <InfoDropDown title={'Temper'}
          description={info.temperament || noDataText}
          imageUrl={info.imageUrl || './images/user-icon.png'}>
        </InfoDropDown>
        <InfoDropDown title={'Photos'}
          description={ currentBreedImages }
          imageUrl={info.imageUrl || './images/user-icon.png'}>
        </InfoDropDown>

      </div>
    );
  }
}

export default ViewInfo;