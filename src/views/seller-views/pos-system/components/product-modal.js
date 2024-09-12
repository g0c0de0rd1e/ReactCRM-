import React, { useEffect, useState } from 'react';
import { Button, Col, Descriptions, Image, Modal, Row, Space } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getImage from '../../../../helpers/getImage';
import {
  MinusOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import numberToPrice from '../../../../helpers/numberToPrice';
import { toast } from 'react-toastify';
import getImageFromStock from '../../../../helpers/getImageFromStock';
import { getExtras, sortExtras } from '../../../../helpers/getExtras';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../../../../redux/slices/cart';
import numberToQuantity from '../../../../helpers/numberToQuantity';
import useDidUpdate from '../../../../helpers/useDidUpdate';
import AddonsItem from './addons';

export default function ProductModal({ extrasModal: data, setExtrasModal }) {
  const { t } = useTranslation();
  const [currentStock, setCurrentStock] = useState(data.stock);
  const [counter, setCounter] = useState(data.min_qty || data.quantity);
  const dispatch = useDispatch();
  const [extras, setExtras] = useState([]);
  const [stock, setStock] = useState([]);
  const [showExtras, setShowExtras] = useState({
    extras: [],
    stock: {
      id: 0,
      quantity: 1,
      price: 0,
    },
  });
  const [extrasIds, setExtrasIds] = useState([]);
  const [addons, setAddons] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const { currentBag, currency } = useSelector(
    (state) => state.cart,
    shallowEqual
  );

  useEffect(() => {
    if (showExtras?.stock)
      setCurrentStock({ ...showExtras.stock, extras: extrasIds });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showExtras]);

  useEffect(() => {
    const myData = sortExtras(data);
    setExtras(myData.extras);
    setStock(myData.stock);
    setShowExtras(getExtras('', myData.extras, myData.stock));
    getExtras('', myData.extras, myData.stock).extras?.forEach((element) => {
      setExtrasIds((prev) => [...prev, element[0]]);
    });
  }, [data]);

  const handleExtrasClick = (e) => {
    const index = extrasIds.findIndex(
      (item) => item.extra_group_id === e.extra_group_id
    );
    let array = extrasIds;
    if (index > -1) array = array.slice(0, index);
    array.push(e);
    const nextIds = array.map((item) => item.id).join(',');
    var extrasData = getExtras(nextIds, extras, stock);
    setShowExtras(extrasData);
    extrasData.extras?.forEach((element) => {
      const index = extrasIds.findIndex((item) =>
        element[0].extra_group_id != e.extra_group_id
          ? item.extra_group_id === element[0].extra_group_id
          : item.extra_group_id === e.extra_group_id
      );
      if (element[0].level >= e.level) {
        var itemData =
          element[0].extra_group_id != e.extra_group_id ? element[0] : e;
        if (index == -1) array.push(itemData);
        else {
          array[index] = itemData;
        }
      }
    });
    setExtrasIds(array);
  };

  const handleCancel = () => {
    setExtrasModal(false);
  };

  const handleSubmit = () => {
    const products = addons.map((item) => ({
      stockID: item.stock.id,
      quantity: item.stock.quantity,
    }));
    const orderItem = {
      ...data,
      stock: currentStock,
      quantity: counter,
      id: currentStock.id,
      img: getImageFromStock(currentStock) || data.img,
      bag_id: currentBag,
      stockID: currentStock,
      addons: products,
    };
    if (orderItem.quantity > currentStock.quantity) {
      toast.warning(
        `${t('you.cannot.order.more.than')} ${currentStock.quantity}`
      );
      return;
    }
    dispatch(addToCart(orderItem));
    setExtrasModal(null);
  };

  function addCounter() {
    if (counter === data?.quantity) {
      return;
    }
    if (counter === data.max_qty) {
      return;
    }
    setCounter((prev) => prev + 1);
  }

  function reduceCounter() {
    if (counter === 1) {
      return;
    }
    if (counter <= data.min_qty) {
      return;
    }
    setCounter((prev) => prev - 1);
  }

  function handleAddonClick(list) {
    setAddons(list);
  }

  const handleChange = (item, count) => {
    const value = String(item.id);
    if (!count) {
      setSelectedValues((prev) => prev.filter((el) => el.id !== value));
    } else {
      const newValues = [...selectedValues];
      const idx = newValues.findIndex((el) => el.id == value);
      if (idx < 0) {
        newValues.push({
          id: value,
          quantity: count,
        });
      } else {
        newValues[idx].quantity = count;
      }
      setSelectedValues(newValues);
    }
  };

  useDidUpdate(() => {
    const addons = [];

    selectedValues.forEach((item) => {
      const element = showExtras.stock.addons?.find(
        (el) => String(el.id) == item.id
      );
      const addon = {
        ...element?.product,
        stock: { ...element?.product?.stock, quantity: item?.quantity },
      };
      addons.push(addon);
    });

    handleAddonClick(addons);
  }, [selectedValues]);

  function calculateTotalPrice(priceKey) {
    const addonPrice = addons.reduce(
      (total, item) => (total += item.stock?.price * counter),
      0
    );
    return addonPrice + showExtras?.stock[priceKey || 'price'] * counter;
  }

  return (
    <Modal
      visible={!!data}
      title={data.name}
      onCancel={handleCancel}
      footer={[
        <Button
          icon={<PlusCircleOutlined />}
          key='add-product'
          type='primary'
          onClick={handleSubmit}
        >
          {t('add')}
        </Button>,
        <Button key='cancel-product' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Image
            src={getImage(getImageFromStock(currentStock) || data?.img)}
            alt={data.name}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </Col>
        <Col span={16}>
          <Descriptions title={data.translation?.title}>
            <Descriptions.Item label={t('price')} span={3}>
              <div className={currentStock?.discount ? 'strike' : ''}>
                {numberToPrice(calculateTotalPrice(), currency?.symbol)}
              </div>
              {currentStock?.discount ? (
                <div className='ml-2 font-weight-bold'>
                  {numberToPrice(
                    calculateTotalPrice('total_price'),
                    currency?.symbol
                  )}
                </div>
              ) : (
                ''
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t('in.stock')} span={3}>
              {numberToQuantity(currentStock?.quantity, data?.unit)}
            </Descriptions.Item>
            <Descriptions.Item label={t('tax')} span={3}>
              {numberToPrice(currentStock?.tax, currency?.symbol)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      {showExtras?.extras?.map((item, idx) => (
        <div key={`shop-${idx}`} className='extra-group'>
          <Space key={'extra-group' + idx} className='extras-select'>
            {item?.map((el) => {
              return (
                <span
                  key={el?.group.type + el?.id}
                  className={`extras-text rounded text-lowercase ${
                    !!extrasIds?.find((extra) => extra?.id === el?.id)
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleExtrasClick(el)}
                >
                  {el?.value}
                </span>
              );
            })}
          </Space>
        </div>
      ))}

      {showExtras?.stock?.addons
        ?.filter((item) => !!item?.product)
        .map((item) => (
          <AddonsItem
            key={item?.id + 'addon'}
            data={item}
            selectedValues={selectedValues}
            handleChange={handleChange}
          />
        ))}

      <Row gutter={12} className='mt-3'>
        <Col span={24}>
          <Space>
            <Button
              type='primary'
              icon={<MinusOutlined />}
              onClick={reduceCounter}
            />
            {counter}
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={addCounter}
            />
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}
