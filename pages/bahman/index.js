import React, { useState, useEffect } from 'react'
// import { useDispatch } from 'react-redux'
import { Row, Col } from 'reactstrap'
import './style.module.css'
import { ExchangeData } from './functions/functions'
import { AllDephProcessor } from './functions/functions'
import { AllOrdersProcessor } from './functions/functions'
import { serverAddress } from '../../functions/ServerAddress'
import { GetRequest } from '../../functions/GetRequest'

// import Charts from './components/Orders/Charts/Charts'
// import AddScenario from './components/AddScenario/AddScenario'
// import AllScenarioes from './components/AllScenarioes/AllScenarioes'
// import Accounts from './components/Accounts/Accounts'
// import OrderList from './components/Orders/OrderList/OrderList'

const index = () => {

  // const dispatch = useDispatch()

  // useEffect(() => {
  //     dispatch({ type: "SHOWNAVBAR" })
  //     dispatch({ type: "SETWITCHPAGE", value: 12 })
  // }, [])

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
  const [FirstLoad, SetFirstLoad] = useState(false)

  const GetDepthData = (data) => {
      GetRequest(`${serverAddress}/intervention/orderbook/?exchange=${ExchangeData.find(item => item.id === ExchangeSelected).EnglishName}`)
          .then((response) => {
              console.log(response)
              SetFirstLoad(true)
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
              SetFirstLoad(true)
          })
  }
  useEffect(() => {
      GetDepthData(ExchangeData.find(item => item.id === ExchangeSelected));
      const interval = setInterval(() => {
          GetDepthData(ExchangeData.find(item => item.id === ExchangeSelected));
      }, 2000);
      return () => clearInterval(interval);
  }, [, ExchangeSelected])

  return (
    <div className='container-fluid' id='Modakhele' style={{ maxWidth: '1500px', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row className='m-0 p-0' style={{ flex: 0.5, display: 'flex' }}>
        <Col className='m-0 p-0' lg={9} style={{ display: 'flex', flexDirection: 'column' }}>
          <Row className='m-0 p-0' style={{ flex: 0.5 }}>
            <Col className='m-0 p-0 ps-1 pe-1' sm="4">
            1
              {/* <AddScenario SetAddOrderValue={SetAddOrderValue} AddOrderValue={AddOrderValue} ExchangeSelected={ExchangeSelected} AccountSelected={AccountSelected} AccountSelectedForOrder={AccountSelectedForOrder} /> */}
            </Col>
            <Col className='m-0 p-0 ps-1 pe-1'>
            2
              {/* <Charts FirstLoad={FirstLoad} SetExchangeSelected={SetExchangeSelected} ExchangeSelected={ExchangeSelected} bids={BuyDepth} asks={SellDepth} /> */}
            </Col>
          </Row>
          <Row className='m-0 p-0 mt-2' id="select" style={{ flex: 1 }}>
            <Col className='m-0 p-0  p-0 ps-1 pe-1'>
            3
              {/* <Accounts SetAddOrderValue={SetAddOrderValue} SetAccountSelected={SetAccountSelected} SetAccountSelectedForOrder={SetAccountSelectedForOrder} /> */}
            </Col>
          </Row>
        </Col>

        <Col className='m-0 p-0 ps-1 pe-1' lg={3}>
        4
          {/* <OrderList FirstLoad={FirstLoad} SellOrders={SellOrders} BuyOrders={BuyOrders} SetExchangeSelected={SetExchangeSelected} /> */}
        </Col>
      </Row>

      <Row className='m-0 p-0 mt-2'>
        <Col className='m-0 p-0  ps-1 pe-1'>
        5
          {/* <AllScenarioes /> */}
        </Col>
      </Row>
    </div>
  )
}

export default index
