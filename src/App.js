import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import TotalIuran from './Components/Iuran'
import TenagaKerja from './Components/TenagaKerja'

class App extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 3000
    }
    return (
      <div className="App">
        <Slider {...settings}>
          <div>
            <TotalIuran />
          </div>
          <div>
            <TenagaKerja />
          </div>
        </Slider>
      </div>
    );
  }
}

export default App;
