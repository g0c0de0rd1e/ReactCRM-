import { Button, Card, Space, Table, Tag, Divider } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import orderServiceSeller from 'services/seller/order';
import orderServiceAdmin from 'services/order';
import Loading from './loading';
import { shallowEqual, useSelector } from 'react-redux';
import moment from 'moment';
import numberToPrice from 'helpers/numberToPrice';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';

const Check = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();
  const componentRef = useRef();
  const navigate = useNavigate();
  const { settings } = useSelector((state) => state.globalSettings);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const userRole = useSelector((state) => state.auth.user?.role);

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (_, row) => row?.stock?.id,
    },
    {
      title: t('product.name'),
      dataIndex: 'product',
      key: 'product',
      render: (_, row) => row.stock?.product.translation?.title,
    },
    {
      title: t('price'),
      dataIndex: 'origin_price',
      key: 'origin_price',
      render: (origin_price, row) =>
        numberToPrice(
          (origin_price || 0) / (row?.quantity || 1),
          defaultCurrency?.symbol,
        ),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('tax'),
      dataIndex: 'tax',
      key: 'tax',
      render: (tax, row) => numberToPrice(tax, defaultCurrency?.symbol),
    },
    {
      title: t('discount'),
      dataIndex: 'discount',
      key: 'discount',
      render: (_, row) => numberToPrice(row?.discount, defaultCurrency?.symbol),
    },
    {
      title: t('total.price'),
      dataIndex: 'total_price',
      key: 'total_price',
      render: (total_price) =>
        numberToPrice(total_price, defaultCurrency?.symbol),
    },
  ];

  function fetchOrder() {
    setLoading(true);
    if (userRole === 'seller') {
      orderServiceSeller
        .getById(id)
        .then(({ data }) => {
          setData(data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      orderServiceAdmin
        .getById(id)
        .then(({ data }) => {
          setData(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Card
      title={t('invoice')}
      extra={
        <Space wrap>
          <Button type='primary' onClick={() => navigate(-1)}>
            <span className='ml-1'>{t('back')}</span>
          </Button>
          <Button
            type='primary'
            onClick={() => handlePrint()}
            ref={componentRef}
          >
            <PrinterOutlined type='printer' />
            <span className='ml-1'>{t('print')}</span>
          </Button>
        </Space>
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <div className='container_check' ref={componentRef}>
          <header className='check_header'>
            <span>
              <img
                src={settings?.favicon}
                alt='img'
                className='check_icon overflow-hidden w-25 h-25 rounded'
              />
              <h1>Invoice</h1>
            </span>
            <span className='check_companyInfo'>
              <h1>{settings?.title}</h1>
              <h5>{settings?.address}</h5>
            </span>
          </header>
          <main>
            <span>
              <h4>
                {t('order.id')}: {data?.id}
              </h4>
              <p>{moment(data?.created_at).format('DD/M/YYYY')}</p>
              <address>
                <p>
                  <span>
                    {t('delivery.type')}: {data?.delivery_type}
                  </span>
                  <br />
                  <span>
                    {t('delivery.address')}: {data?.address?.city}
                  </span>
                  <br />
                  <span>
                    {t('delivery.date')}: {data?.delivery_date}{' '}
                    {data?.delivery_time}
                  </span>
                  <br />
                  <span>
                    {t('delivery.fee')}: {data?.delivery_fee}{' '}
                  </span>
                  <br />
                  <span>
                    {t('tax')}: {data?.tax}
                  </span>
                  <br />
                  <span>
                    {t('status')}: <Tag color='green'>{data?.status}</Tag>
                  </span>
                  <br />
                  <span>
                    {t('note')}: {data?.note}
                  </span>
                </p>
              </address>
            </span>
            <span>
              <h3 className='shop_data'>{data?.shop?.type}</h3>
              <span>
                {t('title')}: {data?.shop?.translation?.title}
              </span>
              <br />
              <span>
                {t('id')}: {data?.shop?.id}
              </span>
              <br />
              <span>
                {t('address')}: {data?.shop?.translation?.address}
              </span>
              <br />
              <span>
                {t('phone')}: {data?.shop?.phone}
              </span>
            </span>
          </main>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={data?.details || []}
            loading={loading}
            rowKey={(record) => record.id}
            pagination={false}
            className={'check_table'}
          />
          <footer>
            <span>
              {data?.origin_price && (
                <>
                  <span>{t('product.price')}</span>
                  <h3 style={{ marginBottom: '10px' }}>
                    {numberToPrice(data?.origin_price, defaultCurrency?.symbol)}
                  </h3>
                </>
              )}
              {data?.delivery_fee && (
                <>
                  <span>{t('delivery.fee')}</span>
                  <h3 style={{ marginBottom: '10px' }}>
                    {numberToPrice(data?.delivery_fee, defaultCurrency?.symbol)}
                  </h3>
                </>
              )}
              {data?.service_fee && (
                <>
                  <span>{t('service.fee')}</span>
                  <h3 style={{ marginBottom: '10px' }}>
                    {numberToPrice(data?.service_fee, defaultCurrency?.symbol)}
                  </h3>
                </>
              )}
              {data?.tax && (
                <>
                  <span>{t('order.tax')}</span>
                  <h3 style={{ marginBottom: '10px' }}>
                    {numberToPrice(data?.tax, defaultCurrency?.symbol)}
                  </h3>
                </>
              )}
              {data?.total_discount && (
                <>
                  <span>{t('total.discount')}</span>
                  <h3 style={{ marginBottom: '10px' }}>
                    {numberToPrice(
                      data?.total_discount,
                      defaultCurrency?.symbol,
                    )}
                  </h3>
                </>
              )}
              <Divider />
              <span>{t('total.price')}</span>
              <h1>
                {numberToPrice(data?.total_price, defaultCurrency?.symbol)}
              </h1>
            </span>
          </footer>
          <section className='text-center'>
            © {moment(new Date()).format('YYYY')} {settings?.title}.{' '}
            {t('all.rights.reserved')}
          </section>
        </div>
      )}
    </Card>
  );
};

export default Check;
