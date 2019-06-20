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
import axios from 'axios'
import moment from 'moment'
import localization from 'moment/locale/id'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { bold } from 'ansi-colors';

const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const createChartData = (labels, label, data) => {
  return {
    labels: labels,
      datasets: [
        {
          label: label,
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.4)',
            'rgba(54, 162, 235, 0.4)',
            'rgba(255, 206, 86, 0.4)',
            'rgba(75, 192, 192, 0.4)',
            'rgba(153, 102, 255, 0.4)',
            'rgba(255, 159, 64, 0.4)'
            ],
          borderWidth: 1,
          data: data
        }
      ]
  }
}

const chartOptions = {
  maintainAspectRatio: false,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero:true,
        callback: function(value, index, values) {
          return value.toLocaleString('en');
        },
      }
    }]
  },
  legend: false,
  plugins: {
    datalabels: {
      formatter: (value, ctx) => {
        return value !== 0 ?
          value.toLocaleString('id') :
          'N/A'
      },
      anchor: 'end',
      align: 'start',
      color: 'gray',
      font: {
        size: 20,
        style: bold
      }
    }
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      title: "Penerimaan Iuran",
      iuranData: {chartData: {}},
      tkData: {chartData: {}},
      nppData: { chartData: {}}
    }
  }

  componentWillMount() {
    this.generateIuran()
  }

  generateIuran = () => {
    this.setState({ title: "Penerimaan Iuran"})
    axios.get('http://127.0.0.1:8000/api/iuran/')
    .then(res => {
      const allIurans = res.data
      let iuran = []
      let bulan = []
      allIurans.forEach(allIuran => {
        iuran.push(allIuran.jml_bayar)
        bulan.push(moment(allIuran.month).locale('id', localization).format('MMMM'))
      })
      const add = (a, b) => a + b
      const total_iuran = iuran.reduce(add)
      const lastMonth = bulan[bulan.length - 1]
      const lastIuran = iuran[iuran.length - 1]
      const chartData = createChartData(bulan, "Penerimaan Iuran", iuran)
      this.setState({iuranData: {total_iuran, lastMonth, lastIuran, chartData, chartOptions}})
    })
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
            this.generateIuran()      
            break
          case 1:
            this.setState({ title: "Penambahan TK"})
            axios.get('http://127.0.0.1:8000/api/tk/')
            .then(res => {
              const allTks = res.data
              let jumlah = []
              let bulan = []
              allTks.forEach(allTk => {
                jumlah.push(allTk.jml_tk)
                bulan.push(moment(allTk.month).locale('id', localization).format('MMMM'))
              })
              const add = (a, b) => a + b
              const totalTk = jumlah.reduce(add)
              const lastMonth = bulan[bulan.length - 1]
              const lastTk = jumlah[jumlah.length - 1]
              const chartData = createChartData(bulan, "Penambahan TK", jumlah)
              this.setState({tkData: {totalTk, lastMonth, lastTk, chartData, chartOptions}})
            })
            break
          case 2:
            this.setState({ title: "Akuisisi NPP"})
            axios.get('http://127.0.0.1:8000/api/npp/')
            .then(res => {
              const allNpp = res.data
              const allPenambahan = allNpp['penambahan_npp']
              let npp = []
              let bulan = []
              allPenambahan.forEach(penambahan => {
                npp.push(penambahan.jml_npp)
                bulan.push(moment(penambahan.month).locale('id', localization).format('MMMM'))
              })
              const add = (a, b) => a + b
              const totalPenambahan = npp.reduce(add)
              const lastMonth = bulan[bulan.length - 1]
              const lastNpp = npp[npp.length - 1]
              const chartData = createChartData(bulan, "Akuisisi NPP", npp)
              console.log(chartData)
              this.setState({nppData: {totalPenambahan, lastMonth, lastNpp, chartData, chartOptions}})
            })
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
              <TotalIuran {...this.state.iuranData}/>
            </div>
            <div>
              <TenagaKerja {...this.state.tkData}/>
            </div>
            <div>
              <Npp {...this.state.nppData} />
            </div>
          </Slider>
        </div>
      </Responsive>
    );
  }
}

export default App;
