import React from 'react';
import Filter from './filter';
import { Col, Row } from 'antd';
import OrderTabs from './booking-tabs';
import BookingMain from './booking-main';

export default function SellerBooking() {
  return (
    <div className='booking-card'>
      <Row gutter={24}>
        <Col span={17}>
          <div className='booking-card-main'>
            <Filter />
            <BookingMain />
          </div>
        </Col>
        <Col span={7}>
          <OrderTabs />
        </Col>
      </Row>
    </div>
  );
}
