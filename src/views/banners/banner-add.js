import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row, Switch } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../redux/slices/menu';
import { fetchBanners } from '../../redux/slices/banner';
import { DebounceSelect } from '../../components/search';
import bannerService from '../../services/banner';
import { useTranslation } from 'react-i18next';
import getTranslationFields from '../../helpers/getTranslationFields';
import LanguageList from '../../components/language-list';
import MediaUpload from '../../components/upload';
import productService from '../../services/product';

const BannerAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [image, setImage] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values) => {
    const body = {
      products: values.products?.map((i) => i.value),
      images: image.map((image) => image.name),
      url: values.url,
      clickable: values.clickable,
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      button_text: getTranslationFields(languages, values, 'button_text'),
    };
    setLoadingBtn(true);
    const nextUrl = 'banners';
    bannerService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchBanners());
      })
      .finally(() => setLoadingBtn(false));
  };

  function fetchProductOptions(search) {
    const params = {
      search,
      perPage: 10,
    };
    return productService.getAll(params).then((res) => formatProduct(res.data));
  }

  function formatProduct(data) {
    return data.map((item) => ({
      label: item?.translation?.title,
      value: item.id,
    }));
  }

  return (
    <Card title={t('add.banner')} className='h-100' extra={<LanguageList />}>
      <Form
        name='banner-add'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ clickable: true, ...activeMenu.data }}
        className='d-flex flex-column h-100'
      >
        <Row gutter={12}>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'title' + item.locale}
                label={t('title')}
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
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'description' + item.locale}
                label={t('description')}
                name={`description[${item.locale}]`}
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
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'button_text' + item.locale}
                label={t('button.text')}
                name={`button_text[${item.locale}]`}
                hidden={item.locale !== defaultLang}
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
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            <Form.Item
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value?.length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              label={t('url')}
              name={'url'}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('products')}
              name={'products'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                mode='multiple'
                fetchOptions={fetchProductOptions}
                debounceTimeout={200}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('clickable')}
              name='clickable'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  validator(_, value) {
                    if (image.length === 0) {
                      return Promise.reject(new Error(t('required')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              label={t('image')}
              name='images'
            >
              <MediaUpload
                type='products'
                imageList={image}
                setImageList={setImage}
                form={form}
                length='1'
                multiple={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className='flex-grow-1 d-flex flex-column justify-content-end'>
          <div className='pb-5'>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('submit')}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default BannerAdd;
