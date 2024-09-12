import React, { useMemo, useState } from 'react';
import { Empty, Pagination, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import BookingModal from './booking-modal';
import { fetchAdminBookingTable } from 'redux/slices/booking-tables';
import { useDispatch } from 'react-redux';
import useDidUpdate from 'helpers/useDidUpdate';

export default function BookingTableCard() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(null);
  const dispatch = useDispatch();
  const { tables, loading, meta } = useSelector(
    (state) => state.bookingTable,
    shallowEqual
  );
  const { data } = useSelector((state) => state.booking, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);

  const { current_zone, loading: zoneLoading } = useSelector(
    (state) => state.bookingZone,
    shallowEqual
  );

  const max_count = {
    count: Math.max(...tables?.map((c) => c?.chair_count)),
    percent: 33,
  };

  const params = useMemo(
    () => ({
      shop_section_id: current_zone?.id,
      status: data.current_tab === 'all' ? undefined : data.current_tab,
      free_from: data?.free_from ? data?.free_from : undefined,
      shop_id: myShop.id,
    }),
    [current_zone, data, myShop]
  );

  function onChangePagination(page) {
    dispatch(
      fetchAdminBookingTable({
        shop_section_id: current_zone?.id,
        shop_id: myShop.id,
        status: data.current_tab === 'all' ? undefined : data.current_tab,
        free_from: data?.free_from ? data?.free_from : undefined,
        perPage: 10,
        page,
      })
    );
  }

  useDidUpdate(() => {
    dispatch(fetchAdminBookingTable(params));
  }, [params]);

  return (
    <div className='container-fluid'>
      <div className='table_main'>
        {loading || zoneLoading ? (
          <div className='empty'>
            <Spin style={{ height: '120px' }} />
          </div>
        ) : (
          tables?.map((item, idx) => {
            const residual = item.chair_count >= 12 ? 2 : 1;
            return (
              <div
                key={item.name + '_' + idx}
                className='table_container'
                onClick={() => setOpenModal(item)}
                style={{
                  width: `${
                    item.chair_count <= 3
                      ? 10
                      : (item.chair_count / max_count.count) * max_count.percent
                  }%`,
                }}
              >
                <div className='table_chair_top'>
                  {Array.from(
                    {
                      length: Math.ceil(item.chair_count / 2) - residual,
                    },
                    (_, y) => (
                      <span key={y}></span>
                    )
                  )}
                </div>

                <div className='table_card'>
                  <div className='table_chair_left'>
                    {Array.from({ length: residual }, (_, y) => (
                      <span key={y}></span>
                    ))}
                  </div>
                  <div className='label'>{item.name}</div>
                  {item.chair_count > 1 && (
                    <div className='table_chair_right'>
                      {Array.from({ length: residual }, (_, y) => (
                        <span key={y}></span>
                      ))}
                    </div>
                  )}
                </div>

                <div className='table_chair_bottom'>
                  {Array.from(
                    {
                      length: Math.floor(item.chair_count / 2) - residual,
                    },
                    (_, y) => (
                      <span key={y}></span>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
        {!tables.length > 0 && (
          <div className='empty'>
            <Empty
              image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
              description={<span>{t('no.data')}</span>}
              style={{ height: '120px' }}
            />
          </div>
        )}
      </div>

      {openModal && (
        <BookingModal
          visible={openModal}
          handleCancel={() => setOpenModal(null)}
        />
      )}

      <div className='d-flex justify-content-end my-5'>
        <Pagination
          total={meta.total}
          current={params.page}
          pageSize={10}
          showSizeChanger={false}
          onChange={onChangePagination}
        />
      </div>
    </div>
  );
}
