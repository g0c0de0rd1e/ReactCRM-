import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, removeFromMenu, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import sellerBookingTable from 'services/booking-table';
import { AsyncSelect } from 'components/async-select';
import BookingZone from 'services/booking-zone';
import { fetchAdminBookingTable } from 'redux/slices/booking-tables';

const BookingTableEdit = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const fetchBox = (id) => {
    setLoading(true);
    const params = {
      shop_id: myShop?.id,
    };
    sellerBookingTable
      .getById(id, params)
      .then((res) => {
        let data = res.data;
        form.setFieldsValue({
          ...data,
          shop_section_id: {
            label: data.shop_section?.translation?.title,
            value: data.shop_section?.id,
          },
        });
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const onFinish = (values) => {
    const body = {
      ...values,
      chair_count: String(values.chair_count),
      shop_section_id: values.shop_section_id.value,
      shop_id: myShop?.id,
    };
    setLoadingBtn(true);
    const nextUrl = 'booking/tables';
    sellerBookingTable
      .update(id, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(fetchAdminBookingTable());
        navigate(`/${nextUrl}`);
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .finally(() => setLoadingBtn(false));
  };

  function fetchZone() {
    const params = {
      shop_id: myShop?.id,
    };
    return BookingZone.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }))
    );
  }

  useEffect(() => {
    if (activeMenu.refetch) fetchBox(id);
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('edit.booking.table')}
      extra={<LanguageList />}
      loading={loading}
    >
      <Form
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ active: true, ...activeMenu.data }}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('zona')}
              name={'shop_section_id'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <AsyncSelect fetchOptions={fetchZone} debounceTimeout={300} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label='name'
              name={`name`}
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value?.length < 2) {
                      return Promise.reject(
                        new Error(t('must.be.at.least.2 '))
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('chair.count')}
              name='chair_count'
              rules={[
                { required: true, message: t('required') },
                {
                  type: 'number',
                  min: 1,
                  message: t('must.be.at.least.1'),
                },
              ]}
            >
              <InputNumber className='w-100' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('tax')}
              name='tax'
              rules={[
                { required: true, message: t('required') },
                {
                  type: 'number',
                  min: 0,
                  message: t('must.be.at.least.0'),
                },
              ]}
            >
              <InputNumber className='w-100' />
            </Form.Item>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Card>
  );
};

export default BookingTableEdit;
