import React from 'react';

class MainView extends React.Component {
  render() {
    const { handleView } = this.props;
    return (
      <div className={`container-fluid d-flex justify-content-center
      flex-wrap align-content-between`}>
        <div className="main-portrait-container col-9">
          <img src="./images/hello.jpg" alt=""
            className={`rounded-circle img-thumbnail
            img-fluid`} />
        </div>

        <div className='main-buttons-container d-flex flex-wrap'>

          <button type="button"
            className={`btn btn-primary btn-lg btn-block my-4
            my-dogs-button`}
            onClick={handleView}>
            My Dogs
          </button>

          <button type="button"
            className={`btn btn-primary btn-lg btn-block my-4
            scan-button`}
            onClick={handleView}>
            Scan
          </button>

          <button type="button"
            className={`btn btn-primary btn-lg btn-block my-4
            upload-button`}
            onClick={handleView}>
            Upload
          </button>

          <button type="button"
            className={`btn btn-primary btn-lg btn-block my-4
            browse-button`}
            onClick={handleView}>
            Browse
          </button>

        </div>
      </div>
    );

  }
}

export default MainView;