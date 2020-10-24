import React from 'react';
import { LineCanvas } from '@nivo/line';

const periodYears = 30
const monthlySalary = 1800
const monthlySavingsPercentage = 0.1
const annualReturn = 0.03
const currentYear = new Date().getFullYear()

const buildSalaryDatapoints = () => {
  const o = {
    id: 'salary',
    data: []
  }
  for (let i = 1; i <= periodYears; i++) {
    o.data.push({
      x: currentYear + i,
      y: monthlySalary * 12
    })
  }
  return o
}
const buildSavingsDatapoints = () => {
  const o = {
    id: 'savings',
    data: []
  }
  for (let years = 1; years <= periodYears; years++) {
    o.data.push({
      x: currentYear + years,
      y: monthlySalary * monthlySavingsPercentage * 12 * years
    })
  }
  return o
}


const data = [
  buildSalaryDatapoints(),
  buildSavingsDatapoints()
];

export const HomePage = () => {
  return (<>
    <section className="position-relative py-4 py-md-5 mb-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 order-md-2">

          </div>
          <div className="col-12 col-md-6 order-md-1">

            <h1 className="display-4">
              Understanding <br/>
              <span className="text-primary small">investments &amp; savings</span>.
            </h1>

            <p className="lead text-muted mb-6 mb-md-8">
              How much should/could I save? Where do I start? How to invest?
              Similar questions bothered me for a while.
              Let's draw some graphs to see the money better.
            </p>

          </div>
        </div>
      </div>
    </section>

    <section className="container py-3">
      <div className="row">
        <div className="col-sm-6 mb-4">
          <h3 className="font-weight-lighter">Could I become a millionaire?</h3>
          <p className="text-muted">Despite us thinking we need to be celebrities to achieve such riches, there is
            another practical way.</p>
        </div>
        <div className="col-sm-6 mb-4">

          <LineCanvas data={data}
                      height={300}
                      width={600}
                      margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
                      pointSize={8}
                      pointColor={{theme: 'background'}}
                      pointBorderWidth={2}
                      pointBorderColor={{theme: 'background'}} />

          <p className="text-muted">Reaching your million via untaxed savings</p>
        </div>
      </div>
    </section>

  </>);
};
