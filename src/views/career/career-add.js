import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Switch } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LanguageList from '../../components/language-list';
import TextArea from 'antd/es/input/TextArea';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../redux/slices/menu';
import careerService from '../../services/career';
import { useTranslation } from 'react-i18next';
import AddressInput from 'components/address-input';
import Map from 'components/map';
import { DebounceSelect } from 'components/search';
import careerCategoryService from 'services/category';
import getDefaultLocation from 'helpers/getDefaultLocation';
import { fetchCareer } from 'redux/slices/career';
import CkeEditor from 'components/ckeEditor';

const CareerAdd = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const [location, setLocation] = useState(
    activeMenu?.data?.location
      ? {
          lat: parseFloat(activeMenu?.data?.location?.latitude),
          lng: parseFloat(activeMenu?.data?.location?.longitude),
        }
      : getDefaultLocation(settings)
  );

  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      ...values,
      active: values.active ? 1 : 0,
      'location[latitude]': location.lat,
      'location[longitude]': location.lng,
      category_id: values.category_id.value,
    };
    const nextUrl = 'catalog/career';
    careerService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchCareer());
        navigate(`/${nextUrl}`);
      })
      .catch((err) => console.error(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  async function fetchCareerList(search) {
    const params = {
      search: search,
      type: 'career',
    };

    return careerCategoryService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation ? item.translation.title : 'no name',
        value: item.id,
      }))
    );
  }

  return (
    <Card title={t('add.career')} extra={<LanguageList />}>
      <Form
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          parent_id: { title: '---', value: 0, key: 0 },
          active: true,
          ...activeMenu.data,
        }}
        form={form}
      >
        <Row gutter={12}>
          <Col span={12}>
            {languages.map((item, index) => (
              <Form.Item
                key={item.title + index}
                label={t('name')}
                name={`title[${item.locale}]`}
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
                <Input placeholder={t('name')} />
              </Form.Item>
            ))}
          </Col>

          <Col span={12}>
            <CkeEditor form={form} lang={defaultLang} languages={languages} />
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('category')}
              name='category_id'
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect fetchOptions={fetchCareerList} />
            </Form.Item>
          </Col>

          <Col span={12}>
            {languages.map((item, index) => (
              <Form.Item
                key={item.locale + index}
                label={t('location')}
                name={`address[${item.locale}]`}
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
              label={t('active')}
              name='active'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={12} />

          <Col span={24} className='mb-5' />
        </Row>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Card>
  );
};
export default CareerAdd;
