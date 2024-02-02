import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import {FC} from "react/index";

interface ISelectRatingStar {
    handlerRating: (value: number) => {}
}
const SelectRatingStar:FC<ISelectRatingStar> = ({handlerRating}) => {
    const filledStar = (
        <Image
            key="filled"
            width={65}
            height={65}
            src={process.env.REACT_APP_API_URL + 'fullstar.png'}
            alt="Filled Star"
        />
    );

    const emptyStar = (
        <Image
            key="empty"
            width={65}
            height={65}
            src={process.env.REACT_APP_API_URL + 'star.png'}
            alt="Empty Star"
        />
    );

    const selectRatingInfo: string[] = ["погано", "не погано", "добре", "чудово", "супер!"]

    const [rating, setRating] = useState(0);


    const handleStarClick = (selectedRating: number) => {

        if (selectedRating == rating) {
            handlerRating(0);
            return setRating(0);
        }

        setRating(selectedRating);
        handlerRating(selectedRating);
    };

    const stars = [];

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <div className="d-flex justify-content-center flex-column align-items-center"
                key={i}
                onClick={() => handleStarClick(i)}
                style={{
                    cursor: 'pointer',
                    marginRight: '15px',
                }}
            >
                {i <= rating ? filledStar : emptyStar}
                {selectRatingInfo[i - 1]}
            </div>
        );
    }

    return (
        <>
            {stars}
        </>
    );
};

export default SelectRatingStar;
