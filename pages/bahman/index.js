import React, { useState, useEffect } from 'react'
// import { useDispatch } from 'react-redux'
import { Row, Col } from 'reactstrap'
import './style.module.css'
import { ExchangeData } from './functions/functions'
import { AllDephProcessor } from './functions/functions'
import { AllOrdersProcessor } from './functions/functions'
import { serverAddress } from '../../functions/ServerAddress'
import axios from 'axios'
import Cookies from 'js-cookie'
import AllScenarioes from '../../layouts/bahman/AllScenarios/AllScenarioes'
const index = () => {

  useEffect(() => {
    document.title = `پنتا - سامانه بهمن`
  })

  const [AddOrderValue, SetAddOrderValue] = useState(null)
  const [ExchangeSelected, SetExchangeSelected] = useState(1)
  const [AccountSelected, SetAccountSelected] = useState(null)
  const [AccountSelectedForOrder, SetAccountSelectedForOrder] = useState(null)

  const [BuyDepth, SetBuyDepth] = useState([])
  const [SellDepth, SetSellDepth] = useState([])
  const [SellOrders, SetSellOrders] = useState([])
  const [BuyOrders, SetBuyOrders] = useState([])

  const GetDepthData = (data) => {

    axios.get(`${serverAddress}/intervention/orderbook/?exchange=${ExchangeData.find(item => item.id === ExchangeSelected).EnglishName}`, {
      headers: { Authorization: `Bearer ${Cookies.get('access')}` }
    })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          let processedData = null
          const BuyRequest = AllDephProcessor(response).BuyRequest
          const SellRequest = AllDephProcessor(response).SellRequest
          SetBuyDepth(BuyRequest)
          SetSellDepth(SellRequest)
          processedData = AllOrdersProcessor(response)
          SetBuyOrders(processedData.BuyOrders)
          SetSellOrders(processedData.SellOrders)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    GetDepthData();
    const interval = setInterval(() => {
      GetDepthData();
    }, 2000);
    return () => clearInterval(interval);
  }, [, ExchangeSelected])

  return (
    <div className='container-fluid pantaBackground' id='Modakhele' style={{ maxWidth: '1500px', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row className='m-0 p-0' style={{ flex: 0.5, display: 'flex' }}>
        <Col className='m-0 p-0' lg={9} style={{ display: 'flex', flexDirection: 'column' }}>
          <Row className='m-0 p-0' style={{ flex: 0.5 }}>
            <Col className='m-0 p-0 ps-1 pe-1' sm="4">
              1
            </Col>
            <Col className='m-0 p-0 ps-1 pe-1'>
              2
            </Col>
          </Row>
          <Row className='m-0 p-0 mt-2' id="select" style={{ flex: 1 }}>
            <Col className='m-0 p-0  p-0 ps-1 pe-1'>
              3
            </Col>
          </Row>
        </Col>

        <Col className='m-0 p-0 ps-1 pe-1' lg={3}>
          4
        </Col>
      </Row>

      <Row className='m-0 p-0 mt-2'>
        <Col className='m-0 p-0  ps-1 pe-1'>
          <AllScenarioes/>
        </Col>
      </Row>
    </div>
  )
}

export default index
