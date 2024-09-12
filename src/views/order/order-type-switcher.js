import React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Radio } from 'antd';
import { BsList } from 'react-icons/bs';
import { RiDashboardLine } from 'react-icons/ri';
import { setMenu } from '../../redux/slices/menu';

const orderViewTypes = [
  {
    value: 'orders-board',
    title: 'Board',
    icon: <RiDashboardLine size={20} />,
  },
  {
    value: 'orders',
    title: 'List',
    icon: <BsList size={20} />,
  },
];

const OrderTypeSwitcher = ({ listType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { type } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const handleChangeType = (e) => {
    dispatch(
      setMenu({ ...activeMenu, url: 'orders', id: 'orders', refetch: true })
    );
    navigate(`/${e.target.value}${type ? `/${type}` : ''}`);
  };

  return (
    <Radio.Group
      value={listType}
      onChange={handleChangeType}
      className='float-right'
      buttonStyle='solid'
    >
      {orderViewTypes?.map((item) => {
        return (
          <Radio.Button value={item.value} key={item.value}>
            <div className='d-flex align-items-center' style={{ gap: '10px' }}>
              {item.icon}
              {item.title}
            </div>
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};

export default OrderTypeSwitcher;
