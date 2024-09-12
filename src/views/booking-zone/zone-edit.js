import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, removeFromMenu, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import bookingZoneService from 'services/seller/booking-zone';
import MediaUpload from 'components/upload';
import TextArea from 'antd/es/input/TextArea';

const BookingZoneEdit = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : []
  );
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const createImages = (items) =>
    items.map((item) => ({
      uid: item.id,
      name: item.path,
      url: item.path,
    }));

  const fetchBox = (id) => {
    setLoading(true);
    const params = {
      shop_id: myShop?.id,
    };
    bookingZoneService
      .getById(id, params)
      .then((res) => {
        let data = res.data;
        form.setFieldsValue({
          ...data,
          title: {
            [defaultLang]: data.translation.title,
          },
          description: {
            [defaultLang]: data.translation?.description,
          },
        });
        setImage(createImages(data.galleries));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const onFinish = (values) => {
    const body = {
      ...values,
      area: String(values.area),
      images: image?.map((img) => img.name),
      shop_id: myShop?.id,
    };
    setLoadingBtn(true);
    const nextUrl = 'booking/zone';
    bookingZoneService
      .update(id, body)
      .then(() => {
        toast.success(t('successfully.created'));
        navigate(`/${nextUrl}`);
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchBox(id);
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('edit.booking.zone')}
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
            {languages.map((item) => (
              <Form.Item
                key={'title' + item.id}
                label={t('title')}
                name={['title', item.locale]}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && item.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value?.length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('area')}
              name='area'
              rules={[
                { required: true, message: t('required') },
                {
                  validator(_, value) {
                    if (value < 1) {
                      return Promise.reject(new Error(t('must.be.at.least.1')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className='w-100' />
            </Form.Item>
          </Col>
          <Col span={24}>
            {languages.map((item) => (
              <Form.Item
                key={'description' + item.id}
                name={['description', item.locale]}
                hidden={item.locale !== defaultLang}
                label={t('description')}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && item.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value?.length < 5) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.5'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
            ))}
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('image')}
              name='images'
              rules={[
                {
                  validator(_, value) {
                    if (image?.length === 0) {
                      return Promise.reject(t('required'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MediaUpload
                type='shop-galleries'
                imageList={image}
                setImageList={setImage}
                form={form}
                multiple={true}
              />
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

export default BookingZoneEdit;
