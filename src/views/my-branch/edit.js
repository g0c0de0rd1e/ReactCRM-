import React, { useEffect, useState } from 'react';
import { Card, Steps } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../redux/slices/menu';
import LanguageList from '../../components/language-list';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '../../helpers/useQueryParams';
import BranchpMain from '../branches/main';
import BranchDelivery from '../branches/branchDelivery';
import Loading from '../../components/loading';
import Map from '../../components/shop/map';
import { steps } from './steps';
import { useParams } from 'react-router-dom';
import restaurantService from '../../services/restaurant';
const { Step } = Steps;

export default function MyShopEdit() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const current = Number(queryParams.values?.step || 0);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const [loading, setLoading] = useState(false);
  const { uuid } = useParams();

  const fetchBranch = (uuid) => {
    setLoading(true);
    restaurantService
      .getById(uuid)
      .then((res) => {
        const data = {
          ...res.data,
          ...getLanguageFields(res.data),
          logo_img: createImages(res.data.logo_img),
          background_img: createImages(res.data.background_img),
          user: {
            label: res.data.seller.firstname + ' ' + res.data.seller.lastname,
            value: res.data.seller.id,
          },
          delivery_time_from: res.data?.delivery_time.from,
          delivery_time_to: res.data?.delivery_time.to,
          delivery_time_type: res.data?.delivery_time.type,
          recommended: res.data.mark === 'recommended',
          categories: res.data?.categories?.map((item) => ({
            label: item?.translation?.title,
            value: item.id,
            key: item.id,
          })),
          tags: res.data?.tags.map((item) => ({
            label: item?.translation?.title,
            value: item.id,
            key: item.id,
          })),
        };
        dispatch(setMenuData({ activeMenu, data }));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const createImages = (items) => {
    return {
      items,
      uid: items,
      url: items,
      name: items,
    };
  };

  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.description,
      [`address[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.address,
    }));
    return Object.assign({}, ...result);
  }

  useEffect(() => {
    if (activeMenu.refetch && uuid) {
      fetchBranch(uuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  const next = () => {
    const step = current + 1;
    queryParams.set('step', step);
  };
  const prev = () => {
    const step = current - 1;
    queryParams.set('step', step);
  };

  const onChange = (step) => {
    dispatch(setMenuData({ activeMenu, data: { ...activeMenu.data, step } }));
    queryParams.set('step', step);
  };

  return (
    <Card
      title={myShop.type === 'shop' ? t('shop.edit') : t('restaurant.edit')}
      extra={<LanguageList />}
    >
      <Steps current={current} onChange={onChange}>
        {steps.map((item) => (
          <Step title={t(item.title)} key={item.title} />
        ))}
      </Steps>
      {!loading ? (
        <div className='steps-content'>
          {steps[current].content === 'First-content' && (
            <BranchpMain
              next={next}
              loading={loading}
              action_type={'edit'}
              user={true}
            />
          )}

          {steps[current].content === 'Second-content' && (
            <Map prev={prev} next={next} />
          )}

          {steps[current].content === 'Third-content' && (
            <BranchDelivery prev={prev} nextUrl={'my-branch'} />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </Card>
  );
}
