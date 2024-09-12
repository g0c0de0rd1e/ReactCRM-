import React, { useEffect, useMemo } from 'react';
import { Button, Card, Form } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchBookingZone, setCurrentZone } from 'redux/slices/booking-zone';
import { disableRefetch } from 'redux/slices/menu';
import { fetchBookingStatistics } from 'redux/slices/bookingStatistics';
import { useTranslation } from 'react-i18next';
import Loading from 'components/loading';
import moment from 'moment';

export default function OrderTabs() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { data } = useSelector((state) => state.booking, shallowEqual);
  const { current_zone, zone, loading } = useSelector(
    (state) => state.bookingZone,
    shallowEqual
  );
  const { statistics, loading: statisticsLoading } = useSelector(
    (state) => state.bookingStatistics,
    shallowEqual
  );

  const params = useMemo(
    () => ({
      shop_section_id: current_zone?.id,
      date_from: data?.free_from
        ? moment(data.free_from, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
        : undefined,
    }),
    [data, current_zone]
  );

  useEffect(() => {
    dispatch(fetchBookingStatistics(params));
  }, [params]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchBookingZone());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const handleChange = (item) => dispatch(setCurrentZone(item));

  return (
    <Card style={{ height: '100%' }}>
      {!loading ? (
        <Form layout='vertical' name='booking-form' form={form}>
          <div className='booking_tabs'>
            {zone.map((item) => (
              <Button
                type={
                  current_zone?.translation?.title === item.translation?.title
                    ? 'primary'
                    : 'text'
                }
                key={item?.id}
                onClick={() => handleChange(item)}
              >
                {item.translation?.title}
              </Button>
            ))}
          </div>
          {!statisticsLoading ? (
            <div className='booking-history'>
              {!!statistics.all_occupied?.length && (
                <div className='booking-history-card'>
                  <h4 className='booking-history-title'>{t('occupied')}</h4>
                  <div className='booking-history-list'>
                    {statistics.all_occupied?.map((item, idx) => (
                      <div
                        key={'occupied' + idx}
                        className='booking-history-item'
                      >
                        <div className='item-table red'>{item.table_name}</div>
                        <div className='item-title'>{item.username}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!!statistics.all_booked?.length && (
                <div className='booking-history-card'>
                  <h4 className='booking-history-title'>{t('booked')}</h4>
                  <div className='booking-history-list'>
                    {statistics.all_booked?.map((item, idx) => (
                      <div
                        key={'booked' + idx}
                        className='booking-history-item'
                      >
                        <div className='item-table orange'>
                          {item.table_name}
                        </div>
                        <div className='item-title'>{item.username}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Loading />
          )}
        </Form>
      ) : (
        <Loading />
      )}
    </Card>
  );
}
