import React from 'react';
import {FC} from "react/index";
import {Carousel, Image} from "react-bootstrap";
import statImg from '../assets/Screenshot_2.png';
const EventSlider:FC = () => {
    return (
        <Carousel>
            <Carousel.Item interval={2000}>
                <Image src={statImg} style={{ width: '100%', height: '300px' }}/>
            </Carousel.Item>
            <Carousel.Item interval={2000}>
                <Image src={statImg} style={{ width: '100%', height: '300px' }}/>
            </Carousel.Item>
            <Carousel.Item interval={2000}>
                <Image src={statImg} style={{ width: '100%', height: '300px' }}/>
            </Carousel.Item>
        </Carousel>
    );
};

export default EventSlider;