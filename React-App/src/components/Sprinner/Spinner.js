import React from 'react';
import loading from '../../asset/images/loading.gif';

function Spinner(){
  return (
    <div className='d-flex algin-items-center justify-content-center'>
     <img className='loading' src={loading} alt="loading"/>
    </div>
  )
}

export default Spinner;