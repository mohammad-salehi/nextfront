import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GetRequest } from '../../../../functions/GetRequest';
import { serverAddress } from '../../../../functions/ServerAddress';
import jalaali from 'jalaali-js';
import { ExchangeData } from '../../../../pages/bahman/functions/functions';
import { Paginator } from 'primereact/paginator';
import { Card, Col, Modal, Row, ModalBody, Label, Button } from 'reactstrap';
import { UncontrolledTooltip } from 'reactstrap';
import { PostRequest } from '../../../../functions/PostRequest';
import toast from 'react-hot-toast';
// import Orders from './Orders/Orders';
import { Input } from 'reactstrap'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Select, { components } from 'react-select'
import CircularProgress from '@mui/material/CircularProgress';

const TaskTabel = ({ History, SetHistory }) => {

    const [ShowData, setShowData] = useState([])
    const [first, setFirst] = useState(0);
    const [ScenarioNumber, setScenarioNumber] = useState(0);
    const [BeReload, setBeReload] = useState(false);
    const [TableLoading, setTableLoading] = useState(false);
    const [IsShowFilter, setIsShowFilter] = useState(false);
    const [rows, setRows] = useState(5);
    const [SortParameter, SetSortParameter] = useState(2)
    const [Increase, SetIncrease] = useState(false)
    const [IsSort, SetIsSort] = useState(true)
    const [expandedRowIds, setExpandedRowIds] = useState([])
    const [FirstLoad, setFirstLoad] = useState(false);

    const [ExchangeList, SetExchangeList] = useState([
        {
            label: 'انتخاب نشده',
            value: false,
        },
        {
            label: 'نوبیتکس',
            value: 'NOBITEX'
        },
        {
            label: 'والکس',
            value: 'WALLEX'
        },
        {
            label: 'رمزینکس',
            value: "RAMZINEX"
        }
    ])
    const [ScenarioList, SetScenarioList] = useState([
        {
            label: 'انتخاب نشده',
            value: false,
        },
        {
            label: 'جلوگیری از رشد قیمت',
            value: 'KEEP'
        },
        {
            label: 'کاهش قیمت',
            value: 'REDUCE'
        },
        {
            label: 'کاهش و نگهداشت قیمت',
            value: "REDUCE_KEEP"
        },
        {
            label: 'خرید',
            value: 'PURCHASE'
        },
        {
            label: 'تهاجمی',
            value: 'AGGRESSIVE'
        },
        {
            label: 'تهاجمی-رسانه',
            value: 'AGGRESSIVE_MEDIA'
        },
        {
            label: 'رسانه',
            value: 'MEDIA_ORDER'
        }
    ])
    const [StatusList, SetStatusList] = useState([
        {
            label: 'انتخاب نشده',
            value: false,
        },
        {
            label: 'لغو‌ شده',
            value: 'Cancelled'
        },
        {
            label: 'فعال',
            value: 'Active'
        },
        {
            label: 'ناموفق',
            value: "Failed"
        },
        {
            label: 'اتمام',
            value: "Done"
        }
    ])
    const [Filters, SetFilters] = useState(
        {
            start_price: false,
            end_price: false,
            start_total_amount: false,
            end_total_amount: false,
            scenario_name: false,
            statusName: false,
            ExchangeName: false,
        }
    )
    function IncreaseSortByProperty(getData, propertyName) {
        const newData = [...getData].sort((a, b) => {
            if (a[propertyName] < b[propertyName]) {
                return -1;
            } else if (a[propertyName] > b[propertyName]) {
                return 1;
            } else {
                return 0;
            }
        });
        setShowData(newData);
    }
    function DecreaseSortByProperty(getData, propertyName) {
        const newData = [...getData].sort((a, b) => {
            if (a[propertyName] < b[propertyName]) {
                return 1;
            } else if (a[propertyName] > b[propertyName]) {
                return -1;
            } else {
                return 0;
            }
        });
        setShowData(newData);
    }
    const getData = () => {
        if (Object.values(Filters).every(value => value === false)) {
            GetRequest(`${serverAddress}/intervention/scenarios/?limit=5&offset=${first}`)
                .then(response => {
                    setTableLoading(false)
                    if (response.status === 200) {
                        SetHistory(response.data.results)
                        setScenarioNumber(response.data.count)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    setTableLoading(false)
                })
        } else {
            let address = serverAddress + `/intervention/scenarios/search/?limit=5&offset=${first}`
            if (Filters.start_price) {
                address = address + `&start_price=${Filters.start_price}`
            }
            if (Filters.end_price) {
                address = address + `&end_price=${Filters.end_price}`
            }
            if (Filters.start_total_amount) {
                address = address + `&start_total_amount=${Filters.start_total_amount}`
            }
            if (Filters.end_total_amount) {
                address = address + `&end_total_amount=${Filters.end_total_amount}`
            }
            if (Filters.scenario_name) {
                console.log(Filters.scenario_name)
                address = address + `&scenario_name=${Filters.scenario_name}`
            }
            if (Filters.statusName) {
                address = address + `&status=${Filters.statusName}`
            }
            if (Filters.ExchangeName) {
                address = address + `&exchange_name=${Filters.ExchangeName.toLowerCase()}`
            }
            GetRequest(address)
                .then((response) => {
                    setTableLoading(false)
                    if (response.status === 200) {
                        SetHistory(response.data.results)
                        setScenarioNumber(response.data.count)
                    }
                })
                .catch((err) => {
                    setTableLoading(false)
                    console.log(err)
                })
        }
    }
    useEffect(() => {
        getData();
        const interval = setInterval(() => {
            getData();
        }, 5000);
        return () => clearInterval(interval);
    }, [, BeReload, Filters, first])
    const timeTransaction = (rowData, column) => {
        const j = rowData.timestamp
        const date = new Date(j);

        const { jy, jm, jd } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        const persianDate = `${hours}:${minutes} ${jy}/${jm}/${jd}`;

        return (
            <span style={{ marginBottom: '-6px' }}>
                {persianDate}
            </span>
        )
    }
    const type_transaction = (row) => {
        if (row.type_transaction === 'SELL') {
            return (
                <span style={{
                    background: 'rgba(255,0,0,0.1)',
                    color: 'rgb(173,1,1)',
                    padding: '2px 16px',
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    SELL
                </span>
            )
        } else if (row.type_transaction === 'BUY') {
            return (
                <span style={{
                    background: 'rgba(0,255,0,0.1)',
                    color: 'rgb(27,96,33)',
                    padding: '2px 16px',
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    BUY
                </span>
            )
        }
    }
    const exchange_name = (row) => {
        return (
            <span style={{ fontSize: '14px', marginBottom: '-6px' }}>
                <img style={{ width: '24px', marginLeft: '4px', marginTop: '-4px' }} src={ExchangeData.find(item => item.EnglishName.toUpperCase() === row.exchange_name.toUpperCase()).ImageAddress} />
                {
                    row.exchange_name
                }
            </span>
        )
    }
    const onPageChange = (event) => {
        if (first !== event.first) {
            setTableLoading(true)
            setFirst(event.first)
            setRows(event.rows)
        }
    }
    const scenario = (row) => {
        if (row.scenario_name === 'KEEP') {
            return (
                <span style={{
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    جلوگیری از رشد قیمت
                </span>
            )
        } else if (row.scenario_name === 'REDUCE') {
            return (
                <span style={{
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    کاهش قیمت
                </span>
            )
        } else if (row.scenario_name === 'REDUCE_KEEP') {
            return (
                <span style={{
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    کاهش و نگهداشت قیمت
                </span>
            )
        } else if (row.scenario_name === "PURCHASE") {
            return (
                <span style={{
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    خرید
                </span>
            )
        } else if (row.scenario_name === "AGGRESSIVE") {
            return (
                <span style={{
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    تهاجمی
                </span>
            )
        } else if (row.scenario_name === "AGGRESSIVE_MEDIA") {
            return (
                <span style={{
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    تهاجمی-رسانه
                </span>
            )
        } else if (row.scenario_name === "MEDIA_ORDER") {
            return (
                <span style={{
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    رسانه
                </span>
            )
        }

    }
    const cancel = (row) => {
        return (
            <svg
                fill="gray"
                width="24px"
                height="24px"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    cursor: 'pointer'
                }}
                onClick={
                    () => {
                        const scenario_id = row.id
                        const exchange = row.exchange_name
                        const access_id = row.access_id
                        const data = { scenario_id, exchange, access_id }
                        PostRequest(`${serverAddress}/intervention/cancel-scenario/`, data)
                            .then((response) => {
                                if (response.status === 200) {
                                    setBeReload(!BeReload)
                                    return toast.success('سناریو مورد نظر با موفقیت لغو شد', {
                                        position: 'bottom-left'
                                    })
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                }
            >
                <g>
                    <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z" />
                </g>
            </svg>
        )
    }
    const download = (row) => {

        const createdData = [];
        const fetchData = async () => {
            const newData1 = [];
            try {
                const response = await GetRequest(`${serverAddress}/intervention/scenarios/${row.id}/orders/`);
                newData1.push(row);
                newData1.push(...response.data.results);
                createdData.push(newData1);
            } catch (error) {
                console.error(`Error fetching data for scenario ${row.id}:`, error);
                return toast.error('خطا در دریافت اطلاعات', {
                    position: 'bottom-left'
                })
            }
            exportToExcelFromNestedArray(createdData, 'scenario_data')
        };

        fetchData();

    }

    const downloadScenario = (row) => {

        return (
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={() => { download(row) }}>
                <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        )
    }
    const status = (row) => {
        if (row.status === 'Cancelled') {
            return (
                <span style={{
                    background: 'rgba(255,0,0,0.1)',
                    color: 'rgb(173,1,1)',
                    padding: '2px 16px',
                    borderRadius: '16px',
                    fontSize: '14px', marginBottom: '-6px'
                }}>
                    لغو‌ شده
                </span>
            )
        } else if (row.status === 'Failed') {
            return (
                <div>
                    <span style={{
                        background: 'rgba(245, 155, 66, 0.1)',
                        color: 'orange',
                        padding: '2px 16px',
                        borderRadius: '16px',
                        fontSize: '14px', marginBottom: '-6px'
                    }}
                        id={`showReason${row.id}`}
                    >
                        ناموفق
                        <ion-icon name="information-circle-outline" style={{ fontSize: '20px', marginBottom: '-7px' }}></ion-icon>
                    </span>
                    <UncontrolledTooltip placement='left' target={`showReason${row.id}`}>
                        {row.description}
                    </UncontrolledTooltip>
                </div>

            )
        } else if (row.status === "Inprogress") {
            return (
                <span style={{
                    background: 'rgba(200,200,0,0.1)',
                    color: 'orange',
                    padding: '2px 16px',
                    borderRadius: '16px',
                    fontSize: '14px'
                }}>
                    در حال انجام
                </span>
            )
        } else if (row.status === "Active") {
            return (
                <span style={{
                    background: 'rgba(0,0,255,0.1)',
                    color: '#0202A2',
                    padding: '2px 16px',
                    borderRadius: '16px',
                    fontSize: '14px'
                }}>
                    فعال
                </span>
            )
        } else if (row.status === "Done") {
            return (
                <span style={{
                    background: 'rgba(0,255,0,0.1)',
                    color: 'rgb(27,96,33)',
                    padding: '2px 16px',
                    borderRadius: '16px',
                    fontSize: '14px'
                }}>
                    اتمام
                </span>
            )
        }
    }
    const onRowToggle = (e) => {
        setExpandedRowIds([])
        for (let i = 0; i < e.data.length; i++) {
            const rowId = e.data[i].id; // فرض می‌کنیم که `id` کلید منحصر به فرد هر ردیف است

            setExpandedRowIds(prevState => {
                // اگر ردیف جدید قبلاً باز بود، آن را بسته کنیم
                if (prevState.includes(rowId)) {
                    return []; // اگر ردیف جدید قبلاً باز است، همه را ببندیم
                } else {
                    // در غیر این صورت، فقط ردیف جدید را باز کنیم
                    return [rowId];
                }
            });
        }
        console.log(e)

    };
    const rowExpansionTemplate = (rowData) => {
        return (
            // <Orders row={rowData} />
            <p>سفارشات</p>
        );
    }
    const exportToExcelFromNestedArray = (data, fileName) => {
        // ایجاد ورک بوک
        const workBook = XLSX.utils.book_new();

        // به ازای هر خانه از بعد اول آرایه (تعداد 11 خانه)، یک شیت جداگانه ایجاد کن
        for (let i = 0; i < data.length; i++) {
            const sheetData = [];

            // بررسی اینکه آیا خانه اول بعد دوم موجود است
            if (data[i][0]) {
                // اضافه کردن پارامترهای خانه اول (کلیدهای آبجکت)
                sheetData.push(Object.keys(data[i][0]));
                // اضافه کردن مقادیر خانه اول (مقادیر آبجکت)
                sheetData.push(Object.values(data[i][0]));
            }

            // بررسی اینکه آیا خانه‌های دوم به بعد موجود هستند
            if (data[i].length > 1) {
                // اضافه کردن پارامترهای خانه‌های دوم به بعد (کلیدهای آبجکت)
                sheetData.push(Object.keys(data[i][1]));
                // اضافه کردن مقادیر خانه‌های دوم به بعد (مقادیر آبجکت‌ها)
                for (let j = 1; j < data[i].length; j++) {
                    sheetData.push(Object.values(data[i][j]));
                }
            }

            // تبدیل آبجکت‌ها به شیت اکسل
            const workSheet = XLSX.utils.aoa_to_sheet(sheetData);

            // اضافه کردن قالب‌بندی زرد رنگ برای ردیف‌های اول و سوم
            const range = XLSX.utils.decode_range(workSheet['!ref']);

            // ردیف اول
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                if (workSheet[cellAddress]) {
                    workSheet[cellAddress].s = {
                        fill: {
                            patternType: 'solid',
                            fgColor: { rgb: 'FFFF00' }, // زرد رنگ
                        },
                    };
                }
            }

            // ردیف سوم (در صورتی که وجود داشته باشد)
            if (range.e.r >= 2) {
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
                    if (workSheet[cellAddress]) {
                        workSheet[cellAddress].s = {
                            fill: {
                                patternType: 'solid',
                                fgColor: { rgb: 'FFFF00' }, // زرد رنگ
                            },
                        };
                    }
                }
            }

            // افزودن شیت به ورک بوک، نام هر شیت را می‌توان به دلخواه تغییر داد
            XLSX.utils.book_append_sheet(workBook, workSheet, `Sheet_${i + 1}`);
        }

        // ایجاد فایل اکسل به فرمت باینری
        const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

        // ذخیره کردن فایل به صورت Blob
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${fileName}.xlsx`);
    }
    useEffect(() => {
        if (IsSort) {
            if (History !== undefined) {
                if (SortParameter === 0) {
                    if (Increase) {
                        IncreaseSortByProperty(History, 'total_amount')
                    } else {
                        DecreaseSortByProperty(History, 'total_amount')
                    }
                } else if (SortParameter === 1) {
                    if (Increase) {
                        IncreaseSortByProperty(History, 'price')
                    } else {
                        DecreaseSortByProperty(History, 'price')
                    }
                } else if (SortParameter === 2) {
                    if (Increase) {
                        IncreaseSortByProperty(History, 'timestamp')
                    } else {
                        DecreaseSortByProperty(History, 'timestamp')
                    }
                } else if (SortParameter === 3) {
                    if (Increase) {
                        IncreaseSortByProperty(History, 'status')
                    } else {
                        DecreaseSortByProperty(History, 'status')
                    }
                }
            }
        }
    }, [IsSort, SortParameter, Increase, History])

    //filters
    const [start_price, Setstart_price] = useState(false)
    const [end_price, Setend_price] = useState(false)
    const [start_total_amount, Setstart_total_amount] = useState(false)
    const [end_total_amount, Setend_total_amount] = useState(false)
    const [scenario_name, Setscenario_name] = useState(false)
    const [statusName, SetstatusName] = useState(false)
    const [ExchangeName, SetExchangeName] = useState(false)

    const addFilters = () => {
        Setstart_price(Filters.start_price)
        Setend_price(Filters.end_price)
        Setstart_total_amount(Filters.start_total_amount)
        Setend_total_amount(Filters.end_total_amount)
        Setscenario_name(Filters.scenario_name)
        SetstatusName(Filters.statusName)
        SetExchangeName(Filters.ExchangeName)
        setIsShowFilter(false)
        SetFilters(
            {
                start_price,
                end_price,
                start_total_amount,
                end_total_amount,
                scenario_name,
                statusName,
                ExchangeName
            }
        )
    }
    function hexToRGBA(hex, opacity) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    const handleFilterChange = (key, value) => {
        SetFilters(prevFilters => ({
            ...prevFilters,
            [key]: value
        }));
    };

    useEffect(() => {
        if (Object.values(Filters).every(value => value === false)) {
            GetRequest(`${serverAddress}/intervention/scenarios/?limit=5&offset=${first}`)
                .then(response => {
                    setFirstLoad(true)
                    if (response.status === 200) {
                        SetHistory(response.data.results)
                        setScenarioNumber(response.data.count)
                    }
                })
                .catch((err) => {
                    setFirstLoad(true)
                    console.log(err)
                })
        } else {
            let address = serverAddress + `/intervention/scenarios/search/?limit=5&offset=${first}`
            if (Filters.start_price) {
                address = address + `&start_price=${Filters.start_price}`
            }
            if (Filters.end_price) {
                address = address + `&end_price=${Filters.end_price}`
            }
            if (Filters.start_total_amount) {
                address = address + `&start_total_amount=${Filters.start_total_amount}`
            }
            if (Filters.end_total_amount) {
                address = address + `&end_total_amount=${Filters.end_total_amount}`
            }
            if (Filters.scenario_name) {
                console.log(Filters.scenario_name)
                address = address + `&scenario_name=${Filters.scenario_name}`
            }
            if (Filters.statusName) {
                address = address + `&status=${Filters.statusName}`
            }
            if (Filters.ExchangeName) {
                address = address + `&exchange_name=${Filters.ExchangeName.toLowerCase()}`
            }
            GetRequest(address)
                .then((response) => {
                    console.log(response)
                    setFirstLoad(false)
                    if (response.status === 200) {
                        SetHistory(response.data.results)
                        setScenarioNumber(response.data.count)
                    }
                })
                .catch((err) => {
                    setFirstLoad(false)
                })
        }
    }, [Filters])

    return (
        <div >
            <Card className='noBackgroundCard' style={{
                background: 'none'
            }}>
                <Row className='p-3 pb-2'>
                    <Col>
                        <h6>
                            <span style={{ cursor: 'pointer' }} onClick={() => { setIsShowFilter(true) }}>
                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" style={{ marginTop: '-4px' }} xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 10a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1ZM7 14a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1ZM9 18a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM3 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" fill="#000000" /></svg>
                                فیلترها
                            </span>
                        </h6>
                    </Col>
                </Row>
                {
                    !(Object.values(Filters).every(value => value === false)) ?
                        <Row className='p-3'>
                            <Col>
                                {
                                    Filters.ExchangeName ?
                                        <span
                                            style={{ background: hexToRGBA('#000000', 0.1), color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginRight: '4px', cursor: 'pointer' }}
                                            onClick={() => {

                                            }}
                                        >
                                            صرافی {Filters.ExchangeName}
                                            <svg style={{marginRight:'4px'}} fill="#000000" width="18px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => { handleFilterChange('ExchangeName', false) }}>
                                                <g>
                                                    <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z" />
                                                </g>
                                            </svg>
                                        </span>
                                        :
                                        null
                                }

                                {
                                    Filters.start_price ?
                                        <span
                                            style={{ background: hexToRGBA('#000000', 0.1), color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginRight: '4px', cursor: 'pointer' }}
                                            onClick={() => {

                                            }}
                                        >
                                            {' '}
                                            کمترین قیمت {Filters.start_price.toLocaleString()} ریال
                                            <svg style={{marginRight:'4px'}} fill="#000000" width="18px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => { handleFilterChange('start_price', false) }}>
                                                <g>
                                                    <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z" />
                                                </g>
                                            </svg>
                                        </span>
                                        :
                                        null
                                }

                                {
                                    Filters.end_price ?
                                        <span
                                            style={{ background: hexToRGBA('#000000', 0.1), color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginRight: '4px', cursor: 'pointer' }}
                                            onClick={() => {

                                            }}
                                        >
                                            {' '}
                                            بیشترین قیمت {Filters.end_price.toLocaleString()} ریال
                                            <svg style={{marginRight:'4px'}} fill="#000000" width="18px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => { handleFilterChange('end_price', false) }}>
                                                <g>
                                                    <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z" />
                                                </g>
                                            </svg>
                                        </span>
                                        :
                                        null
                                }

                                {
                                    Filters.scenario_name ?
                                        <span
                                            style={{ background: hexToRGBA('#000000', 0.1), color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginRight: '4px', cursor: 'pointer' }}
                                            onClick={() => {

                                            }}
                                        >
                                            {' '}
                                            {Filters.scenario_name === 'AGGRESSIVE_MEDIA' ? 'تهاجمی-رسانه' : null}
                                            {Filters.scenario_name === 'MEDIA_ORDER' ? 'رسانه' : null}
                                            {Filters.scenario_name === 'AGGRESSIVE' ? 'تهاجمی' : null}
                                            {Filters.scenario_name === 'PURCHASE' ? 'خرید' : null}
                                            {Filters.scenario_name === 'REDUCE_KEEP' ? 'کاهش و نگهداشت قیمت' : null}
                                            {Filters.scenario_name === 'REDUCE' ? 'کاهش قیمت' : null}
                                            {Filters.scenario_name === 'KEEP' ? 'جلوگیری از رشد قیمت' : null}

                                            <svg style={{marginRight:'4px'}} fill="#000000" width="18px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => { handleFilterChange('scenario_name', false) }}>
                                                <g>
                                                    <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z" />
                                                </g>
                                            </svg>
                                        </span>
                                        :
                                        null
                                }

                                {
                                    Filters.statusName ?
                                        <span
                                            style={{ background: hexToRGBA('#000000', 0.1), color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginRight: '4px', cursor: 'pointer' }}
                                            onClick={() => {

                                            }}
                                        >
                                            {' '}
                                            {Filters.statusName === 'Cancelled' ? 'لغوشده' : null}
                                            {Filters.statusName === 'Done' ? 'اتمام' : null}
                                            {Filters.statusName === 'Active' ? 'فعال' : null}
                                            {Filters.statusName === 'Failed' ? 'ناموفق' : null}
                                            <svg style={{marginRight:'4px'}} fill="#000000" width="18px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => { handleFilterChange('statusName', false) }}>
                                                <g>
                                                    <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z" />
                                                </g>
                                            </svg>
                                        </span>
                                        :
                                        null
                                }

                                {
                                    Filters.end_total_amount ?
                                        <span
                                            style={{ background: hexToRGBA('#000000', 0.1), color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginRight: '4px', cursor: 'pointer' }}
                                            onClick={() => {

                                            }}
                                        >
                                            {' '}
                                            بیشترین حجم {Filters.end_total_amount} usdt
                                            <svg style={{marginRight:'4px'}} fill="#000000" width="18px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => { handleFilterChange('end_total_amount', false) }}>
                                                <g>
                                                    <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z" />
                                                </g>
                                            </svg>
                                        </span>
                                        :
                                        null
                                }

                                {
                                    Filters.start_total_amount ?
                                        <span
                                            style={{ background: hexToRGBA('#000000', 0.1), color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginRight: '4px', cursor: 'pointer' }}
                                            onClick={() => {

                                            }}
                                        >
                                            {' '}
                                            کمترین حجم {Filters.start_total_amount} usdt
                                            <svg style={{marginRight:'4px'}} fill="#000000" width="18px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => { handleFilterChange('start_total_amount', false) }}>
                                                <g>
                                                    <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z" />
                                                </g>
                                            </svg>
                                        </span>
                                        :
                                        null
                                }

                            </Col>
                        </Row>
                        :
                        null
                }
                {
                    History !== undefined ?

                        History.length > 0 ?
                            <div style={{ borderTopStyle: 'solid', borderColor: 'rgb(220,220,220)', borderWidth: '1px' }}>
                                {
                                    TableLoading ?
                                        <div className='mt-5' style={{textAlign:'center'}}>
                                            <CircularProgress size='3rem'/>
                                        </div>
                                        :
                                        <DataTable
                                            value={ShowData}
                                            tableStyle={{ minWidth: '50rem' }}
                                            expandedRows={ShowData.filter(row => expandedRowIds.includes(row.id))}
                                            onRowToggle={onRowToggle}
                                            rowExpansionTemplate={rowExpansionTemplate}
                                            className='custom-data-table no-row-background TaskTabelTd'
                                        >
                                            <Column expander style={{ width: '3em', padding: '0px' }} />
                                            <Column body={exchange_name} bodyStyle={{ textAlign: 'right' }} header=" صرافی"></Column>
                                            <Column body={type_transaction} bodyStyle={{ textAlign: 'right' }} header=" خرید / فروش "></Column>
                                            <Column body={timeTransaction} bodyStyle={{ textAlign: 'right' }} header={'زمان'}></Column>
                                            <Column body={scenario} bodyStyle={{ textAlign: 'right' }} header=" سناریو"></Column>
                                            <Column body={status} bodyStyle={{ textAlign: 'right' }} header={'وضعیت'}></Column>
                                            <Column body={cancel} bodyStyle={{ textAlign: 'right' }} header="لغو"></Column>
                                            <Column body={downloadScenario} bodyStyle={{ textAlign: 'right' }} header="دریافت"></Column>
                                        </DataTable>
                                }


                                <Paginator
                                    className='paginator-table no-row-background'
                                    first={first}
                                    rows={5}
                                    totalRecords={ScenarioNumber}
                                    rowsPerPageOptions={5}
                                    onPageChange={onPageChange}
                                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate='نمایش {first} تا {last} از {totalRecords} سناریو '
                                />
                            </div>
                            :
                            FirstLoad ?

                                <div>
                                    no data
                                </div>
                                :
                                <div>
                                    loading
                                </div>
                        :
                        null
                }

            </Card>
            <Modal
                isOpen={IsShowFilter}
                id='SelectTImeRangeBox'
                toggle={() => { setIsShowFilter(false) }}
                className='modal-dialog-centered'
                modalClassName={'modal-danger'}
                style={{ padding: '0px' }}
            >
                <ModalBody style={{ padding: '0px', borderRadius: '12px', overflow: 'hidden', }} className='p-3'>
                    <h6>
                        فیلترها
                    </h6>
                    <Label>صرافی</Label>
                    <Select
                        id='ExchangeSelection'
                        isClearable={false}
                        closeMenuOnSelect={false}
                        placeholder=''
                        value={ExchangeList.find(item => item.value === ExchangeName)}
                        options={ExchangeList}
                        className='react-select'
                        classNamePrefix='select'
                        onChange={(e) => {
                            SetExchangeName(e.value)
                        }}
                    />
                    <Label>سناریو</Label>
                    <Select
                        id='ExchangeSelection'
                        isClearable={false}
                        closeMenuOnSelect={false}
                        placeholder=''
                        value={ScenarioList.find(item => item.value === scenario_name)}
                        options={ScenarioList}
                        className='react-select'
                        classNamePrefix='select'
                        onChange={(e) => {
                            Setscenario_name(e.value)
                        }}
                    />
                    <Label>وضعیت</Label>
                    <Select
                        id='ExchangeSelection'
                        isClearable={false}
                        closeMenuOnSelect={false}
                        placeholder=''
                        value={StatusList.find(item => item.value === statusName)}
                        options={StatusList}
                        className='react-select'
                        classNamePrefix='select'
                        onChange={(e) => {
                            SetstatusName(e.value)
                        }}
                    />
                    <Label>کمترین قیمت</Label>
                    <Input type="number" placeholder="ریال" onChange={(e) => { Setstart_price(e.target.value) }} value={start_price} />
                    <Label>بیشترین قیمت</Label>
                    <Input type="number" placeholder="ریال" onChange={(e) => { Setend_price(e.target.value) }} value={end_price} />
                    <Label>کمترین حجم</Label>
                    <Input type="number" placeholder="ریال" onChange={(e) => { Setstart_total_amount(e.target.value) }} value={start_total_amount} />
                    <Label>بیشترین حجم</Label>
                    <Input type="number" placeholder="ریال" onChange={(e) => { Setend_total_amount(e.target.value) }} value={end_total_amount} />
                    <div style={{ textAlign: 'left' }} className='mt-3'>
                        <Button color="primary" onClick={addFilters}>اعمال</Button>
                    </div>
                </ModalBody>
            </Modal>

        </div>
    )
}

export default TaskTabel
