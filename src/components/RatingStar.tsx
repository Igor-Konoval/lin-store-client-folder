import React from 'react';
import {FC} from "react/index";
import {Image} from "react-bootstrap";

interface IRatingStar {
    rating: number
}

const RatingStar:FC<IRatingStar> = ({rating}) => {

        const maxRating = 5;

        const filledStar = (
            <Image
                key="filled"
                alt="filled_star"
                width={20}
                height={20}
                src={process.env.REACT_APP_API_URL + "fullstar.png"}
            />
        );

        const halfStar = (
            <Image
                key={`half${Math.random()}`}
                alt="half_star"
                width={20}
                height={20}
                src={process.env.REACT_APP_API_URL + 'halfStar.png'}
                alt="Half_Star"
            />
        );

        const emptyStar = (
            <Image
                key={`empty${Math.random()}`}
                alt="empty_star"
                width={20}
                height={20}
                src={process.env.REACT_APP_API_URL + "star.png"}
            />
        );

        const stars = [];

        for (let i = 0; i < maxRating; i++) {
            if (i < rating - 0.5) {
                stars.push(filledStar);
            } else if (i + 0.5 === rating) {
                stars.push(halfStar);
            } else {
                stars.push(emptyStar);
            }
        }

    return (
        <>
            {stars}
        </>
    )
};

export default RatingStar;