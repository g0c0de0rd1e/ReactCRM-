import React from 'react';
import { Button, DatePicker, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { setBookingData } from 'redux/slices/booking';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

const tabs = [
  { label: 'all', value: '1' },
  { label: 'available', value: '2' },
  { label: 'booked', value: '3' },
  { label: 'occupied', value: '4' },
];

const Filter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.booking, shallowEqual);

  const onChange = (_, dateString) => {
    dispatch(setBookingData({ free_from: dateString }));
  };

  return (
    <>
      <span className='booking_header'>
        <h2 className='booking_title'>{t('tables')}</h2>
        <DatePicker
          showTime
          onChange={onChange}
          format='YYYY-MM-DD HH:mm'
          className='booking_date'
        />
      </span>
      <Space>
        {tabs.map((item, idx) => (
          <Button
            key={idx}
            type={data.current_tab === item.label ? 'primary' : ''}
            onClick={() =>
              dispatch(setBookingData({ current_tab: item.label }))
            }
            className='booking_header_button'
          >
            {t(item.label === 'all' ? 'all.tables' : item.label)}
          </Button>
        ))}
      </Space>
    </>
  );
};
export default Filter;
