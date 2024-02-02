import React, {useEffect, useState} from 'react';
import { FC } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Form, Row } from 'react-bootstrap';
import '../assets/index.less';
import '../moduleCSS/RangeSelect.css';
import { UseAppSelector } from '../hooks/redux';
import {IRangeProps} from "../models/IRangeSelect";

const RangeSelect: FC<IRangeProps> = ({ minPrice, maxPrice, onPriceChange, onWidthChange }) => {
    const prices = UseAppSelector((state) => state.ProductItemsSlice.fixedPrices);
    const [minValue, setMinValue] = useState(minPrice);
    const [maxValue, setMaxValue] = useState(maxPrice);
    const [widthMin, setWidthMin] = useState(0);
    const [widthMax, setWidthMax] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const totalWidth:number = widthMin + widthMax + width + 45;
        onWidthChange(totalWidth);
    }, [width, onWidthChange]);

    useEffect(() => {
        setMinValue(minPrice);
        setMaxValue(maxPrice);
    },[minPrice, maxPrice])

    const handleSliderChange = (values) => {
        setMinValue(values[0]);
        setMaxValue(values[1]);
    };

    const handleSliderAfterChange = (values) => {
        onPriceChange(values[0], values[1]);
    };

    return (
        <>
            <Row className="d-flex align-items-center justify-content-center flex-nowrap flex-row">
                <Form.Control
                    type="number"
                    className="no-arrows input-price"
                    ref={(el) => el && setWidthMin(el.offsetWidth)}
                    min={prices.minPrice}
                    max={prices.maxPrice}
                    value={minValue}
                    placeholder={`${prices.minPrice}`}
                    onChange={
                        (e) => {
                            setMinValue(Number(e.target.value))
                            onPriceChange(Number(e.target.value), maxValue)
                        }
                    }
                    style={{ width: 55 }}
                />
                <div
                    className="slider-container"
                    ref={(el) => el && setWidth(el.offsetWidth)}
                >
                    <Slider
                        range
                        allowCross={false}
                        value={[minValue, maxValue]}
                        min={prices.minPrice}
                        max={prices.maxPrice}
                        defaultValue={[minValue, maxValue]}
                        onChange={handleSliderChange}
                        onAfterChange={handleSliderAfterChange}
                    />
                </div>
                <Form.Control
                    type="number"
                    className="input-price"
                    min={prices.minPrice}
                    max={prices.maxPrice}
                    ref={(el) => el && setWidthMax(el.offsetWidth)}
                    value={maxValue}
                    placeholder={`${prices.maxPrice}`}
                    onChange={
                        (e) => {
                            setMaxValue(Number(e.target.value))
                            onPriceChange(minValue, Number(e.target.value))
                        }
                    }
                    style={{ width: 55 }}
                />
            </Row>
        </>
    );
};

export default RangeSelect;
