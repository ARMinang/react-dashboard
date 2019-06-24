import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import TotalIuran from './Components/Iuran'
import TenagaKerja from './Components/TenagaKerja'
import Npp from './Components/Npp'
import IuranAr from './Components/IuranAr'
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
import { bold } from 'ansi-colors';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const AR = [
  'AK153580', 'ED160810', 'FA165960', 'RA248900', 'SU244930'
]

const COLOR = [
  'rgba(255, 99, 132, 0.4)',
  'rgba(54, 162, 235, 0.4)',
  'rgba(255, 206, 86, 0.4)',
  'rgba(75, 192, 192, 0.4)',
  'rgba(153, 102, 255, 0.4)',
  'rgba(255, 159, 64, 0.4)'
]

const ARK = [
  'FE174690', 'GR153600', 'MU165970', 'NI273920', 'RA174700',
  'RO259060', 'SE251740'
]

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

const createStackedData = (labels, data) => {
  return {
    labels: labels,
    datasets: data
  }
}

const stackedChartOptions = {
  barValueSpacing: 20,
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
  plugins: {
    datalabels: {
      display: false
    }
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
      nppData: { chartData: {}},
      iuranAr: { chartData: {} },
      iuranArk: {chartData: {}},
      tkAr: {chartData: {}},
      tkArk: {chartData: {}},
      nppArk: {chartData: {}}
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
      this.setState({iuranData: {total_iuran, lastMonth, lastIuran, chartData, chartOptions,}})
    })
  }

  generateIuranPerAr = (ARX, url) => {
    axios.get(url)
    .then(res => {
      const allIurans = res.data
      let datasets = []
      let first = true
      let bulan = []
      let node
      switch (url) {
        case 'http://127.0.0.1:8000/api/iuran/ar/':
          node = 'jml_bayar'
          break
        case 'http://127.0.0.1:8000/api/tk/ar/':
          node = 'jml_tk'
          break
        case 'http://127.0.0.1:8000/api/npp/ar/':
          node = 'jml_npp'
          break
        default:
          break
      }
      ARX.forEach((singleAr, index) => {
        let dataAr = []
        allIurans.forEach(iuran => {
          if (singleAr === iuran['kode_pembina']) {
            dataAr.push(iuran[node])
            if (first) {
              bulan.push(moment(iuran.month).locale('id', localization).format('MMMM'))
            }
          }
        })
        datasets.push({label: singleAr, backgroundColor: COLOR[index], data: dataAr})
        if (first) {
          first = false
        }
      })
      console.log(datasets)
      const chartData = createStackedData(bulan, datasets)
      switch (url) {
        case 'http://127.0.0.1:8000/api/iuran/ar/':
          ARX.length > 5
            ? this.setState({iuranArk: {chartData, stackedChartOptions}})
            : this.setState({iuranAr: {chartData, stackedChartOptions}})
          break
        case 'http://127.0.0.1:8000/api/tk/ar/':
          ARX.length > 5
            ? this.setState({tkArk: {chartData, stackedChartOptions}})
            : this.setState({tkAr: {chartData, stackedChartOptions}})
          break
        case 'http://127.0.0.1:8000/api/npp/ar/':
          this.setState({nppArk: {chartData, stackedChartOptions}})
          break
        default:
          break
      }
    })
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 3 * 1000 * 60,
      pauseOnHover: false,
      beforeChange: (currentIndex, nextIndex) => {
        switch(nextIndex) {
          case 0:
            this.generateIuran()      
            break
          case 1:
            this.setState({title: "Penerimaan Iuran per AR"})
            this.generateIuranPerAr(AR, 'http://127.0.0.1:8000/api/iuran/ar/')
            break
          case 2:
            this.setState({title: "Penerimaan Iuran per ARK"})
            this.generateIuranPerAr(ARK, 'http://127.0.0.1:8000/api/iuran/ar/')
            break
          case 3:
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
          case 4:
            this.setState({title: "Penambahan TK AR"})
            this.generateIuranPerAr(AR, 'http://127.0.0.1:8000/api/tk/ar/')
            break
          case 5:
            this.setState({title: "Penambahan TK ARK"})
            this.generateIuranPerAr(ARK, 'http://127.0.0.1:8000/api/tk/ar/')
            break
          case 6:
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
              this.setState({nppData: {totalPenambahan, lastMonth, lastNpp, chartData, chartOptions}})
            })
            break
          case 7:
            this.setState({title: "Penambahan NPP per ARK"})
            this.generateIuranPerAr(ARK, 'http://127.0.0.1:8000/api/npp/ar/')
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
              <IuranAr {...this.state.iuranAr}/>
            </div>
            <div>
              <IuranAr {...this.state.iuranArk}/>
            </div>
            <div>
              <TenagaKerja {...this.state.tkData}/>
            </div>
            <div>
              <IuranAr {...this.state.tkAr}/>
            </div>
            <div>
              <IuranAr {...this.state.tkArk}/>
            </div>
            <div>
              <Npp {...this.state.nppData} />
            </div>
            <div>
              <IuranAr {...this.state.nppArk}/>
            </div>
          </Slider>
        </div>
      </Responsive>
    );
  }
}

export default App;
