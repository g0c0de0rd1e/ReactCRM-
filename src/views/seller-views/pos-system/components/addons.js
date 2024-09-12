import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';

const AddonsItem = ({ data, selectedValues, handleChange }) => {
  const checked = !!selectedValues.find((item) => item.id === String(data.id));
  const [counter, setCounter] = useState(checked ? data?.product?.min_qty : 0);

  function reduceCounter() {
    setCounter((prev) => prev - 1);
  }

  function addCounter() {
    setCounter((prev) => prev + 1);
  }

  useEffect(() => {
    handleChange(data, counter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  return (
    <div key={data.id} className='mt-2'>
      <Checkbox
        id={String(data.id)}
        name={String(data.id)}
        checked={checked}
        onChange={(event) =>
          setCounter(event.target.checked ? data?.product?.min_qty : 0)
        }
      />
      <label htmlFor={String(data.id)}>
        <span style={{ fontSize: '16px' }} className='ml-2'>
          {data.product.translation.title}
        </span>
        {selectedValues.map(
          (value, index) =>
            parseInt(value.id) === data.id && (
              <span className='ml-3' key={index}>
                <button
                  className='minus-button cursor-pointer'
                  disabled={counter === 0}
                  onClick={reduceCounter}
                >
                  <MinusOutlined />
                </button>

                <span style={{ fontSize: '16px' }} className='ml-2 mr-2'>
                  {counter}
                </span>

                <button
                  className={'plus-button  cursor-pointer'}
                  disabled={counter === data.product?.stock?.quantity}
                  onClick={addCounter}
                >
                  <PlusOutlined />
                </button>
              </span>
            )
        )}
      </label>
    </div>
  );
};

export default AddonsItem;
