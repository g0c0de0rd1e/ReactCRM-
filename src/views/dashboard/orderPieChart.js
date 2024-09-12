import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import ChartWidget from '../../components/chart-widget';

const OrderPieChart = ({ counts }) => {
  const { t } = useTranslation();

  return (
    <Card title={t('orders')}>
      <ChartWidget
        type='pie'
        series={[
          counts.progress_orders_count || 0,
          counts.delivered_orders_count || 0,
          counts.cancel_orders_count || 0,
        ]}
        xAxis={[
          t('in.progress.orders'),
          t('delivered.orders'),
          t('canceled.orders'),
        ]}
        customOptions={{
          labels: [
            t('in.progress.orders'),
            t('delivered.orders'),
            t('canceled.orders'),
          ],
        }}
      />
    </Card>
  );
};

export default OrderPieChart;
