import React from 'react';
import { Navigation, A11y } from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export type CarouselProps = {
    portofolio: any;
}

const ImageCarousel: React.FC<CarouselProps> = ({portofolio}) => {

  return (
    <Swiper
    modules={[Navigation, A11y]}
    spaceBetween={20}
    slidesPerView={2}
    navigation
    onSlideChange={() => console.log('slide change')}
    onSwiper={(swiper) => console.log(swiper)}
    className=''>
        {
          portofolio && portofolio.length > 0 ?
          portofolio.map((item: any, i: number) => (
            <SwiperSlide key={i}>
              <div className='custom-slide'>
                <img src={item.portofolio_image} alt="portofolio" className='object-cover h-full' />
              </div>
            </SwiperSlide>
          ))
          : null
        }
    </Swiper>
  )
}

export default ImageCarousel
