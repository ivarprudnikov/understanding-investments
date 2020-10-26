import React from 'react'
import img from './img/illustration-7.png'
import { MillionaireSection } from './MillionaireSection'
import { HousingSection } from './HousingSection';

export const HomePage = () => {
  return (<>
    <section className='position-relative py-4 py-md-5 mb-5'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-12 col-md-6 order-md-2'>
            <img className='img-fluid' src={img}  alt="Person looking at charts"/>
          </div>
          <div className='col-12 col-md-6 order-md-1'>

            <h1 className='display-4 page-title'>
              Understanding <br />
              <span className='text-primary small'>investments &amp; savings</span>.
            </h1>

            <p className='lead text-muted mb-6 mb-md-8'>
              How much should/could I save? Where do I start? How to invest?
              Similar questions bothered me for a while.
              Let&apos;s draw some graphs to see the money better.
            </p>

          </div>
        </div>
      </div>
    </section>

    <MillionaireSection />

    <HousingSection />

  </>)
}
