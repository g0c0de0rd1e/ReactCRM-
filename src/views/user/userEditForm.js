import React, { useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import userService from '../../services/user';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../redux/slices/menu';
import { fetchUsers } from '../../redux/slices/user';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { fetchClients } from '../../redux/slices/client';
import MediaUpload from '../../components/upload';
import { DebounceSelect } from '../../components/search';
import shopService from '../../services/restaurant';
import useDemo from '../../helpers/useDemo';

export default function UserEditForm({
  form,
  data,
  image,
  setImage,
  action_type = '',
}) {
  const { t } = useTranslation();
  const activeMenu = useSelector((list) => list.menu.activeMenu, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uuid } = useParams();
  const locations = useLocation();
  const [date, setDate] = useState();
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const changeData = (dataText) => setDate(dataText);
  const role = activeMenu?.data?.role;
  const user = useSelector((state) => state.user, shallowEqual);
  const client = useSelector((state) => state.client, shallowEqual);
  const { isDemo } = useDemo();

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: isDemo ? undefined : values?.email,
      phone: isDemo ? undefined : values?.phone,
      birthday: moment(date).format('YYYY-MM-DD'),
      gender: values.gender,
      images: image?.map((item) => item.name),
      shop_id:
        values?.shop_id?.length !== undefined
          ? values?.shop_id?.map((item) => item.value)
          : values?.shop_id?.value
          ? [values?.shop_id.value]
          : [],
      role: role,
    };

    const nextUrl =
      locations.pathname.search('/user/delivery/') === 0
        ? 'deliveries/list'
        : data.role !== 'user'
        ? 'users/admin'
        : 'users/user';

    const userParamsData = {
      ...user.params,
      role: data.role,
    };
    const clientParamsData = {
      ...client.params,
    };
    if (action_type === 'edit') {
      userService
        .update(uuid, body)
        .then(() => {
          toast.success(t('successfully.updated'));
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          navigate(`/${nextUrl}`);
          if (data.role === 'user') {
            dispatch(fetchClients(clientParamsData));
          } else {
            dispatch(fetchUsers(userParamsData));
          }
        })
        .catch((err) => setError(err.response.data.params))
        .finally(() => setLoadingBtn(false));
    } else {
      userService
        .create(body)
        .then(() => {
          toast.success(t('successfully.updated'));
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          navigate(`/${nextUrl}`);
          if (data.role === 'user') {
            dispatch(fetchClients(clientParamsData));
          } else {
            dispatch(fetchUsers(userParamsData));
          }
        })
        .catch((err) => {
          setError(err.response.data.params);

          toast.dismiss(400);
          Object.values(err.response.data.params).map((errorItem) =>
            toast.error(t(`${errorItem}`)),
          );
        })
        .finally(() => setLoadingBtn(false));
    }
  };

  async function fetchUserShop(search) {
    const params = { search, status: 'approved' };
    return shopService.search(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation !== null ? item.translation.title : 'no name',
        value: item.id,
      })),
    );
  }

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        gender: 'male',
        role: 'admin',
        ...data,
        birthday: data?.birthday ? moment(data.birthday) : null,
      }}
      onFinish={onFinish}
      className='px-2'
    >
      <Row gutter={12}>
        <Col span={24}>
          <Form.Item
            name={'images'}
            label={t('avatar')}
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
          >
            <MediaUpload
              type={'restaurant/logo'}
              imageList={image}
              setImageList={setImage}
              form={form}
              multiple={false}
              name='logo_img'
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('firstname')}
            name='firstname'
            help={error?.firstname ? error.firstname[0] : null}
            validateStatus={error?.firstname ? 'error' : 'success'}
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error(t('required')));
                  } else if (value && value?.trim() === '') {
                    return Promise.reject(new Error(t('no.empty.space')));
                  } else if (value?.length < 2) {
                    return Promise.reject(new Error(t('must.be.at.least.2 ')));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t('lastname')}
            name='lastname'
            help={error?.lastname ? error.lastname[0] : null}
            validateStatus={error?.lastname ? 'error' : 'success'}
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error(t('required')));
                  } else if (value && value?.trim() === '') {
                    return Promise.reject(new Error(t('no.empty.space')));
                  } else if (value?.length < 2) {
                    return Promise.reject(new Error(t('must.be.at.least.2 ')));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t('phone')}
            name='phone'
            help={error?.phone ? error.phone[0] : null}
            validateStatus={error?.phone ? 'error' : 'success'}
            rules={[
              { required: !isDemo, message: t('required') },
              {
                validator(_, value) {
                  if (value < 0) {
                    return Promise.reject(new Error(t('must.be.at.least.0')));
                  } else if (value?.toString().length < 7) {
                    return Promise.reject(new Error(t('must.be.at.least.7')));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t('birthday')}
            name='birthday'
            rules={[{ required: true, message: t('required') }]}
          >
            <DatePicker
              onChange={changeData}
              className='w-100'
              disabledDate={(current) => moment().add(-18, 'years') <= current}
              defaultPickerValue={moment().add(-18, 'years')}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t('gender')}
            name='gender'
            rules={[{ required: true, message: t('required') }]}
          >
            <Select picker='dayTime' className='w-100'>
              <Select.Option value='male'>{t('male')}</Select.Option>
              <Select.Option value='female'>{t('female')}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t('email')}
            name='email'
            help={error?.email ? error.email[0] : null}
            validateStatus={error?.email ? 'error' : 'success'}
            rules={[
              { required: !isDemo, message: t('required') },
              {
                type: 'email',
                message: t('email.is.not.valid'),
              },
            ]}
          >
            <Input type='email' className='w-100' disabled={isDemo} />
          </Form.Item>
        </Col>

        {role !== 'admin' &&
          role !== 'manager' &&
          role !== 'moderator' &&
          role !== 'seller' &&
          role !== 'user' && (
            <Col span={12}>
              <Form.Item
                label={t('branches')}
                name='shop_id'
                rules={[{ required: false, message: t('required') }]}
              >
                <DebounceSelect
                  mode={role === 'deliveryman' ? 'multiple' : 'single'}
                  fetchOptions={fetchUserShop}
                  className='w-100'
                  placeholder={t('select.shop')}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
          )}

        {role === 'moderator' && (
          <Col span={12}>
            <Form.Item
              label={t('branches')}
              name='shop_id'
              rules={[{ required: false, message: t('required') }]}
            >
              <DebounceSelect
                fetchOptions={fetchUserShop}
                className='w-100'
                placeholder={t('select.shop')}
                allowClear={false}
              />
            </Form.Item>
          </Col>
        )}

        <Col span={24}>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('save')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
