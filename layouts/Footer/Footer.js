import React, {useState, useEffect} from 'react'
const Footer = () => {

    return (
        <div style={{textAlign:'center', color:'rgb(200,200,200)', position:'absolute', width:'100%', bottom:'0px'}}>
            <span>
                طراحی و توسعه توسط
            </span>
            <span style={{fontSize:'18px', marginTop:'4px'}} className='me-1 ms-2'>©</span>
            <span>
                panta company
            </span>
        </div>
    )
}

export default Footer