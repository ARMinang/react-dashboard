import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import TotalIuran from './Components/Iuran'
import TenagaKerja from './Components/TenagaKerja'
import Npp from './Components/Npp'
import {
  Header,
  Container,
  Responsive,
  Visibility,
  Segment,
} from 'semantic-ui-react'

const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      title: "Penerimaan Iuran"
    }
  }
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 3000,
      beforeChange: (currentIndex, nextIndex) => {
        switch(nextIndex) {
          case 0:
            this.setState({ title: "Penerimaan Iuran"})
            break
          case 1:
            this.setState({ title: "Penambahan TK"})
            break
          case 2:
            this.setState({ title: "Akuisisi NPP"})
            break
          default:
            this.setState({ title: "Dashboard Pekanbaru Kota"})
        }
      }
    }
    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            color="blue"
            inverted
            style={{ padding: '1em 0em' }}
            vertical
          >
            <Container textAlign="center">
              <Header
                as="h1"
                inverted
                content={this.state.title}
              />
            </Container>
          </Segment>
        </Visibility>
        <div className="App">
          <Slider {...settings}>
            <div>
              <TotalIuran />
            </div>
            <div>
              <TenagaKerja />
            </div>
            <div>
              <Npp />
            </div>
          </Slider>
        </div>
      </Responsive>
    );
  }
}

export default App;
