import React, { useCallback, useEffect, useState } from 'react'
import { LineCanvas } from '@nivo/line'
import PropTypes from 'prop-types'

const Graph = ({ data }) => {
  return (<LineCanvas
    data={data}
    height={600}
    width={600}
    margin={{ top: 5, right: 5, bottom: 120, left: 80 }}
    yScale={{
      type: 'linear',
      min: -500000,
      max: 1000000,
    }}

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
      tickRotation: 0
    }}
    lineWidth={3}
    colors={{ scheme: 'paired' }}
    legends={[{
      anchor: 'bottom',
      direction: 'row',
      translateY: 80,
      itemWidth: 150,
      itemHeight: 18
    }]}
  />)
}
Graph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })).isRequired
  })).isRequired
}

export const HousingSection = () => {

  const [deposit, setDeposit] = useState(30000)
  const [mortgage, setMortgage] = useState(300000)
  const [mortgageTerm, setMortgageTerm] = useState(28)
  const [apr, setApr] = useState(0.03)
  const [monthlyRent, setMonthlyRent] = useState(1250)
  const [monthlyInvestment, setMonthlyInvestment] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(0.05)
  const [chartData, setChartData] = useState([])

  const currentYear = new Date().getFullYear()
  const buildRentPoints = useCallback(() => {
    const o = {
      id: 'Annual rent',
      data: []
    }
    for (let i = 1; i <= mortgageTerm; i++) {
      o.data.push({
        x: currentYear + i,
        y: monthlyRent * 12 * i * -1
      })
    }
    return o
  }, [currentYear, mortgageTerm, monthlyRent])

  const buildInvestmentPoints = useCallback(() => {
    const o = {
      id: 'Remainder (invested)',
      data: []
    }
    for (let years = 1; years <= mortgageTerm; years++) {
      o.data.push({
        x: currentYear + years,
        y: Math.pow((1 + annualReturn), years) * (monthlyInvestment * 12 * (years - 1) + deposit) + monthlyInvestment * 12
      })
    }
    return o
  }, [currentYear, mortgageTerm, annualReturn, monthlyInvestment, deposit])

  useEffect(() => {
    setChartData([
      buildRentPoints(),
      buildInvestmentPoints()
    ])
  }, [buildRentPoints, buildInvestmentPoints])

  return (<section className='container py-3'>
    <h2 className='font-weight-lighter'>Mortgage vs rent</h2>
    <p className='lead text-muted'>Mortgage does have a price - interest, but is renting more expensive provided we invest the remainder?</p>
    <div className='row'>
      <div className='col-sm-6 mb-4'>
        <form>

        </form>
      </div>
      <div className='col-sm-6 mb-4'>
        <Graph data={chartData} />
      </div>
    </div>
  </section>)
}
