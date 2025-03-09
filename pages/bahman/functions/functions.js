function sortArrayByProperty(array, property) {
    return array.sort((a, b) => {
        if (a[property] < b[property]) {
            return 1;
        }
        if (a[property] > b[property]) {
            return -1;
        }
        return 0;
    });
}
function sortSellArrayByProperty(array, property) {
    return array.sort((a, b) => {
        if (a[property] < b[property]) {
            return -1;
        }
        if (a[property] > b[property]) {
            return 1;
        }
        return 0;
    });
}
export const AllDephProcessor = (response) => {
    const BuyRequest = []
    const SellRequest = []

    for (let i = response.data.bids.length - 1; i >= 0; i--) {
        let askSum = 0;
        for (let j = i; j >= 0; j--) {
            askSum += Number(response.data.bids[j][1]);
        }
        let obj = [String(response.data.bids[i][0]), String(askSum)];
        BuyRequest.push(obj);
    }

    for (let i = 0; i < response.data.asks.length; i++) {
        let askSum = 0;
        for (let j = 0; j <= i; j++) {
            askSum += Number(response.data.asks[j][1]);
        }
        let obj = [String(response.data.asks[i][0]), String(askSum)];
        SellRequest.push(obj);
    }

    return(
        {
            BuyRequest,
            SellRequest
        }
    )
}
export const AllOrdersProcessor = (response) => {
    let GetSellOrders = []
    let GetBuyOrders = []

    response.data.asks.forEach(item => {
        GetSellOrders.push(
            {
                price:Number(item[0]),
                volume:Number(item[1])
            }
        )
    })

    response.data.bids.forEach(item => {
        GetBuyOrders.push(
            {
                price:Number(item[0]),
                volume:Number(item[1])
            }
        )
    })

    GetSellOrders=sortSellArrayByProperty(GetSellOrders, 'price')
    GetBuyOrders=sortArrayByProperty(GetBuyOrders, 'price')

    GetSellOrders = GetSellOrders.slice(0,10)
    GetBuyOrders = GetBuyOrders.slice(0,10)

    GetSellOrders=sortArrayByProperty(GetSellOrders, 'price')

    return(
        {
            BuyOrders:(GetBuyOrders),
            SellOrders:(GetSellOrders)
        }
    )
}
export const ExchangeData = [
    {
        name:'نوبیتکس',
        EnglishName:'NOBITEX',
        id:1,
        address:'https://api.nobitex.ir/v3/orderbook/USDTIRT',
        ImageAddress:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSspS0wq4BERg-uKkAh08Nz4YzT4OItjm0IWA&s',
        depth:'https://api.nobitex.ir/v2/depth/USDTIRT'
    },
    {
        name:'والکس',
        EnglishName:'WALLEX',
        id:2,
        address:'https://api.wallex.ir/v1/depth?symbol=USDTTMN',
        ImageAddress:'https://s.cafebazaar.ir/images/icons/ir.wallex.app-cae0dd03-3eb0-47ff-b0b1-043344aedc3e_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize',
        depth:'https://api.wallex.ir/v1/depth?symbol=USDTTMN'
    },
    {
        name:'رمزینکس',
        EnglishName:'RAMZINEX',
        id:3,
        address:'https://publicapi.ramzinex.com/exchange/api/v1.0/exchange/orderbooks/11/buys_sells',
        ImageAddress:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjCiWkkoAqjijG8xJcZVhcXTinMFdPsjql_w&s',
        depth:'https://publicapi.ramzinex.com/exchange/api/v1.0/exchange/orderbooks/11/buys_sells'
    }
]
export function containsPersian(text) {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text);
}
export const handleInputChange = (setterFunction) => (event) => {
    if (!containsPersian(event.target.value)) {
        const value = event.target.value.replace(/[^0-9.,]/g, "");
        setterFunction(value);
    } else {
        toast.error("زبان کیبورد فارسی است", {
            position: "bottom-left",
        });
    }
};