import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import classes from './RecipeArticleCard.module.scss';

const RecipeArticleCard = ({ article }) => {
  return (
    <Link href={`${article.handle.current}`}>
        <div className={classes['article__card']}>
            {article.heroImage.asset.url && <div className={classes['article__card-img']}>
                <Image
                    src={article.heroImage.asset.url}
                    layout="fill"
                    objectFit="cover"
                />
            </div>}
            <div className={classes['article__card-content']}>
                {article.heroSubheader && <span className="recipe--time">{article.heroSubheader}</span>}
                {article.heroHeader && <h1 className='heading--article'>{article.heroHeader}</h1>}
            </div>
        </div>
    </Link>
  );
};

export default RecipeArticleCard;
