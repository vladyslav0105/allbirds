import React from 'react'
import Link from 'next/link'
import ResponsiveImage from '@/components/ResponsiveImage'

import classes from "./ImageTextColumns.module.scss"

const ImageTextColumns = ({fields}) => {
    const {alt, columnCtaText, columnCtaText2, columnCtaUrl, columnCtaUrl2, columnText, columnText2, image, imageDescription, topPadding, bottomPadding} = fields
    return (
        <div className={`${classes['row']} ${columnCtaText2 ? 'flex--justify-between' : ''} container ${topPadding ? classes['top-padding'] : ''} ${bottomPadding ? classes['bottom-padding'] : ''}`}>
            {image && <div className={`${classes['col']} ${columnCtaText2 ? classes['quarter-width'] : ''} ${!columnCtaText2 ? classes['margin-right'] : ''}`}>
                <div className={classes['img-wrap']}>
                    {image && <ResponsiveImage
                        src={image?.asset.url}
                        alt={alt || ''}
                    />}
                </div>
                {imageDescription && <p>{imageDescription}</p>}
            </div>}

            {columnText && <div className={`${classes['text-col']} ${columnText2 ? classes['quarter-width'] : classes['half-width']}`}>
                {columnCtaText && <p>{columnText}</p>}

                <div className={classes['links']}>
                    {columnCtaUrl && <Link href={`${columnCtaUrl}`}>
                        <a className={`${classes['btn']} btn salmon no-underline text-align--center`}>
                            {columnCtaText}
                        </a>
                    </Link>}
                </div>
            </div>}

            {columnText && columnText2 && <div className={`${classes['text-col']} ${columnText2 ? classes['quarter-width'] : ''}`}>
                {columnText2 && <p>{columnText2}</p>}

                <div className={classes['links']}>
                    {columnCtaUrl2 && <Link href={`${columnCtaUrl2}`}>
                        <a className={`${classes['btn']} btn salmon no-underline text-align--center`}>
                            {columnCtaText2}
                        </a>
                    </Link>}
                </div>
            </div>}
        </div>
    )
}

export default ImageTextColumns