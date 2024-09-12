import React, { useState } from 'react';
import { Steps, Card, Row } from 'antd';
import { steps } from './steps';
import ProjectInfo from './project-info';
import DatabaseInfo from './database-info';
import UserInfo from './user-info';
import License from './license';
import ProjectAccessInfo from './project-access-info';

const { Step } = Steps;

export default function GlobalSettings() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent(current + 1);

  return (
    <div className='global-settings'>
      <Card title='Project installation'>
        <Steps current={current} className='mb-2'>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </Card>
      <Row hidden={steps[current].content !== 'First-content'}>
        <License next={next} />
      </Row>
      <Row hidden={steps[current].content !== 'Second-content'}>
        <ProjectInfo next={next} />
      </Row>
      <Row hidden={steps[current].content !== 'Third-content'}>
        <ProjectAccessInfo next={next} />
      </Row>
      <Row hidden={steps[current].content !== 'Fourth-content'}>
        <DatabaseInfo next={next} />
      </Row>
      <Row hidden={steps[current].content !== 'Fifth-content'}>
        <UserInfo />
      </Row>
    </div>
  );
}
