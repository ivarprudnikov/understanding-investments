import React, { useCallback, useEffect, useState } from 'react'
import { LineCanvas } from '@nivo/line'
import PropTypes from 'prop-types'

const SavingsGraph = ({ data }) => {
  return (<LineCanvas
    data={data}
    height={400}
    width={600}
    margin={{ top: 5, right: 5, bottom: 120, left: 80 }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -45,
      legend: 'Year',
      legendOffset: 40,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Money',
      legendOffset: -60,
      legendPosition: 'middle'
    }}
    lineWidth={3}
    colors={{ scheme: 'paired' }}
    legends={[{
      anchor: 'bottom',
      direction: 'row',
      translateY: 80,
      itemWidth: 120,
      itemHeight: 18
    }]}
  />)
}
SavingsGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })).isRequired
  })).isRequired
}

export const MillionaireSection = () => {
  const [periodYears, setPeriodYears] = useState(35)
  const [monthlySalary, setMonthlySalary] = useState(1800)
  const [monthlySavings, setMonthlySavings] = useState(0.2)
  const [annualReturn, setAnnualReturn] = useState(0.05)
  const [chartData, setChartData] = useState([])
  const currentYear = new Date().getFullYear()

  const buildSalaryPoints = useCallback(() => {
    const o = {
      id: 'Annual salary',
      data: []
    }
    for (let i = 1; i <= periodYears; i++) {
      o.data.push({
        x: currentYear + i,
        y: monthlySalary * 12
      })
    }
    return o
  }, [currentYear, periodYears, monthlySalary])

  const buildSavingsPoints = useCallback(() => {
    const o = {
      id: 'Savings (cash)',
      data: []
    }
    for (let years = 1; years <= periodYears; years++) {
      o.data.push({
        x: currentYear + years,
        y: monthlySalary * monthlySavings * 12 * years
      })
    }
    return o
  }, [currentYear, periodYears, monthlySavings, monthlySalary])

  const buildCompoundSavingsPoints = useCallback(() => {
    const o = {
      id: 'Savings (invested)',
      data: []
    }
    for (let years = 1; years <= periodYears; years++) {
      o.data.push({
        x: currentYear + years,
        y: Math.pow((1 + annualReturn), years) * monthlySalary * 12 * monthlySavings * years
      })
    }
    return o
  }, [currentYear, periodYears, annualReturn, monthlySalary, monthlySavings])

  useEffect(() => {
    setChartData([
      buildSalaryPoints(),
      buildSavingsPoints(),
      buildCompoundSavingsPoints()
    ])
  }, [buildSalaryPoints, buildSavingsPoints, buildCompoundSavingsPoints])

  return (<section className='container py-3'>
    <h2 className='font-weight-lighter'>Could I become a millionaire?</h2>
    <p className='lead text-muted'>Despite us thinking we need to be celebrities to achieve such riches, there is
      another practical way.
    </p>
    <div className='row'>
      <div className='col-sm-6 mb-4'>
        <form>
          <div className='form-group'>
            <label htmlFor='periodYears'>Savings period (years)</label>
            <input type='number' placeholder='e.g. 35' className='form-control' id='periodYears' aria-describedby='periodYearsHelp' style={{ width: 100 }} value={periodYears} onChange={event => setPeriodYears(event.target.value)} />
            <small id='periodYearsHelp' className='form-text text-muted'>
              For how many years would I save? e.g. until child gets to university or until I intend to retire.
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='monthlySalary'>Monthly income</label>
            <input type='number' placeholder='e.g. 1570' className='form-control' id='monthlySalary' aria-describedby='monthlySalaryHelp' style={{ width: 150 }} value={monthlySalary} onChange={event => setMonthlySalary(event.target.value)} />
            <small id='monthlySalaryHelp' className='form-text text-muted'>
              How much income do you receive each month? e.g. salaries, social insurance or maintenance payments or else.
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='monthlySavings'>What part of the income will you put aside?</label>
            <select id='monthlySavings' style={{ width: 200 }} aria-describedby='monthlySavingsHelp' className='form-control' value={monthlySavings} onBlur={event => setMonthlySavings(event.target.value)}>
              <option value='0.1'>One tenth (10%)</option>
              <option value='0.2'>One fifth (20%)</option>
              <option value='0.25'>Quarter (25%)</option>
              <option value='0.33'>One third (33%)</option>
              <option value='0.5'>Half (50%)</option>
            </select>
            <small id='monthlySavingsHelp' className='form-text text-muted'>
              How much will you save? The idea is &quot;to pay yourself first&quot; when you get your monthly income. It is assumed that after you save that amount you&apos;ll not touch it. Various sources suggest different amounts but most importantly you have to start saving!
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='annualReturn'>Average rate of annual return on investment</label>
            <select id='annualReturn' style={{ width: 200 }} aria-describedby='annualReturnHelp' className='form-control' value={annualReturn} onBlur={event => setAnnualReturn(parseFloat(event.target.value))}>
              <option value='0.005'>Conservative (0.5%)</option>
              <option value='0.01'>Conservative (1%)</option>
              <option value='0.03'>OK (3%)</option>
              <option value='0.05'>Good (5%)</option>
              <option value='0.07'>Very good (7%)</option>
              <option value='0.1'>Great (10%)</option>
              <option value='0.15'>Unreal (15%)</option>
              <option value='0.25'>Selling drugs? (25%)</option>
            </select>
            <small id='annualReturnHelp' className='form-text text-muted'>
              One of the hardest parts to answer. Rate differs depending on where you invest, e.g. National Solidarity Bond (Ireland) has an 0.5% annual return, returns from S&amp;P500 might fluctuate between -43% and 61%. Nobody knows for sure how market will change in the future.
            </small>
          </div>
        </form>
      </div>
      <div className='col-sm-6 mb-4'>
        <SavingsGraph data={chartData} />
      </div>
    </div>
  </section>)
}
