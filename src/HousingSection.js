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
  const [interest, setInterest] = useState(0.03)
  const [propertyPrice, setPropertyPrice] = useState(0)
  const [monthlyMortgage, setMonthlyMortgage] = useState(0)
  const [monthlyRent, setMonthlyRent] = useState(1250)
  const [monthlyInvestment, setMonthlyInvestment] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(0.05)
  const [chartData, setChartData] = useState([])

  const currentYear = new Date().getFullYear()

  const buildMortgagePoints = useCallback(() => {
    const o = {
      id: 'Annual mortgage',
      data: []
    }
    for (let i = 1; i <= mortgageTerm; i++) {
      o.data.push({
        x: currentYear + i,
        y: monthlyMortgage * 12 * i * -1
      })
    }
    return o
  }, [currentYear, mortgageTerm, monthlyMortgage])

  const buildPrincipalPoints = useCallback(() => {
    const o = {
      id: 'Principal',
      data: []
    }
    for (let i = 1; i <= mortgageTerm; i++) {
      // Loan outstanding after period = P * [(1 + r)n – (1 + r)m] / [(1 + r)n – 1]
      const P = mortgage;
      const r = interest;
      const n = mortgageTerm;
      let paidPrincipal = 0;
      for (let j = 1; j <= i; j++) {
        const loanRemainderAtTheStart = P * (Math.pow(1 + r, n) - Math.pow(1 + r, j - 1)) / (Math.pow(1 + r, n) - 1);
        const loanRemainderAtTheEnd = P * (Math.pow(1 + r, n) - Math.pow(1 + r, j)) / (Math.pow(1 + r, n) - 1);
        paidPrincipal += (loanRemainderAtTheStart - loanRemainderAtTheEnd);
      }
      o.data.push({
        x: currentYear + i,
        y: Math.round(paidPrincipal)
      })
    }
    return o
  }, [currentYear, mortgageTerm, interest, mortgage])

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
        y: Math.round(Math.pow((1 + annualReturn), years) * (monthlyInvestment * 12 * (years - 1) + deposit) + monthlyInvestment * 12)
      })
    }
    return o
  }, [currentYear, mortgageTerm, annualReturn, monthlyInvestment, deposit])

  useEffect(() => {
    setPropertyPrice(deposit + mortgage)
  }, [deposit, mortgage])

  useEffect(() => {
    const diff = monthlyMortgage - monthlyRent;
    setMonthlyInvestment(diff > 0 ? diff : 0);
  }, [monthlyMortgage, monthlyRent])

  useEffect(() => {
    // Fixed Monthly Payment = P * r * (1 + r)n / [(1 + r)n – 1]
    const P = mortgage;
    const r = interest / 12;
    const n = mortgageTerm * 12;
    const payment = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const withoutFractions = Math.round(payment);
    setMonthlyMortgage(withoutFractions);
  }, [mortgageTerm, deposit, interest, mortgage])

  useEffect(() => {
    setChartData([
      buildMortgagePoints(),
      buildPrincipalPoints(),
      buildRentPoints(),
      buildInvestmentPoints()
    ])
  }, [buildMortgagePoints, buildPrincipalPoints, buildRentPoints, buildInvestmentPoints])

  return (<section className='container py-3'>
    <h2 className='font-weight-lighter'>Mortgage vs rent</h2>
    <p className='lead text-muted'>Mortgage does have a price - interest, but is renting more expensive provided we invest the remainder?</p>
    <div className='row'>
      <div className='col-sm-6 mb-4'>
        <form>
          <div className='form-group'>
            <label htmlFor='periodYears'>Mortgage term (years)</label>
            <input type='number' placeholder='e.g. 35' className='form-control' id='periodYears' style={{ width: 100 }} value={mortgageTerm} onChange={event => setMortgageTerm(parseFloat(event.target.value))} />
          </div>

          <div className='form-group'>
            <label htmlFor='mortgage'>Mortgage</label>
            <input type='number' placeholder='e.g. 280000' className='form-control' id='mortgage' aria-describedby='mortgageHelp' style={{ width: 150 }} value={mortgage} onChange={event => setMortgage(parseFloat(event.target.value))} />
            <small id='mortgageHelp' className='form-text text-muted'>
              The amount you need to borrow in addition to your deposit to buy the property.
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='interest'>Annual interest on mortgage</label>
            <input type='number' placeholder='e.g. 3.35' className='form-control' id='interest' aria-describedby='interestHelp' style={{ width: 150 }} value={interest} onChange={event => setInterest(parseFloat(event.target.value))} />
            <small id='interestHelp' className='form-text text-muted'>
              You can try the interest rate or the APR here. Calculation will assume it as being fixed throughout the period of the mortgage. Variable interest rate would produce different results but it is difficult to forecast it.
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='deposit'>Savings/down payment/deposit</label>
            <input type='number' placeholder='e.g. 65000' className='form-control' id='deposit' aria-describedby='depositHelp' style={{ width: 150 }} value={deposit} onChange={event => setDeposit(parseFloat(event.target.value))} />
            <small id='depositHelp' className='form-text text-muted'>
              How much do you have saved already towards the purchase? You would invest it if not buying a house.
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='price'>Calculated property price</label>
            <input type='number' className='form-control' id='price' style={{ width: 150 }} value={propertyPrice} disabled={true} />
          </div>

          <div className='form-group'>
            <label htmlFor='monthlyMortgage'>Calculated monthly mortgage payment</label>
            <input type='number' className='form-control' id='monthlyMortgage' style={{ width: 150 }} value={monthlyMortgage} disabled={true} />
          </div>

          <div className='form-group'>
            <label htmlFor='monthlyRent'>Monthly rent</label>
            <input type='number' placeholder='e.g. 1800' className='form-control' id='monthlyRent' aria-describedby='monthlyRentHelp' style={{ width: 150 }} value={monthlyRent} onChange={event => setMonthlyRent(parseFloat(event.target.value))} />
            <small id='monthlyRentHelp' className='form-text text-muted'>
              A rent you&apos;d pay if not buying the property with mortgage and savings
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='monthlyInvestment'>Investable monthly difference</label>
            <input type='number' className='form-control' id='monthlyInvestment' aria-describedby='monthlyInvestmentHelp' style={{ width: 150 }} value={monthlyInvestment} disabled={true} />
            <small id='monthlyInvestmentHelp' className='form-text text-muted'>
              The difference between mortgage payment and rent you&apos;d invest
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='annualReturn'>Average rate of annual return on investment</label>
            <select id='annualReturn' style={{ width: 200 }} aria-describedby='annualReturnHelp' className='form-control' value={annualReturn+''} onChange={event => setAnnualReturn(parseFloat(event.target.value))} onBlur={event => setAnnualReturn(parseFloat(event.target.value))}>
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
        <Graph data={chartData} />
      </div>
    </div>
  </section>)
}
